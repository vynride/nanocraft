import os
from pathlib import Path
from typing import List

from dotenv import load_dotenv
from google import genai
from google.genai import types

load_dotenv()

CHAT_SYSTEM_PROMPT = Path("templates/chat_prompt.md").read_text(encoding="utf-8")

GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY")
GEMINI_MODEL = os.environ.get("GEMINI_MODEL")

if not GEMINI_API_KEY:
    raise RuntimeError("GEMINI_API_KEY is not set")

client = genai.Client(api_key=GEMINI_API_KEY)


def _build_system_prompt(project_data: dict) -> str:
    """Build a system prompt along with the project's context."""
    project = project_data.get("project", {})
    title = project.get("project_summary", "Unknown Project")
    visual_anchor = project.get("visual_anchor", "")

    steps_text = ""
    for step in project.get("steps", []):
        steps_text += (
            f"- **Step {step['step_number']}:** {step['scene_description']}\n"
        )

    return CHAT_SYSTEM_PROMPT.format(
        title=title,
        visual_anchor=visual_anchor,
        steps=steps_text or "No steps available.",
    )


def _map_history(history: List[dict]) -> List[types.Content]:
    """Convert frontend chat history to Gemini Content objects."""
    contents: List[types.Content] = []
    for msg in history:
        role = "user" if msg["role"] == "user" else "model"
        contents.append(
            types.Content(
                role=role,
                parts=[types.Part.from_text(text=msg["content"])],
            )
        )
    return contents


async def chat_with_project(
    project_data: dict,
    message: str,
    history: List[dict],
) -> str:
    """Send a message to Gemini with project context and chat history.

    Args:
        project_data: The full project document from MongoDB.
        message: The latest user message.
        history: Previous messages as [{"role": "user"|"assistant", "content": "..."}].

    Returns:
        The assistant's response text.
    """
    system_prompt = _build_system_prompt(project_data)

    # Build contents: history + current user message
    contents = _map_history(history)
    contents.append(
        types.Content(
            role="user",
            parts=[types.Part.from_text(text=message)],
        )
    )

    response = client.models.generate_content(
        model=str(GEMINI_MODEL),
        contents=contents,
        config=types.GenerateContentConfig(
            system_instruction=system_prompt,
        ),
    )

    if not response or not response.text:
        return "I'm sorry, I wasn't able to generate a response. Please try again."

    return response.text
