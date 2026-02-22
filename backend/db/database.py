import logging
import os
from datetime import datetime, timezone

from bson import ObjectId
from dotenv import load_dotenv
from gridfs import GridFS
from pymongo import MongoClient

load_dotenv()

logger = logging.getLogger(__name__)

MONGO_URI = str(os.getenv("MONGODB_URI"))
DB_NAME = str(os.getenv("DB_NAME"))

client = MongoClient(MONGO_URI)
db = client[DB_NAME]
fs = GridFS(db)


def get_db():
    return db


# Image helpers (GridFS)
def store_image(image_id: str, image_bytes: bytes, content_type: str = "image/jpeg") -> str:
    """Store image bytes in GridFS. Returns the GridFS file id as a string."""
    file_id = fs.put(
        image_bytes,
        filename=f"step-{image_id}.jpg",
        content_type=content_type,
        metadata={"step_id": image_id, "created_at": datetime.now(timezone.utc)},
    )
    logger.info("Stored image for step %s in GridFS (id=%s)", image_id, file_id)
    return str(file_id)


def get_image(file_id: str) -> tuple[bytes, str] | None:
    """Retrieve image bytes and content-type from GridFS by file id.

    Returns (bytes, content_type) or None if not found."""
    try:
        grid_out = fs.get(ObjectId(file_id))
        return grid_out.read(), grid_out.content_type or "image/jpeg"
    except Exception:
        logger.warning("Image not found in GridFS: %s", file_id)
        return None


# Project helpers (MongoDB collection)
def store_project(project_data: dict) -> str:
    """Insert a project document and return its id as a string."""
    project_data["created_at"] = datetime.now(timezone.utc)
    result = db.projects.insert_one(project_data)
    logger.info("Stored project %s", result.inserted_id)
    return str(result.inserted_id)


def get_project(project_id: str) -> dict | None:
    """Get a project document by id."""
    doc = db.projects.find_one({"_id": ObjectId(project_id)})
    if doc:
        doc["_id"] = str(doc["_id"])
    return doc


def update_step_image(project_id: str, step_number: int, image_url: str) -> None:
    """Update the image_url for a specific step in a project document."""
    db.projects.update_one(
        {"_id": ObjectId(project_id), "project.steps.step_number": step_number},
        {"$set": {"project.steps.$.image_url": image_url}},
    )
    logger.info(
        "Updated image_url for project %s, step %d", project_id, step_number
    )
