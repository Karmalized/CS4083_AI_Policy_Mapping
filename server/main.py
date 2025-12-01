from typing import Union
from server.loadenv import API_KEY
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
import server.policy.international as international
import httpx
import json
import re
import asyncio
from fastapi import HTTPException


app = FastAPI()

origins = {
    "http://localhost:3000",
    "http://localhost",
    "http://localhost:8000",
    "http://localhost:8081",
}

API = API_KEY #Congress.gov API Key
Base_URL = "https://api.congress.gov/v3/"


#App Access CORS Policy on webpage
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Router configurations
app.include_router(international.router)

# Get AI-related bills from Congress.gov API
@app.get("/ai-congress-bills")
async def get_ai_bills(congress: int = 119):
    """Fetch AI-related bills from the Congress.gov API by congress session.
    Returns:
        A dictionary containing AI-related bills by specified congress or an error message.
    """
    formatted_URL = f"{Base_URL}bill/{congress}"
    ai_bills = []
    params = {
                "search": "artificial+intelligence",
                "offset": 0,
                "limit": 250,
                "api_key": API,
            }
    timeout = httpx.Timeout(10.0, read=20.0)
    async with httpx.AsyncClient(timeout=timeout) as client:
        while True:  # Limit to first 1000 results to avoid excessive requests
            response = await client.get(formatted_URL,params=params)

            if response.status_code != 200:
                raise HTTPException(status_code=response.status_code,
                            detail=f"Congress.gov API error: {response.text}")

            data = response.json()

            items = data.get("bills", [])

            if not items:
                break

            keywords = ["artificial intelligence", "AI-", "-AI", "machine learning", "Technologies", "Technology", "Deep"] #Deep catches words like Deep Learning, Deep Fakes, etc.
            reg = re.compile(r"\bAI\b", re.IGNORECASE)

            ai_bills.extend([bill for bill in items if any(keyword in bill.get("title", "") for keyword in keywords) or any(keyword.lower() in bill.get("title", "") for keyword in keywords) or reg.search(bill.get("title", ""))])
            # move to the next page
            print(params["offset"])
            params["offset"] += params["limit"]
    print(f"Fetched {len(ai_bills)} AI-related bills from Congress.gov API for Congress {congress}.")
    return ai_bills

# Get AI-related Senate bills from Congress.gov API
@app.get("/ai-senate-bills")
async def get_ai_senate_bills(congress: int = 119):
    """Fetch AI-related Senate bills from the Congress.gov API.
    Returns:
        A Stream containing AI-related Senate bills or an error message.
    """

    endpoint = f"{Base_URL}bill/{congress}/s"
    num_pages = 50 #250 bills per page, max 12500 bills - curbs overhead
    params = {
                "offset": 0,
                "limit": 250,
                "api_key": API,
            }
    async with httpx.AsyncClient(timeout=30) as client:
        tasks = [fetch_page(endpoint, client, offset=params["limit"] * i, limit=params["limit"]) for i in range(num_pages)]
        results = await asyncio.gather(*tasks)

        keywords = ["artificial intelligence", "AI-", "-AI", "machine learning", "Technologies", "Technology", "Deep"] #Deep catches words like Deep Learning, Deep Fakes, etc.
        reg = re.compile(r"\bAI\b", re.IGNORECASE)

        for items in results:
            if not items:
                continue

            for bill in items:
                if any(keyword in bill.get("title", "") for keyword in keywords) or any(keyword.lower() in bill.get("title", "") for keyword in keywords) or reg.search(bill.get("title", "")):
                    yield json.dumps(bill) + "\n"

@app.get("/stream-ai-senate-bills")
async def stream_ai_senate_bills(congress: int = 119):
    return StreamingResponse(get_ai_senate_bills(congress), media_type="application/json")

# Get AI-related House bills from Congress.gov API
@app.get("/ai-house-bills")
async def get_ai_house_bills(congress: int = 119):
    """Fetch AI-related House bills from the Congress.gov API.
    Returns:
        A Stream containing AI-related House bills or an error message.
    """

    endpoint = f"{Base_URL}bill/{congress}/hr"
    num_pages = 50 #250 bills per page, max 12500 bills - curbs overhead
    params = {
                "offset": 0,
                "limit": 250,
                "api_key": API,
            }
    async with httpx.AsyncClient(timeout=30) as client:
        
            tasks = [fetch_page(endpoint, client, offset=params["limit"] * i, limit=params["limit"]) for i in range(num_pages)]
            results = await asyncio.gather(*tasks)

            keywords = ["artificial intelligence", "AI-", "-AI", "machine learning", "Technologies", "Technology", "Deep"] #Deep catches words like Deep Learning, Deep Fakes, etc.
            reg = re.compile(r"\bAI\b", re.IGNORECASE)

            for items in results:
                if not items:
                    continue

                for bill in items:
                    if any(keyword in bill.get("title", "") for keyword in keywords) or any(keyword.lower() in bill.get("title", "") for keyword in keywords) or reg.search(bill.get("title", "")):
                        yield json.dumps(bill) + "\n"

@app.get("/stream-ai-house-bills")
async def stream_ai_house_bills(congress: int = 119):
    return StreamingResponse(get_ai_house_bills(congress), media_type="application/json")

# Helper function to fetch a page of results
async def fetch_page(endpoint, client, offset, limit=100):
    params = {"offset": offset, "limit": limit, "api_key": API}
    r = await client.get(endpoint, params=params)
    if r.status_code != 200:
        raise HTTPException(status_code=r.status_code, detail=f"API error: {r.text}")
    return r.json().get("bills", [])


@app.get("/")
async def read_root() -> Union[dict[str, str], dict[str, str]]:
    """Test endpoint to verify server is running.
    Returns:
        A simple dictionary with a greeting message.
    """
    return {"Hello": "World"}
