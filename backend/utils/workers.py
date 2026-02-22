import asyncio
import base64
import os
import logging

import httpx
from dotenv import load_dotenv

load_dotenv()

logger = logging.getLogger(__name__)

STEPS = 8
WIDTH = 512
HEIGHT = 512
TIMEOUT = 40
MAX_RETRIES = 3
RETRY_BACKOFF = 2

CLOUDFLARE_ACCOUNT_ID = os.environ.get("CLOUDFLARE_ACCOUNT_ID")
CLOUDFLARE_API_TOKEN = os.environ.get("CLOUDFLARE_API_TOKEN")
CLOUDFLARE_MODEL = os.environ.get("CLOUDFLARE_MODEL")

if not all([CLOUDFLARE_ACCOUNT_ID, CLOUDFLARE_API_TOKEN, CLOUDFLARE_MODEL]):
    raise RuntimeError(
        "Missing required env variables: "
        "CLOUDFLARE_ACCOUNT_ID, CLOUDFLARE_API_TOKEN, CLOUDFLARE_MODEL"
    )

URL = f"https://api.cloudflare.com/client/v4/accounts/{CLOUDFLARE_ACCOUNT_ID}/ai/run/{CLOUDFLARE_MODEL}"
HEADERS = {
    "Authorization": f"Bearer {CLOUDFLARE_API_TOKEN}",
}


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
    result = {
        "image_id": image_id,
        "success": False,
        "error": None,
        "image_bytes": None,
    }

    # Cloudflare Workers AI image models expect multipart form data
    form_data = {
        "prompt": prompt,
        "num_steps": str(steps),
        "width": str(width),
        "height": str(height),
    }

    last_error: str | None = None

    for attempt in range(MAX_RETRIES + 1):
        try:
            async with httpx.AsyncClient(timeout=timeout) as client:
                response = await client.post(URL, headers=HEADERS, data=form_data)
        except httpx.TimeoutException:
            last_error = f"Image generation timeout for {image_id}"
            logger.warning(
                "Attempt %d/%d: %s", attempt + 1, MAX_RETRIES + 1, last_error
            )
            await asyncio.sleep(RETRY_BACKOFF * (2**attempt))
            continue
        except httpx.ConnectError:
            last_error = f"Image generation service unavailable for {image_id}"
            logger.warning(
                "Attempt %d/%d: %s", attempt + 1, MAX_RETRIES + 1, last_error
            )
            await asyncio.sleep(RETRY_BACKOFF * (2**attempt))
            continue
        except httpx.RequestError as e:
            last_error = f"Failed to reach image generation service for {image_id}: {e}"
            logger.warning(
                "Attempt %d/%d: %s", attempt + 1, MAX_RETRIES + 1, last_error
            )
            await asyncio.sleep(RETRY_BACKOFF * (2**attempt))
            continue

        # Retry on server errors (5xx)
        if response.status_code >= 500:
            last_error = (
                f"Image generation failed for {image_id} "
                f"with status {response.status_code}: {response.text[:200]}"
            )
            logger.warning(
                "Attempt %d/%d: %s", attempt + 1, MAX_RETRIES + 1, last_error
            )
            await asyncio.sleep(RETRY_BACKOFF * (2**attempt))
            continue

        # Non-retryable error (4xx)
        if response.status_code != 200:
            result["error"] = (
                f"Image generation failed for {image_id} "
                f"with status {response.status_code}: {response.text[:200]}"
            )
            logger.error(result["error"])
            return result

        # Success, break out of retry loop
        break
    else:
        # All retries exhausted
        result["error"] = last_error
        logger.error("All retries exhausted for step %s: %s", image_id, last_error)
        return result

    try:
        resp_json = response.json()
    except Exception:
        result["error"] = (
            f"Invalid JSON response from image generation service for {image_id}"
        )
        logger.error(result["error"])
        return result

    if not resp_json:
        result["error"] = f"Empty response from image generation service for {image_id}"
        logger.error(result["error"])
        return result

    # Decode base64 image
    try:
        base64_img = resp_json["result"]["image"]
        image_bytes = base64.b64decode(base64_img)
    except (KeyError, TypeError) as e:
        result["error"] = f"Failed to decode image data for {image_id}: {e}"
        logger.error(result["error"])
        return result

    result["success"] = True
    result["image_bytes"] = image_bytes
    logger.info(
        "Successfully generated image for step %s (attempt %d)", image_id, attempt + 1
    )
    return result
