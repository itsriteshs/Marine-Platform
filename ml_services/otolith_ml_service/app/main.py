# app/main.py
from fastapi import FastAPI, UploadFile, File
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware  # <-- 1. ADD THIS IMPORT
from pathlib import Path
import shutil
import os
from fastapi.staticfiles import StaticFiles # THIS IS FOR IMAGES

from app.core.config import UPLOAD_DIR, RESULTS_DIR
from app.services.analyzer import analyzer_service
#VERY IMPORTANT TO ADD!!!
app = FastAPI(title="Otolith ML Service", version="1.0.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins (perfect for local development)
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods (POST, GET, etc.)
    allow_headers=["*"],  # Allows all headers
)
# ----------------
# Assuming your ML service saves those output images in a folder called 'results'
# This creates a URL route at http://localhost:8001/results/image_name.png
# Get the absolute path to the results folder
# This ensures FastAPI always finds it, even inside Docker

os.makedirs(RESULTS_DIR, exist_ok=True)
app.mount("/results", StaticFiles(directory=str(RESULTS_DIR)), name="results")




@app.post("/analyze")
async def analyze(file: UploadFile = File(...)):
    UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
    temp_path = UPLOAD_DIR / file.filename

    with temp_path.open("wb") as f:
        shutil.copyfileobj(file.file, f)

    try:
        result = analyzer_service.analyze_image(str(temp_path))
        return JSONResponse(result)
    except Exception as e:
        return JSONResponse({"error": str(e)}, status_code=500)
    finally:
        if temp_path.exists():
            temp_path.unlink()
