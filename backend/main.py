import asyncio
from db.database import get_db
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from models.instruction import Instruction, Project
from pydantic import BaseModel, ValidationError
from utils.gemini import generate_instructions
from utils.scraper import scrape_site
from utils.workers import generate_image

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


@app.get("/")
async def root():
    return {"status": "NanoCraft backend running"}


@app.get("/test-db")
def test_db():
    db = get_db()
    result = db.test.insert_one({"message": "MongoDB connected successfully"})
    return {"inserted_id": str(result.inserted_id)}


async def _generate_images_background(project_data: dict):
    """Generate images in background without blocking response"""
    image_tasks = [
        generate_image(
            image_id=str(step["step_number"]),
            prompt=f"{project_data['visual_anchor']}. {step['scene_description']}",
        )
        for step in project_data["steps"]
    ]

    # Gather all image generation results with error handling
    image_results = await asyncio.gather(*image_tasks, return_exceptions=True)

    successful_images = 0
    failed_images = 0
    for result in image_results:
        if isinstance(result, Exception):
            failed_images += 1
            print(f"Image generation error: {str(result)}")
        elif isinstance(result, dict) and result.get("success"):
            successful_images += 1
        else:
            failed_images += 1
            if isinstance(result, dict):
                print(f"Image generation failed: {result.get('error')}")

    print(
        f"Image generation complete: {successful_images} successful, {failed_images} failed"
    )


@app.post("/new-chat", response_model=Instruction)
async def new_chat(payload: NewChatRequest):
    try:
        scraped_content = await scrape_site(payload.instructables_url)
        if not scraped_content:
            raise HTTPException(status_code=400, detail="Failed to scrape content")

        project: Project = await generate_instructions(scraped_content)

        project_data = project.model_dump()

        asyncio.create_task(_generate_images_background(project_data))

        return Instruction(source_url=payload.instructables_url, project=project)

    except ValidationError as e:
        raise HTTPException(status_code=422, detail=e.errors()) from e
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) from e
