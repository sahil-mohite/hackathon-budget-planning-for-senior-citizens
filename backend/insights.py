# insights.py
import os
import datetime
import json
from fastapi import Depends, FastAPI, APIRouter, HTTPException, Path
from typing import List
import google.generativeai as genai
from dotenv import load_dotenv
from models import FinancialGoal, GoalInDB, ExpenseItem, InsightResponse
from auth import get_current_user
from database import item_collection, goal_collection

# Load environment variables from .env file
load_dotenv()

# --- Configuration ---
GOOGLE_API_KEY = os.environ.get("GOOGLE_API_KEY")

# --- Initialize FastAPI Router ---
# Using APIRouter allows us to keep these endpoints separate from main.py
router = APIRouter()


# --- Configure Gemini API ---
if GOOGLE_API_KEY:
    try:
        genai.configure(api_key=GOOGLE_API_KEY)
    except Exception as e:
        print(f"Error configuring Gemini API: {e}")
else:
    print("GOOGLE_API_KEY not found. Insights endpoint will not work.")


# --- Helper Function ---
def fix_object_id(doc):
    if doc and "_id" in doc:
        doc["_id"] = str(doc["_id"])
    return doc

# --- Endpoint 1: Set Financial Goal ---
@router.post("/goals", response_model=GoalInDB, status_code=201)
async def set_financial_goal(goal: FinancialGoal, current_user: dict = Depends(get_current_user)):
    """
    Accepts a user_id and their financial goal for the month and stores it.
    This will overwrite any existing goal for the same user and month.
    """
    goal_dict = goal.dict()
    goal_dict["created_at"] = datetime.datetime.utcnow()

    # Use update_one with upsert=True to either create a new goal or update an existing one
    await goal_collection.update_one(
        {"user_id": goal.user_id, "month": goal.month},
        {"$set": goal_dict},
        upsert=True
    )

    # Fetch the newly created/updated document to return it
    created_goal = await goal_collection.find_one({"user_id": goal.user_id, "month": goal.month})
    return fix_object_id(created_goal)


# --- Endpoint 2: Get User Expenses ---
@router.get("/expenses/{user_id}", response_model=List[ExpenseItem])
async def get_user_expenses(user_id: str = Path(..., description="The ID of the user to fetch expenses for."), current_user: dict = Depends(get_current_user)):
    """
    Fetches all the bill items (expenses) from the database for a specific user.
    """
    expenses_cursor = item_collection.find({"user_id": user_id})
    expenses = await expenses_cursor.to_list(length=1000) # Capping at 1000 expenses for safety
    if not expenses:
        raise HTTPException(status_code=404, detail="No expenses found for this user.")
    return expenses


# --- Endpoint 3: Get Financial Insights ---
@router.get("/insights/{user_id}", response_model=InsightResponse)
async def get_financial_insights(user_id: str = Path(..., description="The ID of the user to generate insights for."), current_user: dict = Depends(get_current_user)):
    """
    Fetches the user's goal and expenses, then uses Gemini to generate insights.
    """
    if not GOOGLE_API_KEY:
        raise HTTPException(status_code=503, detail="AI Service is not configured on the server.")

    # 1. Fetch the user's most recent goal
    current_month = datetime.datetime.now().strftime("%Y-%m")
    goal = await goal_collection.find_one({"user_id": user_id, "month": current_month})
    if not goal:
        raise HTTPException(status_code=404, detail=f"No financial goal found for user {user_id} for the current month. Please set a goal first.")

    # 2. Fetch all user expenses
    expenses_cursor = item_collection.find({"user_id": user_id})
    expenses = await expenses_cursor.to_list(length=1000)
    if not expenses:
        raise HTTPException(status_code=404, detail=f"No expenses found for user {user_id}. Cannot generate insights without spending data.")

    # 3. Create a prompt for Gemini
    # Convert expenses to a more readable format for the AI
    expenses_summary = json.dumps([
        {
            "item": doc.get("item_name"),
            "category": doc.get("category"),
            "cost": doc.get("quantity", 1) * doc.get("unit_price", 0)
        }
        for doc in expenses if doc.get("quantity") is not None and doc.get("unit_price") is not None
    ], indent=2)

    prompt = f"""
    Analyze the following financial data for a user.

    User's Goal: "{goal['goal_description']}"

    User's Spending History for this month:
    {expenses_summary}

    Based on their spending, provide actionable, personalized insights and tips on how they can achieve their goal. Structure your response with clear headings. Focus on identifying spending patterns, suggesting specific areas for savings, and offering encouragement. Maximum 5 insights. 10 words max each.
    """

    # 4. Call Gemini
    try:
        model = genai.GenerativeModel("gemini-1.5-flash")
        response = await model.generate_content_async(prompt)
        insights_text = response.text
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred while generating insights: {e}")

    return InsightResponse(
        user_id=user_id,
        goal_description=goal['goal_description'],
        insights=insights_text
    )
