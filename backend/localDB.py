import os
from motor.motor_asyncio import AsyncIOMotorClient

# Replace the placeholders below with your actual values
MONGO_DETAILS = os.environ.get("MONGO_DETAILS", "mongodb://localhost:27017")
DB_NAME = "Billing-db"


client = AsyncIOMotorClient(MONGO_DETAILS)
auth_db = client[DB_NAME]
users_collection = auth_db["users"]
database = client.gemini_insights
item_collection = database.get_collection("bill_items")