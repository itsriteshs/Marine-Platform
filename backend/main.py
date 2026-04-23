from fastapi import FastAPI, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Optional

import models
import schemas
from database import engine, get_db
from sqlalchemy import cast, Float, Integer,func


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
@app.get("/api/spatial/hotspots")
def get_spatial_hotspots(
    region: Optional[str] = Query("Global", description="Filter by region"),
    db: Session = Depends(get_db)
):
    """
    Returns [longitude, latitude, count] arrays for the ECharts Spatial Map.
    Extracts data dynamically from the PostgreSQL JSONB column.
    """
    # Base query extracting coordinates directly from JSONB
    query = db.query(
        models.OccurrenceData.data['decimalLongitude'].astext.cast(Float).label('lon'),
        models.OccurrenceData.data['decimalLatitude'].astext.cast(Float).label('lat'),
        models.OccurrenceData.data['individualCount'].astext.cast(Integer).label('count')
    )

    # Apply region filter from the React Topbar
    if region and region != "Global":
        query = query.filter(models.OccurrenceData.region == region)

    # Execute query
    results = query.all()

    # Format exactly how Apache ECharts expects the data
    formatted_data = [
        [row.lon, row.lat, row.count] 
        for row in results 
        if row.lon is not None and row.lat is not None
    ]

    return {"hotspots": formatted_data}
@app.get("/api/spatial/depth-trend")
def get_spatial_depth_trend(
    region: Optional[str] = Query("Global", description="Filter by region"),
    db: Session = Depends(get_db)
):
    """
    Returns average sighting depth grouped by year.
    """
    # Extract year and depth from JSONB
    year_col = models.OccurrenceData.data['year'].astext.cast(Integer).label('year')
    depth_col = models.OccurrenceData.data['waterDepth_m'].astext.cast(Float)

    # Base query: Group by year, calculate average depth
    query = db.query(
        year_col,
        func.avg(depth_col).label('avg_depth')
    ).filter(
        year_col.is_not(None), 
        depth_col.is_not(None)
    )

    # Apply Region Filter
    if region and region != "Global":
        query = query.filter(models.OccurrenceData.region == region)

    # Group and Order
    query = query.group_by(year_col).order_by(year_col)
    results = query.all()

    # ECharts needs two separate arrays for a line chart: X-axis (years) and Y-axis (depths)
    years = [row.year for row in results]
    depths = [round(row.avg_depth, 2) for row in results] # Round to 2 decimal places

    return {"years": years, "depths": depths}

@app.get("/api/spatial/sampling-effort")
def get_spatial_sampling_effort(
    region: Optional[str] = Query("Global", description="Filter by region"),
    db: Session = Depends(get_db)
):
    """
    Returns total sampling effort grouped by month in chronological order.
    """
    # Extract month and effort from JSONB
    month_col = models.OccurrenceData.data['month'].astext.label('month')
    effort_col = models.OccurrenceData.data['samplingEffort'].astext.cast(Integer)

    # Base query: Group by month, sum the effort
    query = db.query(
        month_col,
        func.sum(effort_col).label('total_effort')
    ).filter(
        month_col.is_not(None),
        effort_col.is_not(None)
    )

    # Apply Region Filter
    if region and region != "Global":
        query = query.filter(models.OccurrenceData.region == region)

    results = query.group_by(month_col).all()

    # Dictionary to hold the results dynamically
    effort_dict = {row.month: row.total_effort for row in results}

    # Standard chronological order array
    chronological_months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    
    # Map the database results to the correct chronological order (default to 0 if no data)
    efforts = [effort_dict.get(month, 0) for month in chronological_months]

    return {"months": chronological_months, "efforts": efforts}