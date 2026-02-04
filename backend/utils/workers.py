import base64
import os
import asyncio
import logging
from pathlib import Path

import requests
from dotenv import load_dotenv
from requests.exceptions import Timeout

load_dotenv()

logger = logging.getLogger(__name__)

STEPS = 25
WIDTH = 512
HEIGHT = 512
TIMEOUT = 60

CLOUDFLARE_ACCOUNT_ID = os.environ.get("CLOUDFLARE_ACCOUNT_ID")
CLOUDFLARE_API_TOKEN = os.environ.get("CLOUDFLARE_API_TOKEN")
CLOUDFLARE_MODEL = os.environ.get("CLOUDFLARE_MODEL")

if not all([CLOUDFLARE_ACCOUNT_ID, CLOUDFLARE_API_TOKEN, CLOUDFLARE_MODEL]):
    raise RuntimeError(
        "Missing required env variables: "
        "CLOUDFLARE_ACCOUNT_ID, CLOUDFLARE_API_TOKEN, CLOUDFLARE_MODEL"
    )

URL = f"https://api.cloudflare.com/client/v4/accounts/{CLOUDFLARE_ACCOUNT_ID}/ai/run/{CLOUDFLARE_MODEL}"
HEADERS = {"Authorization": f"Bearer {CLOUDFLARE_API_TOKEN}"}


TEMP_DIR = Path(__file__).parent.parent / "temp"
TEMP_DIR.mkdir(exist_ok=True)


async def generate_image(
    image_id: str,
    prompt: str,
    steps: int = STEPS,
    width: int = WIDTH,
    height: int = HEIGHT,
    timeout: int = TIMEOUT,
) -> dict:
    """
    Generate an image using Cloudflare Workers AI.
    """
    result = {"image_id": image_id, "success": False, "error": None, "path": None}

    DATA = {"prompt": prompt, "steps": steps, "width": width, "height": height}

    # Network request handling (run in thread pool to avoid blocking)
    try:
        loop = asyncio.get_event_loop()
        response = await loop.run_in_executor(
            None,
            lambda: requests.post(URL, headers=HEADERS, files=DATA, timeout=timeout),
        )

    except Timeout:
        error_msg = f"Image generation timeout for {image_id}"
        logger.error(error_msg)
        result["error"] = error_msg
        return result

    except ConnectionError:
        error_msg = f"Image generation service unavailable for {image_id}"
        logger.error(error_msg)
        result["error"] = error_msg
        return result

    except requests.RequestException as e:
        error_msg = f"Failed to reach image generation service for {image_id}: {str(e)}"
        logger.error(error_msg)
        result["error"] = error_msg
        return result

    if response.status_code != 200:
        error_msg = (
            f"Image generation failed for {image_id} with status {response.status_code}"
        )
        logger.error(error_msg)
        result["error"] = error_msg
        return result

    try:
        payload = response.json()
    except requests.JSONDecodeError:
        error_msg = f"Invalid response from image generation service for {image_id}"
        logger.error(error_msg)
        result["error"] = error_msg
        return result

    if not payload:
        error_msg = f"Empty response from image generation service for {image_id}"
        logger.error(error_msg)
        result["error"] = error_msg
        return result

    # Decode base64 image and save it
    try:
        base64_img = payload["result"]["image"]
        image_bytes = base64.b64decode(base64_img)
    except (KeyError, TypeError) as e:
        error_msg = f"Failed to decode image data for {image_id}: {str(e)}"
        logger.error(error_msg)
        result["error"] = error_msg
        return result

    # Store image in temp folder
    image_filename = f"image-{image_id}.jpg"
    image_path = TEMP_DIR / image_filename

    try:
        with open(image_path, "wb") as f:
            f.write(image_bytes)
        result["success"] = True
        result["path"] = str(image_path)
        logger.info(f"Successfully generated and saved image: {image_filename}")
        return result
    except OSError as e:
        error_msg = f"Failed to save generated image {image_id}: {str(e)}"
        logger.error(error_msg)
        result["error"] = error_msg
        return result
