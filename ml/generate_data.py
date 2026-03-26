import pandas as pd
import numpy as np
import random
from datetime import datetime, timedelta
import os

# Create data directory
os.makedirs("data", exist_ok=True)

# 1. Areas
areas = [
    "Velachery", "T Nagar", "Adyar", "Mylapore", "Anna Nagar",
    "OMR", "Tambaram", "Guindy", "Besant Nagar", "Nungambakkam"
]
# Generate Area Attributes
area_data = []
for area in areas:
    area_data.append({
        "area_name": area,
        "population": np.random.randint(50000, 300000),
        "income_level": np.random.randint(30000, 150000), # avg monthly
        "average_rent_sqft": round(np.random.uniform(30.0, 150.0), 2),
        "foot_traffic_index": round(np.random.uniform(50.0, 100.0), 2)
    })
df_areas = pd.DataFrame(area_data)
df_areas.to_csv("data/areas.csv", index=False)

# 2. Categories
categories = [
    "Cafe", "Gym", "Restaurant", "Medical Shop", "Supermarket",
    "Clothing Store", "Salon", "Bakery", "Electronics", "Bookstore",
    "Co-working Space", "Hardware Store", "Pet Shop", "Laundromat", "Clinic"
]
df_categories = pd.DataFrame({"category_name": categories})
df_categories.to_csv("data/categories.csv", index=False)

# 3. Existing Businesses (Saturation data)
# To simulate real-world, let's create 1000 businesses across the city
businesses = []
for i in range(1000):
    businesses.append({
        "business_id": i + 1,
        "area_name": random.choice(areas),
        "category_name": random.choice(categories),
        "age_months": np.random.randint(1, 120),
        "review_rating": round(np.random.uniform(2.5, 5.0), 1),
        "status": np.random.choice(["Active", "Closed"], p=[0.8, 0.2])
    })
df_businesses = pd.DataFrame(businesses)
df_businesses.to_csv("data/businesses.csv", index=False)

# 4. Historical Trends (Time Series for ML Prophet)
# 2 years of monthly data for each Area + Category combination
trends = []
start_date = datetime.now() - timedelta(days=365*2)
for area in areas:
    for cat in categories:
        base_demand = np.random.randint(100, 1000)
        growth_rate = np.random.uniform(-0.02, 0.05) # monthly growth rate
        for month in range(24):
            current_date = start_date + timedelta(days=30*month)
            date_str = current_date.strftime("%Y-%m-%d")
            
            # Add seasonality (sin wave) and noise
            seasonality = np.sin(month * np.pi / 6) * 50
            noise = np.random.randint(-20, 20)
            
            monthly_demand = base_demand * ((1 + growth_rate) ** month) + seasonality + noise
            monthly_demand = max(0, int(monthly_demand))
            
            trends.append({
                "date": date_str,
                "area_name": area,
                "category_name": cat,
                "demand_index": monthly_demand
            })
df_trends = pd.DataFrame(trends)
df_trends.to_csv("data/historical_trends.csv", index=False)

print("Synthetic data generated successfully in 'data/' directory.")
