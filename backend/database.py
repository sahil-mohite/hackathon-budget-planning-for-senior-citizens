import os
from motor.motor_asyncio import AsyncIOMotorClient
# main.py
from dotenv import load_dotenv
load_dotenv()
# Replace the placeholders below with your actual values
MONGO_USERNAME = os.environ.get("MONGO_USERNAME", "MONGO_USERNAME")
MONGO_PASSWORD = os.environ.get("MONGO_PASSWORD", "MONGO_PASSWORD")
CLUSTER_NAME = os.environ.get("CLUSTER_NAME", "CLUSTER_NAME")
DB_NAME = "Billing-Db"


MONGO_URL = (
    f"mongodb+srv://{MONGO_USERNAME}:{MONGO_PASSWORD}"
    f"@{CLUSTER_NAME}.mongodb.net/?retryWrites=true&w=majority&appName=Billing-Data"
)

client = AsyncIOMotorClient(MONGO_URL)
auth_db = client[DB_NAME]
users_collection = auth_db["users"]
database = client[DB_NAME]
item_collection = database["bill_items"]
goal_collection = database["goals"]