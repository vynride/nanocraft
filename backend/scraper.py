import httpx
from bs4 import BeautifulSoup


async def scrape_instructables_page(url: str) -> str:
    async with httpx.AsyncClient(timeout=15.0) as client:
        response = await client.get(url)
        response.raise_for_status()

    soup = BeautifulSoup(response.text, "html.parser")

    text_chunks = []

    # Extract title
    title = soup.find("title")
    if title:
        text_chunks.append(title.get_text(strip=True))

    # Extract paragraph text
    for p in soup.find_all("p"):
        text = p.get_text(strip=True)
        if text:
            text_chunks.append(text)

    # Combine into one large string
    final_text = "\n\n".join(text_chunks)

    return final_text
