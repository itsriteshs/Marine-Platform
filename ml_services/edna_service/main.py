# backend/edna_service/main.py
from fastapi import FastAPI, UploadFile, File
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import shutil
import os
from analyser import analyze_sequence

app = FastAPI(title="eDNA Sequencing Service")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = "temp_edna"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@app.post("/analyze_edna")
async def analyze_edna_endpoint(file: UploadFile = File(...)):
    temp_path = os.path.join(UPLOAD_DIR, file.filename)
    
    # Save the uploaded DNA file
    with open(temp_path, "wb") as f:
        shutil.copyfileobj(file.file, f)

    try:
        # Run the analysis
        result = analyze_sequence(temp_path)
        return JSONResponse(result)
    except Exception as e:
        return JSONResponse({"error": str(e)}, status_code=500)
    finally:
        if os.path.exists(temp_path):
            os.remove(temp_path)