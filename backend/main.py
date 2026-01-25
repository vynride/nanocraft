from fastapi import FastAPI
from database import get_db

app = FastAPI(title="NanoCraft Backend")


@app.get("/")
def root():
    return {"status": "NanoCraft backend running"}


@app.get("/test-db")
def test_db():
    db = get_db()
    result = db.test.insert_one(
        {"message": "MongoDB connected successfully"}
    )
    return {"inserted_id": str(result.inserted_id)}