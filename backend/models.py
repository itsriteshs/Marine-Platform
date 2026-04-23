from sqlalchemy import Column, Integer, String, Float, Text, ARRAY, DateTime,Numeric
from database import Base
from sqlalchemy.dialects.postgresql import JSONB

class SpeciesData(Base):
    __tablename__ = "species_data"

    species_id = Column(Integer, primary_key=True, index=True)

    scientific_name = Column(String(255), nullable=False)
    vernacularname = Column(String(255))
    kingdom = Column(String(50))
    phylum = Column(String(50))
    class_name = Column("class", String(50)) # Mapped to avoid Python keyword
    _order = Column(String(50))
    family = Column(String(50))
    genus = Column(String(50))
    species = Column(String(50))
    authority = Column(String(255))

    max_length_cm = Column(Float)
    avg_length_cm = Column(Float)
    max_weight_kg = Column(Float)
    avg_weight_kg = Column(Float)
    body_shape = Column(String(255))
    color_pattern = Column(String(255))
    sexual_dimorphism = Column(String(50))
    age_of_maturity_years = Column(Float)

    habitat_type = Column(String(255))
    diet = Column(String(255))
    trophic_level = Column(Float)
    activity_pattern = Column(String(50))
    migration_type = Column(String(50))

    depth_range_min = Column(Float)
    depth_range_max = Column(Float)
    temperature_range_min = Column(Float)
    temperature_range_max = Column(Float)
    salinity_range_min = Column(Float)
    salinity_range_max = Column(Float)
    oxygen_preference_mg_l = Column(Float)

    preferred_temp_min = Column(Float)
    preferred_temp_max = Column(Float)
    preferred_salinity_min = Column(Float)
    preferred_salinity_max = Column(Float)
    preferred_chlorophyll_min = Column(Float)
    preferred_chlorophyll_max = Column(Float)
    preferred_depth_min = Column(Float)
    preferred_depth_max = Column(Float)
    preferred_ph_min = Column(Float)
    preferred_ph_max = Column(Float)
    preferred_turbidity = Column(Float)

    global_distribution = Column(Text)
    india_distribution = Column(Text)
    native_range = Column(Text)
    reported_regions = Column(ARRAY(Text))
    occurrence_status = Column(String(50))
    endemic_status = Column(String(50))
    iucn_status = Column(String(50))
    population_trend = Column(String(50))
    major_threats = Column(ARRAY(Text))
 
    commercial_value = Column(String(50))
    fishing_methods = Column(ARRAY(Text))
    aquaculture_potential = Column(String(50))

    thumbnail_url = Column(String(255))
    image_urls = Column(ARRAY(Text))
    created_at = Column(DateTime)
    updated_at = Column(DateTime)
    data_source = Column(String(255))

class OccurrenceData(Base):
    __tablename__ = "occurrence_data"

    occurrence_id = Column(Text, primary_key=True, index=True)
    species_id = Column(Integer, index=True)
    upload_id = Column(Integer)
    region = Column(Text, index=True)
    data = Column(JSONB, nullable=False)

class MonthlyLocationAbundance(Base):
    __tablename__ = "monthly_location_abundance"

    id = Column(Integer, primary_key=True, index=True)
    species_id = Column(Integer, index=True)
    region = Column(Text, index=True)
    upload_id = Column(Integer)
    data = Column(JSONB, nullable=False)


class JuvenileAdultLocationYear(Base):
    __tablename__ = "juvenile_adult_location_year"

    id = Column(Integer, primary_key=True, index=True)
    species_id = Column(Integer, index=True)
    region = Column(Text, index=True)
    upload_id = Column(Integer)
    data = Column(JSONB, nullable=False)


class OtolithMetadata(Base):
    __tablename__ = "otolith_metadata"

    otolith_id = Column(Integer, primary_key=True, index=True)
    species_id = Column(Integer, index=True)
    estimated_age = Column(Integer)
    ring_count = Column(Integer)
    area_mm2 = Column(Float)       # Mapped NUMERIC to Float for Python
    perimeter_mm = Column(Float)
    length_mm = Column(Float)
    width_mm = Column(Float)
    aspect_ratio = Column(Float)
    circularity = Column(Float)
    raw_image_url = Column(Text)
    processed_image_url = Column(Text)
    upload_id = Column(Integer)

class OceanographicData(Base):
    __tablename__ = "oceanographic_data"

    id = Column(Integer, primary_key=True, index=True)
    region = Column(Text, index=True)
    upload_id = Column(Integer)
    data = Column(JSONB, nullable=False)

class SpeciesDiversity(Base):
    __tablename__ = "species_diversity"

    id = Column(Integer, primary_key=True, index=True)
    region = Column(Text, index=True)
    upload_id = Column(Integer)
    data = Column(JSONB, nullable=False)