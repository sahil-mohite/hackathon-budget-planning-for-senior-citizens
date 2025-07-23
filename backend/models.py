from pydantic import BaseModel, EmailStr, Field
from typing import Dict, Any, Optional
from bson import ObjectId


class SignUpRequest(BaseModel):
    username: str
    email: EmailStr
    password: str
    financialDetials: Dict[str, Any]

class SignInRequest(BaseModel):
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"

class ProcessedItemInDB(BaseModel):
    id: str = Field(alias="_id")
    user_id: str
    store_name: Optional[str] = None
    bill_date: Optional[str] = None
    total_amount: Optional[float] = None
    item_name: Optional[str] = None
    quantity: Optional[float] = None
    unit_price: Optional[float] = None
    category: Optional[str] = None
    input_type: str
    created_at: datetime.datetime

class Config:
    populate_by_name = True
    json_encoders = {ObjectId: str}
    arbitrary_types_allowed = True

class FinancialGoal(BaseModel):
    user_id: str
    goal_description: str = Field(..., description="The user's financial goal for the month.", example="Save $500 for a vacation.")
    month: str = Field(..., description="The month for the goal, e.g., '2024-07'")

class GoalInDB(FinancialGoal):
    id: str = Field(alias="_id")
    created_at: datetime.datetime

class ExpenseItem(BaseModel):
    # A simplified model for returning expense data
    store_name: Optional[str] = None
    bill_date: Optional[str] = None
    item_name: Optional[str] = None
    quantity: Optional[float] = None
    unit_price: Optional[float] = None
    category: Optional[str] = None

class InsightResponse(BaseModel):
    user_id: str
    goal_description: str
    insights: str
