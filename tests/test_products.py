import pytest
from fastapi.testclient import TestClient

from app.main import app
from app.database.database import get_db
from app.database.testing_database import TestingSessionLocal
from app.models.product import Product


# Create a TestClient for our FastAPI application
client = TestClient(app)


# Override the normal database dependency during testing
def override_get_db():
    db = TestingSessionLocal()

    try:
        yield db
    finally:
        db.close()


# Tell FastAPI to use the test database during tests
app.dependency_overrides[get_db] = override_get_db

# Clean the test database before and after each test
@pytest.fixture(autouse=True)
def clean_database():
    # Create a database session connected to the test database
    db = TestingSessionLocal()

    try:
        # Delete all existing products from the test database
        # This ensures that each test starts with a clean database
        db.query(Product).delete()

        # Save the deletion in the database
        db.commit()
        yield
        db.query(Product).delete()
        db.commit()
    finally:
        db.close()


# Test the root endpoint
def test_root():
    response = client.get("/")

    # Check that the API responds successfully
    assert response.status_code == 200

    # Check that the response message is correct
    assert response.json() == {
        "message": "CatalogOps is running"
    }


# Test getting all products
def test_get_products():
    response = client.get("/api/v1/products")

    # Check that the API responds successfully
    assert response.status_code == 200

    # Check that the response is a list
    assert isinstance(response.json(), list)


# Test getting a single product by ID
def test_get_product():
    # First create a product for this test
    product_data = {
        "name": "Test Phone",
        "category": "Electronics",
        "price": 30000
    }

    create_response = client.post(
        "/api/v1/products",
        json=product_data
    )

    # Check that the product was created successfully
    assert create_response.status_code == 200

    # Get the generated product ID
    product_id = create_response.json()["id"]

    # Request the product using its ID
    response = client.get(
        f"/api/v1/products/{product_id}"
    )

    # Check that the API responds successfully
    assert response.status_code == 200

    # Get the returned product
    product = response.json()

    # Check that the returned product is correct
    assert product["id"] == product_id
    assert product["name"] == "Test Phone"
    assert product["category"] == "Electronics"
    assert product["price"] == 30000


# Test updating an existing product
def test_update_product():
    # First create a product
    product_data = {
        "name": "Old Laptop",
        "category": "Electronics",
        "price": 40000
    }

    create_response = client.post(
        "/api/v1/products",
        json=product_data
    )

    # Check that the product was created
    assert create_response.status_code == 200

    # Get the generated product ID
    product_id = create_response.json()["id"]

    # Data for updating the product
    updated_data = {
        "name": "Updated Laptop",
        "category": "Computers",
        "price": 55000
    }

    # Send PUT request
    response = client.put(
        f"/api/v1/products/{product_id}",
        json=updated_data
    )

    # Check that the update was successful
    assert response.status_code == 200

    # Get the updated product
    updated_product = response.json()

    # Verify the updated values
    assert updated_product["id"] == product_id
    assert updated_product["name"] == "Updated Laptop"
    assert updated_product["category"] == "Computers"
    assert updated_product["price"] == 55000

# Test creating a new product
def test_create_product():
    product_data = {
        "name": "Test Laptop",
        "category": "Electronics",
        "price": 50000
    }

    response = client.post(
        "/api/v1/products",
        json=product_data
    )

    # Check that the product was created successfully
    assert response.status_code == 200

    # Get the created product from the response
    created_product = response.json()

    # Check that the product returned data matches what we sent
    assert created_product["name"] == "Test Laptop"
    assert created_product["category"] == "Electronics"
    assert created_product["price"] == 50000

    # Check that PostgreSQL generated an ID
    assert "id" in created_product

# Test deleting an existing product
def test_delete_product():
    # First create a product
    product_data = {
        "name": "Delete Laptop",
        "category": "Electronics",
        "price": 45000
    }

    create_response = client.post(
        "/api/v1/products",
        json=product_data
    )

    # Check that the product was created
    assert create_response.status_code == 200

    # Get the generated product ID
    product_id = create_response.json()["id"]

    # Delete the product
    response = client.delete(
        f"/api/v1/products/{product_id}"
    )

    # Check that the deletion was successful
    assert response.status_code == 200

    # Check the success message
    assert response.json() == {
        "message": "Product deleted successfully"
    }

    # Verify that the product no longer exists
    get_response = client.get(
        f"/api/v1/products/{product_id}"
    )

    # The API should return 404 after deletion
    assert get_response.status_code == 404

# Test getting a product that does not exist
def test_get_product_not_found():
    # Use an ID that should not exist
    response = client.get("/api/v1/products/999999")

    # The API should return 404
    assert response.status_code == 404

    # Check the error message
    assert response.json() == {
        "detail": "Product not found"
    }