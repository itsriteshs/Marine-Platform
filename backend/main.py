from fastapi import FastAPI, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Optional

import models
import schemas
from database import engine, get_db


# models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Marine Taxonomy API")

# Allow your React frontend (usually running on localhost:5173 or 3000) to talk to this backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # For production, change "*" to your actual frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
@app.get("/")
def check():
    return(
        {"message":"hello world"}
    )
@app.get("/api/species", response_model=List[schemas.SpeciesListResponse])
def get_species_list(
    search: Optional[str] = None,
    status: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """
    Returns a lightweight list of species for the Taxonomy Grid.
    """
    # Start with a base query
    query = db.query(models.SpeciesData)
    
    # Apply dynamic filters if React sent them
    if search:
        query = query.filter(
            (models.SpeciesData.vernacularname.ilike(f"%{search}%")) |
            (models.SpeciesData.scientific_name.ilike(f"%{search}%"))
        )
    if status:
        query = query.filter(models.SpeciesData.iucn_status == status)
        
    # Limit to 50 so we don't crash the browser
    return query.limit(50).all()


@app.get("/api/species/{species_id}", response_model=schemas.SpeciesDetailResponse)
def get_species_detail(species_id: int, db: Session = Depends(get_db)):
    """
    Returns ALL 60+ columns for a single species when clicked.
    """
    db_species = db.query(models.SpeciesData).filter(models.SpeciesData.species_id == species_id).first()
    
    if db_species is None:
        raise HTTPException(status_code=404, detail="Species not found")
        
    return db_species