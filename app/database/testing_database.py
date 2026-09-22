import os
from urllib.parse import quote_plus

from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.database.database import Base
from app.models.product import Product

# Load variables from .env file
load_dotenv(".env")

# Get PostgreSQL password from environment variable
DB_PASSWORD = quote_plus(os.getenv("DB_PASSWORD"))

# Connection URL for the test database
# We are connecting to catalogops_test
TEST_DATABASE_URL = (
    f"postgresql://postgres:{DB_PASSWORD}@localhost:5432/catalogops_test"
)

# Create SQLAlchemy engine for the test database
test_engine = create_engine(TEST_DATABASE_URL)

# Create sessions for the test database
TestingSessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=test_engine
)

# Create all application tables in the test database
Base.metadata.create_all(bind=test_engine)