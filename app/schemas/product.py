from pydantic import BaseModel, ConfigDict


# Schema for creating a new product
# Used when the client sends a POST request
class ProductCreate(BaseModel):
    name: str
    category: str
    price: float


# Schema for sending product data back to the client
# Used as the API response format
class ProductResponse(BaseModel):
    id: int
    name: str
    category: str
    price: float

    # Allows Pydantic to read data from SQLAlchemy objects
    model_config = ConfigDict(from_attributes=True)


# Schema for updating an existing product
# Used when the client sends a PUT request
class ProductUpdate(BaseModel):
    name: str
    category: str
    price: float