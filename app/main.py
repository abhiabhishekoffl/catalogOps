from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.database import Base, engine, get_db
from app.models.product import Product
from app.schemas.product import ProductCreate, ProductResponse, ProductUpdate


# Create the database tables
Base.metadata.create_all(bind=engine)


# Create FastAPI application
app = FastAPI(
    title="CatalogOps",
    description="E-commerce Product Catalog Service - Version 1.5",
    version="1.0.0"
)


# Root endpoint
@app.get("/")
def root():
    return {
        "message": "CatalogOps is running inside Docker"
    }


# Get all products
@app.get("/api/v1/products", response_model=list[ProductResponse])
def get_products(db: Session = Depends(get_db)):
    products = db.query(Product).all()

    return products

# Get a single product by ID
@app.get("/api/v1/products/{product_id}", response_model=ProductResponse)
def get_product(product_id: int, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == product_id).first()

    if product is None:
        raise HTTPException(
            status_code=404, 
            detail="Product not found"
        )

    return product

# Update an existing product
@app.put("/api/v1/products/{product_id}", response_model=ProductResponse)
def update_product(
    product_id: int,
    product_data: ProductUpdate,
    db:Session = Depends(get_db)
):
    product = db.query(Product).filter(Product.id == product_id).first()

    if product is None:
        raise HTTPException(
            status_code=404, 
            detail="Product not found"
        )

    product.name = product_data.name
    product.category = product_data.category
    product.price = product_data.price

    db.commit()
    db.refresh(product)

    return product


# Create product
@app.post("/api/v1/products", response_model=ProductResponse)
def create_product(
    product: ProductCreate,
    db: Session = Depends(get_db)
):
    new_product = Product(
        name=product.name,
        category=product.category,
        price=product.price
    )

    db.add(new_product)
    db.commit()
    db.refresh(new_product)

    return new_product

# Delete a product
@app.delete("/api/v1/products/{product_id}")
def delete_product(
    product_id: int,
    db: Session = Depends(get_db)
):
    #Find the product by ID
    product = db.query(Product).filter(Product.id == product_id).first()

    #If the product does not exist, raise a 404 error
    if product is None:
        raise HTTPException(
            status_code=404, 
            detail="Product not found"
        )

    # Delete the product from the database
    db.delete(product)
    db.commit()

    # Return a success message
    return {
        "message": "Product deleted successfully"
    }

# CI/CD automatic trigger test