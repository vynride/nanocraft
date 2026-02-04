import os
from pathlib import Path

from dotenv import load_dotenv
from fastapi import HTTPException
from google import genai
from google.genai import types
from models.instruction import Project
from pydantic import ValidationError

load_dotenv()

SYSTEM_PROMPT = Path("templates/system_prompt.md").read_text(encoding="utf-8")

GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY")
GEMINI_MODEL = os.environ.get("GEMINI_MODEL")

if not GEMINI_API_KEY:
    raise RuntimeError("GEMINI_API_KEY is not set")

client = genai.Client(api_key=GEMINI_API_KEY)


async def generate_instructions(content: str) -> Project:
    if not content:
        raise HTTPException(status_code=400, detail="Empty response from scraper")

    prompt = f"{SYSTEM_PROMPT}\n\nDIY TEXT\n\n{content}"

    try:
        response = client.models.generate_content(
            model=str(GEMINI_MODEL),
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
                response_json_schema=Project.model_json_schema(),
                thinking_config=types.ThinkingConfig(thinking_level="medium"),
            ),
        )
    except Exception as e:
        raise HTTPException(
            status_code=502, detail=f"Gemini request failed: {e}"
        ) from e

    if not response or not response.text:
        raise HTTPException(status_code=502, detail="Gemini returned empty response")

    try:
        return Project.model_validate_json(response.text)
    except ValidationError as e:
        raise HTTPException(
            status_code=500,
            detail=f"Gemini output failed schema validation: {e}",
        ) from e
