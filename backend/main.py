import asyncio
import logging

from bson import ObjectId
from db.database import get_db, store_image, store_project, update_step_image, get_project, get_image
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response
from models.instruction import Instruction, Project
from pydantic import BaseModel, ValidationError
from utils.chat import chat_with_project
from utils.gemini import generate_instructions
from utils.scraper import scrape_site
from utils.workers import generate_image

logger = logging.getLogger(__name__)

app = FastAPI(title="NanoCraft Backend")

origins = [
    "http://localhost:5173",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class NewChatRequest(BaseModel):
    instructables_url: str


class ChatMessageRequest(BaseModel):
    message: str
    history: list[dict] = []


@app.get("/")
async def root():
    return {"status": "NanoCraft backend running"}


@app.get("/test-db")
def test_db():
    db = get_db()
    result = db.test.insert_one({"message": "MongoDB connected successfully"})
    return {"inserted_id": str(result.inserted_id)}


async def _generate_images_background(project_id: str, project_data: dict):
    """Generate images sequentially, store in GridFS, and update project doc."""
    successful = 0
    failed = 0

    for step in project_data["steps"]:
        step_num = step["step_number"]
        prompt = f"{project_data['visual_anchor']}. {step['scene_description']}"

        try:
            result = await generate_image(
                image_id=str(step_num),
                prompt=prompt,
            )
        except Exception as e:
            failed += 1
            logger.error("Image generation exception for step %s: %s", step_num, e)
            continue

        if result.get("success") and result.get("image_bytes"):
            try:
                gridfs_id = store_image(
                    image_id=result["image_id"],
                    image_bytes=result["image_bytes"],
                )
                image_url = f"/images/{gridfs_id}"
                update_step_image(
                    project_id=project_id,
                    step_number=step_num,
                    image_url=image_url,
                )
                successful += 1
            except Exception as e:
                failed += 1
                logger.error("Failed to store image %s: %s", step_num, e)
        else:
            failed += 1
            logger.error("Image gen failed for step %s: %s", step_num, result.get("error"))

        # Small delay between requests to avoid rate limits on Cloudflare
        await asyncio.sleep(0.5)

    logger.info(
        "Image generation complete for project %s: %d ok, %d failed",
        project_id, successful, failed,
    )


@app.post("/new-chat", response_model=Instruction)
async def new_chat(payload: NewChatRequest):
    try:
        scraped_content = await scrape_site(payload.instructables_url)
        if not scraped_content:
            raise HTTPException(status_code=400, detail="Failed to scrape content")

        project: Project = await generate_instructions(scraped_content)

        project_data = project.model_dump()

        # Store project in MongoDB
        doc = {
            "source_url": payload.instructables_url,
            "project": project_data,
        }
        project_id = store_project(doc)

        # Background image generation
        asyncio.create_task(
            _generate_images_background(project_id, project_data)
        )

        return Instruction(
            id=project_id,
            source_url=payload.instructables_url,
            project=project,
        )

    except ValidationError as e:
        raise HTTPException(status_code=422, detail=e.errors()) from e
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) from e


@app.get("/projects/{project_id}")
async def get_project_endpoint(project_id: str):
    """Return a project with current image URLs (for polling)"""
    try:
        ObjectId(project_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid project ID")

    doc = get_project(project_id)
    if not doc:
        raise HTTPException(status_code=404, detail="Project not found")

    return {
        "id": doc["_id"],
        "source_url": doc.get("source_url", ""),
        "project": doc.get("project", {}),
    }


@app.get("/images/{file_id}")
async def get_image_endpoint(file_id: str):
    """Serve an image from GridFS."""
    try:
        ObjectId(file_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid image ID")

    result = get_image(file_id)
    if result is None:
        raise HTTPException(status_code=404, detail="Image not found")

    image_bytes, content_type = result
    return Response(content=image_bytes, media_type=content_type)


@app.post("/projects/{project_id}/chat")
async def project_chat(project_id: str, payload: ChatMessageRequest):
    """Send a message to the AI chatbot in the context of a project"""
    try:
        ObjectId(project_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid project ID")

    doc = get_project(project_id)
    if not doc:
        raise HTTPException(status_code=404, detail="Project not found")

    try:
        response_text = await chat_with_project(
            project_data=doc,
            message=payload.message,
            history=payload.history,
        )
        return {"response": response_text}
    except Exception as e:
        logger.error("Chat error for project %s: %s", project_id, e)
        raise HTTPException(status_code=500, detail=str(e)) from e
