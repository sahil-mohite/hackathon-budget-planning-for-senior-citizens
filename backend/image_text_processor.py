# main.py
import base64
from dotenv import load_dotenv
load_dotenv()
import os
import io
import datetime
import json
from fastapi import FastAPI, File, UploadFile, Form, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional, List, Union
from auth_utils import get_current_user
from models import ProcessedItemInDB
from database import item_collection

import google.generativeai as genai
from PIL import Image

# --- Configuration ---
GOOGLE_API_KEY = os.environ.get("GOOGLE_API_KEY", "GOOGLE_API_KEY")


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

@app.post("/process", response_model=Union[List[ProcessedItemInDB], dict], status_code=201)
async def process_data_and_store(
    current_user: dict = Depends(get_current_user),
    image: Optional[UploadFile] = File(None),
    image_base64: Optional[str] = Form(None),
    user_explanation: Optional[str] = Form(None)
):
    user_id = current_user["email"]

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

    If no bill information is present or cannot be extracted, behave like a regular chatbot and respond conversationally.
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

        model = genai.GenerativeModel("gemini-1.5-flash")
        response = await model.generate_content_async(gemini_payload)
        cleaned_text = response.text.replace("```json", "").replace("```", "").strip()

        print("[Gemini Response]:", cleaned_text)

        try:
            generated_json = json.loads(cleaned_text)
        except json.JSONDecodeError:
            return {"message": cleaned_text}

        bill_items = generated_json.get("items")
        if not bill_items or not isinstance(bill_items, list):
            return {"message": cleaned_text}

        items_to_store = []
        for item in bill_items:
            if not all(k in item and item[k] is not None for k in ['unit_price', 'quantity', 'category']):
                continue
            new_doc = {
                "user_id": user_id,
                "store_name": generated_json.get("store_name"),
                "bill_date": generated_json.get("bill_date") or datetime.date.today().isoformat(),
                "total_amount": generated_json.get("total_amount"),
                "input_type": input_type,
                "created_at": datetime.datetime.utcnow(),
                **item,
            }
            items_to_store.append(new_doc)

        if not items_to_store:
            return {
                "message": "No valid expense data found. Here’s the AI response:",
                "ai_response": cleaned_text
            }

        result = await item_collection.insert_many(items_to_store)
        created_records = await item_collection.find({"_id": {"$in": result.inserted_ids}}).to_list(length=None)
        return [ProcessedItemInDB(**fix_object_id(rec)) for rec in created_records]

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An unexpected error occurred: {str(e)}")

@app.get("/")
def read_root(current_user: dict = Depends(get_current_user)):
    return {"message": "Data Processing Service is running. Use the /process/ endpoint."}
