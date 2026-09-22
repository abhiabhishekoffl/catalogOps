import os
from urllib.parse import quote_plus

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# Load variables from .env file
from dotenv import load_dotenv
load_dotenv(".env")

# Get PostgreSQL password from environment variable
DB_PASSWORD = quote_plus(os.getenv("DB_PASSWORD")) 


# Database connection URL
DATABASE_URL = (
    f"postgresql://postgres:{DB_PASSWORD}@localhost:5432/catalogops"
)


# Create SQLAlchemy engine
engine = create_engine(DATABASE_URL)


# Create database session
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)


# Base class for SQLAlchemy models
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()