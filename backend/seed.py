import pandas as pd
from sqlalchemy.orm import Session
from .database import engine, Base, SessionLocal
from .models import Area, Category, Business, HistoricalTrend
import os

def seed_database():
    print("Creating tables...")
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    
    # Check if data already exists
    if db.query(Area).first():
        print("Database already seeded.")
        db.close()
        return

    print("Loading data from CSVs...")
    data_dir = os.path.join(os.path.dirname(__file__), "..", "data")
    
    if not os.path.exists(data_dir):
        print(f"Data directory not found at {data_dir}. Run generate_data.py first.")
        db.close()
        return

    # Load Areas
    areas_df = pd.read_csv(os.path.join(data_dir, "areas.csv"))
    for _, row in areas_df.iterrows():
        db.add(Area(**row.to_dict()))
        
    # Load Categories
    cats_df = pd.read_csv(os.path.join(data_dir, "categories.csv"))
    for _, row in cats_df.iterrows():
        db.add(Category(**row.to_dict()))
        
    # Load Businesses
    biz_df = pd.read_csv(os.path.join(data_dir, "businesses.csv"))
    for _, row in biz_df.iterrows():
        db.add(Business(**row.to_dict()))
        
    # Load Trends
    trends_df = pd.read_csv(os.path.join(data_dir, "historical_trends.csv"))
    # Convert date strings to date objects
    trends_df['date'] = pd.to_datetime(trends_df['date']).dt.date
    for _, row in trends_df.iterrows():
        db.add(HistoricalTrend(**row.to_dict()))

    print("Committing to database...")
    db.commit()
    db.close()
    print("Database seeding completed.")

if __name__ == "__main__":
    seed_database()
