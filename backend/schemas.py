from pydantic import BaseModel, ConfigDict
from typing import Optional, List
from datetime import datetime

# schema for taxonomy grid
class SpeciesListResponse(BaseModel):
    species_id: int
    scientific_name: str
    vernacularname: Optional[str] = None
    thumbnail_url: Optional[str] = None
    iucn_status: Optional[str] = None
    family: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)

# schema for species detail page
class SpeciesDetailResponse(BaseModel):
    # Primary Key
    species_id: int

    scientific_name: str
    vernacularname: Optional[str] = None
    kingdom: Optional[str] = None
    phylum: Optional[str] = None
    class_name: Optional[str] = None  # Maps to the 'class' column
    _order: Optional[str] = None
    family: Optional[str] = None
    genus: Optional[str] = None
    species: Optional[str] = None
    authority: Optional[str] = None

    max_length_cm: Optional[float] = None
    avg_length_cm: Optional[float] = None
    max_weight_kg: Optional[float] = None
    avg_weight_kg: Optional[float] = None
    body_shape: Optional[str] = None
    color_pattern: Optional[str] = None
    sexual_dimorphism: Optional[str] = None
    age_of_maturity_years: Optional[float] = None

    habitat_type: Optional[str] = None
    diet: Optional[str] = None
    trophic_level: Optional[float] = None
    activity_pattern: Optional[str] = None
    migration_type: Optional[str] = None

    depth_range_min: Optional[float] = None
    depth_range_max: Optional[float] = None
    temperature_range_min: Optional[float] = None
    temperature_range_max: Optional[float] = None
    salinity_range_min: Optional[float] = None
    salinity_range_max: Optional[float] = None
    oxygen_preference_mg_l: Optional[float] = None

    preferred_temp_min: Optional[float] = None
    preferred_temp_max: Optional[float] = None
    preferred_salinity_min: Optional[float] = None
    preferred_salinity_max: Optional[float] = None
    preferred_chlorophyll_min: Optional[float] = None
    preferred_chlorophyll_max: Optional[float] = None
    preferred_depth_min: Optional[float] = None
    preferred_depth_max: Optional[float] = None
    preferred_ph_min: Optional[float] = None
    preferred_ph_max: Optional[float] = None
    preferred_turbidity: Optional[float] = None

    global_distribution: Optional[str] = None
    india_distribution: Optional[str] = None
    native_range: Optional[str] = None
    reported_regions: Optional[List[str]] = []
    occurrence_status: Optional[str] = None
    endemic_status: Optional[str] = None
    iucn_status: Optional[str] = None
    population_trend: Optional[str] = None
    major_threats: Optional[List[str]] = []

    commercial_value: Optional[str] = None
    fishing_methods: Optional[List[str]] = []
    aquaculture_potential: Optional[str] = None

    thumbnail_url: Optional[str] = None
    image_urls: Optional[List[str]] = []
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    data_source: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)