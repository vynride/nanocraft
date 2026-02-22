import logging

import httpx
from bs4 import BeautifulSoup

logger = logging.getLogger(__name__)

_TIMEOUT = 20.0
_MAX_RETRIES = 2


async def scrape_site(url: str) -> str:
    """
    Scrape an Instructables page and return its textual content as a string.
    """
    if not url or not url.strip():
        raise ValueError("A valid URL is required for scraping")

    last_exception: Exception | None = None

    for attempt in range(_MAX_RETRIES + 1):
        try:
            async with httpx.AsyncClient(
                timeout=_TIMEOUT,
                follow_redirects=True,
                headers={
                    "User-Agent": (
                        "Mozilla/5.0 (compatible; NanoCraftBot/1.0; "
                        "+https://nanocraft.dev)"
                    )
                },
            ) as client:
                response = await client.get(url)
                response.raise_for_status()
                break

        except httpx.TimeoutException as exc:
            last_exception = exc
            logger.warning(
                "Scrape attempt %d/%d timed out for %s",
                attempt + 1,
                _MAX_RETRIES + 1,
                url,
            )
        except httpx.HTTPStatusError as exc:
            # Don't retry client errors (4xx)
            if 400 <= exc.response.status_code < 500:
                raise
            last_exception = exc
            logger.warning(
                "Scrape attempt %d/%d got HTTP %d for %s",
                attempt + 1,
                _MAX_RETRIES + 1,
                exc.response.status_code,
                url,
            )
        except httpx.RequestError as exc:
            last_exception = exc
            logger.warning(
                "Scrape attempt %d/%d network error for %s: %s",
                attempt + 1,
                _MAX_RETRIES + 1,
                url,
                str(exc),
            )
    else:
        raise last_exception  # type: ignore[misc]

    soup = BeautifulSoup(response.text, "html.parser")

    text_chunks: list[str] = []

    # Title
    title_tag = soup.find("title")
    if title_tag:
        text_chunks.append(title_tag.get_text(strip=True))

    # Headings
    for heading in soup.find_all(["h1", "h2", "h3", "h4"]):
        text = heading.get_text(strip=True)
        if text:
            text_chunks.append(text)

    # Paragraphs
    for p in soup.find_all("p"):
        text = p.get_text(strip=True)
        if text:
            text_chunks.append(text)

    # List items (contain materials / tools)
    for li in soup.find_all("li"):
        text = li.get_text(strip=True)
        if text:
            text_chunks.append(text)

    if not text_chunks:
        raise RuntimeError(f"No text content could be extracted from {url}")

    final_text = "\n\n".join(text_chunks)
    logger.info("Scraped %d characters from %s", len(final_text), url)
    return final_text
