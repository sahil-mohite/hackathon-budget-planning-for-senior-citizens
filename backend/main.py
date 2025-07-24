# main.py
from dotenv import load_dotenv
load_dotenv()
import os
import io
import datetime
import json
from fastapi import FastAPI, File, UploadFile, Form, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional, List
from auth import hash_password, verify_password, create_jwt_token, get_current_user
from models import SignUpRequest, SignInRequest, TokenResponse, ProcessedItemInDB
from fastapi.security import OAuth2PasswordBearer
from database import users_collection, item_collection
from pydantic import BaseModel, EmailStr, Field,constr
from typing import Optional

import google.generativeai as genai
from PIL import Image

# --- Configuration ---
GOOGLE_API_KEY = os.environ.get("GOOGLE_API_KEY", "GOOGLE_API_KEY")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="signin")


# --- Initialize FastAPI App ---
app = FastAPI(
    title="Data Processing Service",
    description="Accepts text and/or an image, extracts item data with categories, and stores each item individually.",
    version="1.4.2" # Updated version
)

# --- CORS (Cross-Origin Resource Sharing) ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# --- Configure Gemini API ---
try:
    genai.configure(api_key=GOOGLE_API_KEY)
except Exception as e:
    print(f"Error configuring Gemini API: {e}. Please ensure GOOGLE_API_KEY is set correctly.")

# --- Helper Function ---
def fix_object_id(doc):
    """Converts ObjectId to string for JSON serialization."""
    if doc and "_id" in doc:
        doc["_id"] = str(doc["_id"])
    return doc

# --- API Endpoint ---

@app.get("/auth/validate-email")
async def validate_email(email: str):
    user = await users_collection.find_one({"email": email})
    if user:
        raise HTTPException(status_code=400, detail="Email already registered")
    return {"available": True}


@app.post("/auth/signup")
async def signup(payload: SignUpRequest):
    print(payload.dict())
    existing_user = await users_collection.find_one({"email": payload.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    financialDetails = {
        "additionalDetails": payload.financialDetails.additionalDetails,
        "income": payload.financialDetails.income,
        "getsPension": payload.financialDetails.getsPension,
        "pensionAmount": payload.financialDetails.pensionAmount,
        "investsInStocks": payload.financialDetails.investsInStocks,
        "yearlyStockInvestment": payload.financialDetails.yearlyStockInvestment,
    }
    
    user = {
        "firstName": payload.firstName,
        "lastName": payload.lastName,
        "address": payload.address,
        "email": payload.email,
        "phone": payload.phone,
        "password": hash_password(payload.password),
        "financialDetails": financialDetails
    }
    await users_collection.insert_one(user)
    return {"message": "User created successfully"}

@app.post("/auth/signin", response_model=TokenResponse)
async def signin(payload: SignInRequest):
    user = await users_collection.find_one({"email": payload.email})
    if not user or not verify_password(payload.password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    token = create_jwt_token({"sub": user["email"]})
    return {"access_token": token}

@app.get("/home")
async def get_profile(current_user: dict = Depends(get_current_user)):
    return {
        "email": current_user["email"]
    }

@app.get("/getUserData")
async def get_user_data(current_user: dict = Depends(get_current_user)):
    # Access user's email or ID from JWT
    user_email = current_user.get("email")
    
    # Get user data from DB
    user_data = await users_collection.find_one({"email": user_email}, {"_id": 0})  # exclude _id if not needed

    if not user_data:
        raise HTTPException(status_code=404, detail="User not found")

    return user_data


class FinancialDetails(BaseModel):
    additionalDetails: Optional[str] = None
    income: Optional[str] = None
    getsPension: Optional[bool] = None
    pensionAmount: Optional[str] = None
    investsInStocks: Optional[bool] = None
    yearlyStockInvestment: Optional[str] = None

class UserUpdate(BaseModel):
    firstName: Optional[str] = None
    lastName: Optional[str] = None
    address: Optional[str] = None
    #email: Optional[EmailStr] = None  # Usually not updated, but optional here
    phone: Optional[constr(pattern=r'^\+?\d{10}$')] = None
    #password: Optional[str] = None  # Handle password updates carefully!
    financialDetails: Optional[FinancialDetails] = None


@app.put("/updateUserData")
async def update_user_data(
    user_update: UserUpdate,
    current_user: dict = Depends(get_current_user)
):
    user_email = current_user.get("email")

    existing_user = await users_collection.find_one({"email": user_email})
    if not existing_user:
        raise HTTPException(status_code=404, detail="User not found")

    update_data = user_update.dict(exclude_unset=True)

    # If updating password, hash it before saving (optional, depends on your auth flow)
    if "password" in update_data:
        # example: update_data["password"] = hash_password(update_data["password"])
        pass

    # Update nested financialDetails if present
    if "financialDetails" in update_data:
        financial_update = update_data.pop("financialDetails")
        # Use MongoDB $set with dot notation to update nested fields
        for key, value in financial_update.items():
            update_data[f"financialDetails.{key}"] = value

    if not update_data:
        raise HTTPException(status_code=400, detail="No fields provided for update")

    result = await users_collection.update_one(
        {"email": user_email},
        {"$set": update_data}
    )

    if result.modified_count == 0:
        return {"message": "No changes were made to the user data."}

    return {"message": "User data updated successfully", "updated_fields": update_data}



@app.post("/process/", response_model=List[ProcessedItemInDB], status_code=201)
async def process_data_and_store(
    user_id: str = Form(...),
    image: Optional[UploadFile] = File(None),
    image_base64: Optional[str] = Form(None),  # add this line!
    user_explanation: Optional[str] = Form(None),
    # current_user: dict = Depends(get_current_user)
):
    if not image and not user_explanation:
        raise HTTPException(
            status_code=400,
            detail="Please provide either an image or a text explanation to process."
        )

    base_prompt = """
    Analyze the provided information (text and/or image). Your primary task is to extract bill information and present it as a valid JSON object.

    The JSON object must follow this structure:
    - `store_name`: The name of the store.
    - `bill_date`: The date of the bill (format YYYY-MM-DD if possible).
    - `total_amount`: The total amount paid for the bill as a number.
    - `items`: A list of dictionaries, where each dictionary represents an item and has:
        - `item_name`: Name of the product.
        - `quantity`: Quantity of the item as a number.
        - `unit_price`: Price per unit of the item as a number.
        - `category`: The category of the item. Choose from one of the following options: ['Retail', 'Food', 'Clothing', 'Travel', 'Entertainment', 'Utilities', 'Other'].

    IMPORTANT: For every item in the 'items' array, the 'unit_price', 'quantity', and 'category' fields MUST NOT be null. If you cannot determine these values for an item, do not include that item in the list. If no items have all the required fields, return an empty 'items' list.
    """
    final_prompt = base_prompt
    if user_explanation:
        final_prompt += f"\n\nHere is some additional context from the user: '{user_explanation}'"

    gemini_payload = [final_prompt]
    input_type = "text"

    try:
        if image:
            if not image.content_type.startswith("image/"):
                raise HTTPException(status_code=400, detail="Uploaded file is not a valid image type.")
            contents = await image.read()
            pil_image = Image.open(io.BytesIO(contents))
            gemini_payload.append(pil_image)
            input_type = "image" if user_explanation else "image_only"
        elif image_base64:
            header, encoded = image_base64.split(",", 1)
            image_bytes = base64.b64decode(encoded)
            pil_image = Image.open(io.BytesIO(image_bytes))
            gemini_payload.append(pil_image)
            input_type = "image_base64" if user_explanation else "image_only_base64"
        print(gemini_payload)
        model = genai.GenerativeModel("gemini-1.5-flash")
        response = await model.generate_content_async(gemini_payload)
        cleaned_text = response.text.replace("```json", "").replace("```", "").strip()
        generated_json = json.loads(cleaned_text)

    except json.JSONDecodeError:
        error_message = "Sorry, the AI could not return a valid format. Please try again."
        raise HTTPException(status_code=422, detail=error_message)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An unexpected error occurred during AI processing: {e}")

    # --- Data Processing and Individual Storage ---
    items_to_store = []
    bill_items = generated_json.get("items")

    if not bill_items or not isinstance(bill_items, list):
        raise HTTPException(status_code=422, detail="AI response did not contain a valid list of items.")

    # --- NEW VALIDATION STEP ---
    # This loop ensures data integrity before saving to the database.
    for item in bill_items:
        if not all(k in item and item[k] is not None for k in ['unit_price', 'quantity', 'category']):
            error_detail = (
                f"Invalid data from AI: An item was returned with missing required fields (unit_price, quantity, or category). "
                f"Please try again. Offending item: {item}"
            )
            raise HTTPException(status_code=422, detail=error_detail)

    # Extract common bill information
    common_info = {
        "user_id": user_id,
        "store_name": generated_json.get("store_name"),
        "bill_date": generated_json.get("bill_date") or datetime.date.today().isoformat(),
        "total_amount": generated_json.get("total_amount"),
        "input_type": input_type,
        "created_at": datetime.datetime.utcnow(),
    }

    for item in bill_items:
        if isinstance(item, dict):
            new_doc = {**common_info, **item}
            items_to_store.append(new_doc)

    if not items_to_store:
        raise HTTPException(status_code=422, detail="No valid items were found to store after validation.")

    # Use insert_many for efficient bulk insertion
    result = await item_collection.insert_many(items_to_store)

    # Fetch the newly created documents to return them
    created_records = await item_collection.find({"_id": {"$in": result.inserted_ids}}).to_list(length=None)

    return [fix_object_id(record) for record in created_records]


@app.get("/")
def read_root(current_user: dict = Depends(get_current_user)):
    return {"message": "Data Processing Service is running. Use the /process/ endpoint."}
