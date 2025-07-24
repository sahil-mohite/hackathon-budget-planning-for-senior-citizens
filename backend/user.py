from dotenv import load_dotenv
load_dotenv()
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from auth_utils import hash_password, verify_password, create_jwt_token, get_current_user
from models import SignUpRequest, SignInRequest, TokenResponse
from fastapi.security import OAuth2PasswordBearer
from database import users_collection


# --- Configuration ---
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
