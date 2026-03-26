import pandas as pd
import numpy as np
import os
import joblib
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.ensemble import RandomForestRegressor
from sklearn.ensemble import IsolationForest
from prophet import Prophet
import json
import warnings
warnings.filterwarnings('ignore')

data_dir = os.path.join(os.path.dirname(__file__), "..", "data")
models_dir = os.path.join(os.path.dirname(__file__), "models")
os.makedirs(models_dir, exist_ok=True)

print("Loading data...")
areas_df = pd.read_csv(os.path.join(data_dir, "areas.csv"))
cats_df = pd.read_csv(os.path.join(data_dir, "categories.csv"))
biz_df = pd.read_csv(os.path.join(data_dir, "businesses.csv"))
trends_df = pd.read_csv(os.path.join(data_dir, "historical_trends.csv"))

print("1. Training K-Means Area Segmentation...")
# Features: population, income_level, average_rent_sqft, foot_traffic_index
X_area = areas_df[['population', 'income_level', 'average_rent_sqft', 'foot_traffic_index']]
scaler_area = StandardScaler()
X_area_scaled = scaler_area.fit_transform(X_area)

kmeans = KMeans(n_clusters=3, random_state=42)
areas_df['cluster'] = kmeans.fit_predict(X_area_scaled)
joblib.dump(scaler_area, os.path.join(models_dir, 'scaler_area.joblib'))
joblib.dump(kmeans, os.path.join(models_dir, 'kmeans_area.joblib'))

# Map clusters to meaning (Low, Medium, High Potential based on foot traffic & income)
areas_df.to_csv(os.path.join(data_dir, "areas_clustered.csv"), index=False)

print("2. Training Isolation Forest for Saturation Anomaly Detection...")
# Calculate business density: num businesses per area / total population
density_df = biz_df.groupby('area_name').size().reset_index(name='biz_count')
density_df = pd.merge(density_df, areas_df[['area_name', 'population']], on='area_name')
density_df['density'] = density_df['biz_count'] / density_df['population'] * 1000 # Biz per 1000 people

iso = IsolationForest(contamination=0.1, random_state=42)
density_df['is_anomaly'] = iso.fit_predict(density_df[['density']]) 
joblib.dump(iso, os.path.join(models_dir, 'isolation_forest_saturation.joblib'))

print("3. Training Random Forest for Risk & ROI Prediction...")
# Generate dummy targets for ROI (months) and Risk (0-100) based on logic + noise
# High traffic + High income = Lower risk, faster ROI
# High competition = Higher risk, slower ROI

train_data = []
for idx, row in areas_df.iterrows():
    area = row['area_name']
    area_density = density_df[density_df['area_name'] == area]['density'].values[0]
    for cat in cats_df['category_name'].tolist():
        # Count competition in this category & area
        comp_count = len(biz_df[(biz_df['area_name'] == area) & (biz_df['category_name'] == cat)])
        
        # Base logics
        base_risk = 50 - (row['foot_traffic_index'] * 0.2) + (comp_count * 2) + (row['average_rent_sqft'] * 0.1)
        base_roi = 24 - (row['income_level']/10000) + comp_count
        
        # Add noise
        risk = np.clip(base_risk + np.random.normal(0, 5), 0, 100)
        roi = np.clip(base_roi + np.random.normal(0, 3), 6, 60)
        
        train_data.append({
            'area_name': area,
            'category_name': cat,
            'population': row['population'],
            'income': row['income_level'],
            'rent': row['average_rent_sqft'],
            'traffic': row['foot_traffic_index'],
            'competition': comp_count,
            'density': area_density,
            'risk_score': risk,
            'roi_months': roi
        })

df_train = pd.DataFrame(train_data)
# Encode categories
cat_encoder = LabelEncoder()
df_train['category_encoded'] = cat_encoder.fit_transform(df_train['category_name'])
area_encoder = LabelEncoder()
df_train['area_encoded'] = area_encoder.fit_transform(df_train['area_name'])

X_rf = df_train[['area_encoded', 'category_encoded', 'population', 'income', 'rent', 'traffic', 'competition', 'density']]
y_risk = df_train['risk_score']
y_roi = df_train['roi_months']

rf_risk = RandomForestRegressor(n_estimators=100, random_state=42)
rf_risk.fit(X_rf, y_risk)

rf_roi = RandomForestRegressor(n_estimators=100, random_state=42)
rf_roi.fit(X_rf, y_roi)

joblib.dump(cat_encoder, os.path.join(models_dir, 'category_encoder.joblib'))
joblib.dump(area_encoder, os.path.join(models_dir, 'area_encoder.joblib'))
joblib.dump(rf_risk, os.path.join(models_dir, 'rf_risk.joblib'))
joblib.dump(rf_roi, os.path.join(models_dir, 'rf_roi.joblib'))

print("4. Training Prophet For Time Series Growth Prediction...")
forecasts = {}

# Suppress prophet logs
import logging
logging.getLogger('cmdstanpy').setLevel(logging.WARNING)

count = 0
for area in areas_df['area_name'].unique():
    for cat in cats_df['category_name'].unique():
        df_sub = trends_df[(trends_df['area_name'] == area) & (trends_df['category_name'] == cat)]
        df_prophet = df_sub[['date', 'demand_index']].rename(columns={'date': 'ds', 'demand_index': 'y'})
        
        m = Prophet(yearly_seasonality=True, weekly_seasonality=False, daily_seasonality=False)
        m.fit(df_prophet)
        
        # Predict next 12 months
        future = m.make_future_dataframe(periods=12, freq='M')
        forecast = m.predict(future)
        
        # Save just the predictions curve for the API to serve
        preds = forecast[['ds', 'yhat']].tail(12)
        key = f"{area}_{cat}"
        forecasts[key] = {
            "dates": preds['ds'].astype(str).tolist(),
            "predicted_demand": preds['yhat'].clip(lower=0).round(2).tolist()
        }
        count += 1
        if count % 20 == 0:
            print(f"Prophet models trained: {count}/{len(areas_df['area_name'].unique()) * len(cats_df['category_name'].unique())}")

with open(os.path.join(models_dir, 'forecasts.json'), 'w') as f:
    json.dump(forecasts, f)

print("All ML Models Trained and Serialized inside 'models/' directory.")
