import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes.predict import router

app = FastAPI(
    title="CardioShield ML Server",
    version="1.0.0",
)

# CORS — use ALLOWED_ORIGINS env var in production; fallback to allow-all in dev
allowed_origins = os.getenv("ALLOWED_ORIGINS", "*").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)


@app.get("/")
async def root():
    return {"message": "Welcome to the CardioShield ML Server API!"}


@app.get("/health")
async def health():
    return {
        "status": "healthy",
        "message": "ML Server is running",
    }

