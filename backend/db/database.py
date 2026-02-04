import os

from dotenv import load_dotenv
from pymongo import MongoClient

load_dotenv()

MONGO_URI = str(os.getenv("MONGODB_URI"))
DB_NAME = str(os.getenv("DB_NAME"))

client = MongoClient(MONGO_URI)
if client:
    db = client[DB_NAME]


def get_db():
    return db
