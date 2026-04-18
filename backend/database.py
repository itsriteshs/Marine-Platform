from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from urllib.parse import quote_plus

# Replace with your actual Docker Postgres credentials
# Format: postgresql://<username>:<password>@<host>:<port>/<database_name>
password = "Ritesh@12"
# This turns the @ into %40 for you
encoded_password = quote_plus(password)

DB_URL = f"postgresql://postgres:{encoded_password}@localhost:5432/postgres"

engine = create_engine(DB_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()