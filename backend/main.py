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
# ---------------------------------------------------------
# POPULATION DYNAMICS MODULE ENDPOINTS
# ---------------------------------------------------------

@app.get("/api/population/abundance")
def get_population_abundance(
    region: Optional[str] = Query("Global", description="Filter by region"),
    db: Session = Depends(get_db)
):
    """
    Returns monthly abundance trends for the Hero Line Chart.
    """
    month_col = models.MonthlyLocationAbundance.data['month'].astext.label('month')
    abundance_col = models.MonthlyLocationAbundance.data['abundance'].astext.cast(Integer)

    query = db.query(
        month_col,
        func.sum(abundance_col).label('total_abundance')
    ).filter(
        month_col.is_not(None), 
        abundance_col.is_not(None)
    )

    if region and region != "Global":
        query = query.filter(models.MonthlyLocationAbundance.region == region)

    results = query.group_by(month_col).all()
    
    abundance_dict = {row.month: row.total_abundance for row in results}
    chronological_months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    
    # Fill in missing months with 0
    trends = [abundance_dict.get(month, 0) for month in chronological_months]

    return {"months": chronological_months, "abundance": trends}


@app.get("/api/population/demographics")
def get_population_demographics(
    region: Optional[str] = Query("Global", description="Filter by region"),
    db: Session = Depends(get_db)
):
    """
    Returns the sum of Adults vs Juveniles for a Donut Chart.
    """
    adult_col = models.JuvenileAdultLocationYear.data['adult_abundance'].astext.cast(Integer)
    juv_col = models.JuvenileAdultLocationYear.data['juvenile_abundance'].astext.cast(Integer)

    query = db.query(
        func.sum(adult_col).label('total_adults'),
        func.sum(juv_col).label('total_juveniles')
    )

    if region and region != "Global":
        query = query.filter(models.JuvenileAdultLocationYear.region == region)

    result = query.first()
    
    # Handle cases where there is no data for a region
    adults = result.total_adults if result and result.total_adults else 0
    juveniles = result.total_juveniles if result and result.total_juveniles else 0

    return {
        "demographics": [
            {"name": "Adults", "value": adults},
            {"name": "Juveniles", "value": juveniles}
        ]
    }


@app.get("/api/population/growth")
def get_population_growth(db: Session = Depends(get_db)):
    """
    Returns the average fish length grouped by estimated age from Otolith data.
    """
    query = db.query(
        models.OtolithMetadata.estimated_age.label('age'),
        func.avg(models.OtolithMetadata.length_mm).label('avg_length')
    ).filter(
        models.OtolithMetadata.estimated_age.is_not(None),
        models.OtolithMetadata.length_mm.is_not(None)
    ).group_by(
        models.OtolithMetadata.estimated_age
    ).order_by(
        models.OtolithMetadata.estimated_age
    )

    results = query.all()

    ages = [f"Age {row.age}" for row in results]
    lengths = [round(row.avg_length, 2) for row in results]

    return {"ages": ages, "lengths": lengths}

# ---------------------------------------------------------
# OCEANOGRAPHIC MODULE ENDPOINTS
# ---------------------------------------------------------

@app.get("/api/ocean/temperature")
def get_ocean_temperature(
    region: Optional[str] = Query("Global", description="Filter by region"),
    db: Session = Depends(get_db)
):
    """Returns monthly Sea Surface Temperature (SST)."""
    month_col = models.OceanographicData.data['month'].astext.label('month')
    sst_col = models.OceanographicData.data['sst_c'].astext.cast(Float)

    query = db.query(
        month_col,
        func.avg(sst_col).label('avg_sst')
    ).filter(month_col.is_not(None), sst_col.is_not(None))

    if region and region != "Global":
        query = query.filter(models.OceanographicData.region == region)

    results = query.group_by(month_col).all()
    
    data_dict = {row.month: round(row.avg_sst, 2) for row in results}
    months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    sst_trends = [data_dict.get(m, None) for m in months] # Using None so ECharts connects gaps

    return {"months": months, "sst": sst_trends}


# ---------------------------------------------------------
# OCEANOGRAPHIC MODULE ENDPOINTS
# ---------------------------------------------------------

@app.get("/api/ocean/climate")
def get_ocean_climate(
    region: Optional[str] = Query("Global", description="Filter by region"),
    db: Session = Depends(get_db)
):
    """Returns SST and pH levels ordered by eventDate."""
    date_col = models.OceanographicData.data['eventDate'].astext.label('date')
    sst_col = models.OceanographicData.data['SST_degreeCelsius'].astext.cast(Float).label('sst')
    ph_col = models.OceanographicData.data['pHLevel'].astext.cast(Float).label('ph')

    query = db.query(date_col, sst_col, ph_col).filter(date_col.is_not(None))

    if region and region != "Global":
        query = query.filter(models.OceanographicData.region == region)

    results = query.order_by(date_col).all()

    return {
        "dates": [row.date for row in results],
        "sst": [row.sst for row in results],
        "ph": [row.ph for row in results]
    }

@app.get("/api/ocean/pollution")
def get_ocean_pollution(
    region: Optional[str] = Query("Global", description="Filter by region"),
    db: Session = Depends(get_db)
):
    """Returns Plastic Debris and Pollution Index."""
    date_col = models.OceanographicData.data['eventDate'].astext.label('date')
    plastic_col = models.OceanographicData.data['plasticDebris_PCSPerKilometerSquared'].astext.cast(Float).label('plastic')
    index_col = models.OceanographicData.data['pollutionIndex'].astext.cast(Float).label('index')

    query = db.query(date_col, plastic_col, index_col).filter(date_col.is_not(None))

    if region and region != "Global":
        query = query.filter(models.OceanographicData.region == region)

    results = query.order_by(date_col).all()

    return {
        "dates": [row.date for row in results],
        "plastic": [row.plastic for row in results],
        "pollution_index": [row.index for row in results]
    }

# ---------------------------------------------------------
# BIODIVERSITY MODULE ENDPOINTS
# ---------------------------------------------------------

@app.get("/api/biodiversity/indices")
def get_biodiversity_indices(
    region: Optional[str] = Query("Global", description="Filter by region"),
    db: Session = Depends(get_db)
):
    """Returns Shannon and Simpson indices over time (Hero Chart)."""
    date_col = models.SpeciesDiversity.data['eventdate'].astext.label('date')
    shannon_col = models.SpeciesDiversity.data['shannon_index'].astext.cast(Float).label('shannon')
    simpson_col = models.SpeciesDiversity.data['simpson_index'].astext.cast(Float).label('simpson')

    query = db.query(date_col, shannon_col, simpson_col).filter(date_col.is_not(None))

    if region and region != "Global":
        query = query.filter(models.SpeciesDiversity.region == region)

    results = query.order_by(date_col).all()

    return {
        "dates": [row.date for row in results],
        "shannon": [row.shannon for row in results],
        "simpson": [row.simpson for row in results]
    }

@app.get("/api/biodiversity/richness")
def get_biodiversity_richness(
    region: Optional[str] = Query("Global", description="Filter by region"),
    db: Session = Depends(get_db)
):
    """Returns Observed vs Estimated Species Richness."""
    date_col = models.SpeciesDiversity.data['eventdate'].astext.label('date')
    obs_col = models.SpeciesDiversity.data['species_richness'].astext.cast(Integer).label('observed')
    est_col = models.SpeciesDiversity.data['estimated_richness'].astext.cast(Integer).label('estimated')

    query = db.query(date_col, obs_col, est_col).filter(date_col.is_not(None))

    if region and region != "Global":
        query = query.filter(models.SpeciesDiversity.region == region)

    results = query.order_by(date_col).all()

    return {
        "dates": [row.date for row in results],
        "observed": [row.observed for row in results],
        "estimated": [row.estimated for row in results]
    }

@app.get("/api/biodiversity/balance")
def get_biodiversity_balance(
    region: Optional[str] = Query("Global", description="Filter by region"),
    db: Session = Depends(get_db)
):
    """Returns Ecosystem Evenness and Functional Diversity."""
    date_col = models.SpeciesDiversity.data['eventdate'].astext.label('date')
    evenness_col = models.SpeciesDiversity.data['evenness'].astext.cast(Float).label('evenness')
    functional_col = models.SpeciesDiversity.data['functional_diversity'].astext.cast(Float).label('functional')

    query = db.query(date_col, evenness_col, functional_col).filter(date_col.is_not(None))

    if region and region != "Global":
        query = query.filter(models.SpeciesDiversity.region == region)

    results = query.order_by(date_col).all()

    return {
        "dates": [row.date for row in results],
        "evenness": [row.evenness for row in results],
        "functional": [row.functional for row in results]
    }