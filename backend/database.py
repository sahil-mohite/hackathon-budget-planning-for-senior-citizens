import os
from motor.motor_asyncio import AsyncIOMotorClient

# Replace the placeholders below with your actual values
MONGO_USERNAME = os.environ.get("MONGO_USERNAME", "MONGO_USERNAME")
MONGO_PASSWORD = os.environ.get("MONGO_PASSWORD", "MONGO_PASSWORD")
CLUSTER_NAME = os.environ.get("CLUSTER_NAME", "CLUSTER_NAME")
DB_NAME = "Billing-Data"

MONGO_URL = (
    f"mongodb+srv://{MONGO_USERNAME}:{MONGO_PASSWORD}"
    f"@{CLUSTER_NAME}.mongodb.net/{DB_NAME}?retryWrites=true&w=majority"
)

client = AsyncIOMotorClient(MONGO_URL)
auth_db = client[DB_NAME]
users_collection = auth_db["users"]
database = client.gemini_insights
item_collection = database.get_collection("bill_items")