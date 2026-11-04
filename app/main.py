
import os

from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import text, func

from app.database.database import Base, engine, get_db
from app.models.product import Product
from app.schemas.product import ProductCreate, ProductResponse, ProductUpdate


# Create database tables
Base.metadata.create_all(bind=engine)


# Create FastAPI application
app = FastAPI(
    title="CatalogOps",
    description="E-commerce Product Catalog Service - Version 1.5",
    version="1.0.0"
)


# Configure CORS
frontend_origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

production_origins = os.getenv("FRONTEND_ORIGINS", "")

if production_origins:
    frontend_origins.extend(
        origin.strip()
        for origin in production_origins.split(",")
        if origin.strip()
    )

app.add_middleware(
    CORSMiddleware,
    allow_origins=frontend_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Root endpoint
@app.get("/")
def root():
    return {"message": "CatalogOps is running"}


# Health endpoints
@app.get("/health")
def health():
    return {"status": "healthy"}


@app.get("/health/live")
def liveness():
    return {"status": "alive"}


@app.get("/health/ready")
def readiness():
    try:
        with engine.connect() as connection:
            connection.execute(text("SELECT 1"))

        return {"status": "ready"}

    except Exception:
        raise HTTPException(
            status_code=503,
            detail="Database unavailable"
        )


# Version endpoint
@app.get("/version")
def version():
    return {
        "app": "CatalogOps",
        "version": os.getenv("CATALOGOPS_VERSION", "unknown")
    }


# Get all products
@app.get("/api/v1/products", response_model=list[ProductResponse])
def get_products(db: Session = Depends(get_db)):
    return db.query(Product).all()


# Dashboard analytics endpoint
@app.get("/api/v1/dashboard/summary")
def dashboard_summary(db: Session = Depends(get_db)):

    total_products = db.query(
        func.count(Product.id)
    ).scalar() or 0

    total_categories = db.query(
        func.count(func.distinct(Product.category))
    ).scalar() or 0

    total_value = db.query(
        func.sum(Product.price)
    ).scalar() or 0

    average_price = db.query(
        func.avg(Product.price)
    ).scalar() or 0

    category_data = (
        db.query(
            Product.category,
            func.count(Product.id).label("product_count")
        )
        .group_by(Product.category)
        .all()
    )

    recent_products = (
        db.query(Product)
        .order_by(Product.id.desc())
        .limit(5)
        .all()
    )

    return {
        "total_products": total_products,
        "total_categories": total_categories,
        "total_catalog_value": round(float(total_value), 2),
        "average_price": round(float(average_price), 2),
        "products_by_category": [
            {
                "category": category,
                "count": count
            }
            for category, count in category_data
        ],
        "recent_products": [
            {
                "id": product.id,
                "name": product.name,
                "category": product.category,
                "price": product.price
            }
            for product in recent_products
        ]
    }


# Get one product
@app.get("/api/v1/products/{product_id}", response_model=ProductResponse)
def get_product(product_id: int, db: Session = Depends(get_db)):
    product = db.query(Product).filter(
        Product.id == product_id
    ).first()

    if product is None:
        raise HTTPException(status_code=404, detail="Product not found")

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


# Update product
@app.put("/api/v1/products/{product_id}", response_model=ProductResponse)
def update_product(
    product_id: int,
    product_data: ProductUpdate,
    db: Session = Depends(get_db)
):
    product = db.query(Product).filter(
        Product.id == product_id
    ).first()

    if product is None:
        raise HTTPException(status_code=404, detail="Product not found")

    product.name = product_data.name
    product.category = product_data.category
    product.price = product_data.price

    db.commit()
    db.refresh(product)

    return product


# Delete product
@app.delete("/api/v1/products/{product_id}")
def delete_product(
    product_id: int,
    db: Session = Depends(get_db)
):
    product = db.query(Product).filter(
        Product.id == product_id
    ).first()

    if product is None:
        raise HTTPException(status_code=404, detail="Product not found")

    db.delete(product)
    db.commit()

    return {"message": "Product deleted successfully"}
