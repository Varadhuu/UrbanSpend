from sqlalchemy import Column, Integer, String, Float, Boolean, Date, ForeignKey
from database import Base

class Area(Base):
    __tablename__ = "areas"
    
    id = Column(Integer, primary_key=True, index=True)
    area_name = Column(String, unique=True, index=True)
    population = Column(Integer)
    income_level = Column(Integer)
    average_rent_sqft = Column(Float)
    foot_traffic_index = Column(Float)

class Category(Base):
    __tablename__ = "categories"
    
    id = Column(Integer, primary_key=True, index=True)
    category_name = Column(String, unique=True, index=True)

class Business(Base):
    __tablename__ = "businesses"
    
    id = Column(Integer, primary_key=True, index=True)
    business_id = Column(Integer, unique=True, index=True) # From synthetic data
    area_name = Column(String, index=True)
    category_name = Column(String, index=True)
    age_months = Column(Integer)
    review_rating = Column(Float)
    status = Column(String)

class HistoricalTrend(Base):
    __tablename__ = "historical_trends"
    
    id = Column(Integer, primary_key=True, index=True)
    date = Column(Date, index=True)
    area_name = Column(String, index=True)
    category_name = Column(String, index=True)
    demand_index = Column(Float)
