import os
from motor.motor_asyncio import AsyncIOMotorClient

# Replace the placeholders below with your actual values
MONGO_USERNAME = os.environ.get("MONGO_USERNAME", "MONGO_USERNAME")
MONGO_PASSWORD = os.environ.get("MONGO_PASSWORD", "MONGO_PASSWORD")

MONGO_URL = (
    f"mongodb+srv://{MONGO_USERNAME}:{MONGO_PASSWORD}"
    f"@billing-data.rgnagne.mongodb.net/?retryWrites=true&w=majority&appName=Billing-Data"
)

client = AsyncIOMotorClient(MONGO_URL)
DB_NAME = "Billing-Db"
auth_db = client[DB_NAME]
users_collection = auth_db["users"]
databas = client["gemini_insights"]
item_collection = databas["bill_items"]
goal_collection = databas["goals"]