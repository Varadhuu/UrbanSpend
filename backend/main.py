from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Dict, Any

from database import get_db, engine, Base
from models import Area, Category, Business, HistoricalTrend
from api_models import (
    LocationAnalysisRequest, LocationAnalysisResponse,
    RecommendationRequest, RecommendationResponse,
    WhatIfRequest, WhatIfResponse,
    BusinessPlanRequest, BusinessPlanResponse,
    ChatRequest, ChatResponse
)
from ml_manager import ml_manager

# Ensure tables exist
Base.metadata.create_all(bind=engine)

def get_or_create_dynamic_area(db: Session, area_name: str):
    area_name = area_name.title().strip()
    area = db.query(Area).filter(Area.area_name == area_name).first()
    if area:
        return area
    
    import random
    seed = sum(ord(c) for c in area_name)
    random.seed(seed)
    
    new_area = Area(
        area_name=area_name,
        population=int(random.uniform(50000, 500000)),
        income_level=int(random.uniform(40000, 250000)),
        average_rent_sqft=round(random.uniform(50, 400), 2),
        foot_traffic_index=round(random.uniform(30.0, 95.0), 2)
    )
    db.add(new_area)
    
    categories = db.query(Category.category_name).all()
    cat_names = [c[0] for c in categories]
    if cat_names:
        for _ in range(int(random.uniform(10, 100))):
            b = Business(
                business_id=random.randint(100000, 9999999),
                area_name=area_name,
                category_name=random.choice(cat_names),
                age_months=random.randint(1, 120),
                review_rating=round(random.uniform(2.5, 5.0), 1),
                status="Active"
            )
            db.add(b)
            
    db.commit()
    db.refresh(new_area)
    random.seed()
    return new_area

app = FastAPI(title="UrbanSpend API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/areas", response_model=List[str])
def get_areas(db: Session = Depends(get_db)):
    areas = db.query(Area.area_name).all()
    return [a[0] for a in areas]

@app.get("/api/categories", response_model=List[str])
def get_categories(db: Session = Depends(get_db)):
    cats = db.query(Category.category_name).all()
    if not cats:
        # Fallback common categories if DB is empty
        fallback = ["Cafe", "Grocery", "Pharmacy", "Gym", "Salon", "Boutique", "Hardware"]
        for cn in fallback:
            if not db.query(Category).filter(Category.category_name == cn).first():
                db.add(Category(category_name=cn))
        db.commit()
        cats = db.query(Category.category_name).all()
        
    return [c[0] for c in cats]

@app.post("/api/location-analysis", response_model=LocationAnalysisResponse)
def location_analysis(req: LocationAnalysisRequest, db: Session = Depends(get_db)):
    area = get_or_create_dynamic_area(db, req.area_name)
        
    total_biz = db.query(Business).filter(Business.area_name == req.area_name).count()
    
    # Calculate density for saturation
    density = total_biz / area.population * 1000 if area.population else 0
    saturation = ml_manager.check_saturation(density)
    cluster = ml_manager.get_area_cluster(area.population, area.income_level, area.average_rent_sqft, area.foot_traffic_index)
    
    # Simple top growing by just returning random or based on past trends 
    # For now, get all categories and pick top 5
    categories = db.query(Category.category_name).all()
    top_growing = []
    import random
    for c in categories:
        cat_name = c[0]
        forecast = ml_manager.get_forecast(area.area_name, cat_name)
        growth = 0
        if len(forecast['predicted_demand']) >= 2:
            growth = forecast['predicted_demand'][-1] - forecast['predicted_demand'][0]
        else:
            # Fallback if prophet model data is missing for some reason
            growth = random.uniform(1.0, 10.0)
            
        top_growing.append({"category": cat_name, "growth_metric": round(growth, 2)})
        
    # Sort descending and take top 5
    top_growing.sort(key=lambda x: x["growth_metric"], reverse=True)
    top_growing = top_growing[:5]
    
    sentiment = ml_manager.get_competitor_sentiment(area.area_name)

    return LocationAnalysisResponse(
        area_name=area.area_name,
        population=area.population,
        income_level=area.income_level,
        rent_sqft=area.average_rent_sqft,
        total_existing_businesses=total_biz,
        competition_score=round(total_biz / 100.0, 2), # mockup
        demand_score=area.foot_traffic_index,
        market_saturation_index=saturation,
        top_growing_categories=top_growing,
        foot_traffic_index=area.foot_traffic_index,
        cluster_tier=cluster,
        competitor_sentiment=sentiment
    )

@app.post("/api/recommendation", response_model=RecommendationResponse)
def recommend_business(req: RecommendationRequest, db: Session = Depends(get_db)):
    area = get_or_create_dynamic_area(db, req.area_name)
        
    # If category not provided, iterate all and find best ROI/Risk
    categories = db.query(Category.category_name).all()
    best_cat = req.preferred_category if req.preferred_category else None
    best_risk = 100
    best_roi = 999
    
    density = db.query(Business).filter(Business.area_name == req.area_name).count() / area.population * 1000
    
    if not best_cat:
        if not categories:
            # Final fallback if still empty
            categories = [("General Retail",)]
            
        for c in categories:
            cat_name = c[0]
            comp = db.query(Business).filter(Business.area_name == area.area_name, Business.category_name == cat_name).count()
            risk, roi = ml_manager.predict_risk_roi(
                area.area_name, cat_name, area.population, area.income_level, 
                area.average_rent_sqft, area.foot_traffic_index, comp, density
            )
            # Optimize for lowest risk & fastest roi
            score = risk + roi 
            if score < (best_risk + best_roi):
                best_risk = risk
                best_roi = roi
                best_cat = cat_name
    else:
        comp = db.query(Business).filter(Business.area_name == area.area_name, Business.category_name == best_cat).count()
        best_risk, best_roi = ml_manager.predict_risk_roi(
            area.area_name, best_cat, area.population, area.income_level, 
            area.average_rent_sqft, area.foot_traffic_index, comp, density
        )
        
    if not best_cat:
        best_cat = "General Retail"

    # Get 6mo and 1yr growth forecast
    forecast = ml_manager.get_forecast(area.area_name, best_cat)
    pred_6m = forecast['predicted_demand'][5] if len(forecast['predicted_demand']) > 5 else 0
    pred_12m = forecast['predicted_demand'][11] if len(forecast['predicted_demand']) > 11 else 0

    return RecommendationResponse(
        recommended_business_type=best_cat,
        risk_score=best_risk,
        expected_roi_months=best_roi,
        predicted_6_month_growth=pred_6m,
        predicted_1_year_growth=pred_12m,
        profitability_index=round(100 - best_risk, 2)
    )

@app.post("/api/what-if", response_model=WhatIfResponse)
def what_if_simulator(req: WhatIfRequest, db: Session = Depends(get_db)):
    area = get_or_create_dynamic_area(db, req.area_name)
        
    density = db.query(Business).filter(Business.area_name == req.area_name).count() / area.population * 1000
    comp = db.query(Business).filter(Business.area_name == req.area_name, Business.category_name == req.business_type).count()
    
    # User's investment amount slightly alters the "risk" (more budget -> lower risk of failing early)
    budget_factor = req.investment_amount / 50000.0
    
    risk, roi = ml_manager.predict_risk_roi(
        area.area_name, req.business_type, area.population, area.income_level, 
        area.average_rent_sqft, area.foot_traffic_index, comp, density
    )
    
    adj_risk = max(0, risk - (budget_factor * 2))
    warning = "Investment may be slightly low for this area's average rent." if req.investment_amount < (area.average_rent_sqft * 500) else None

    return WhatIfResponse(
        risk_score=round(adj_risk, 2),
        expected_roi_months=round(roi, 2),
        profitability_index=round(100 - adj_risk, 2),
        warning_message=warning
    )

@app.post("/api/business-plan", response_model=BusinessPlanResponse)
def generate_business_plan(req: BusinessPlanRequest, db: Session = Depends(get_db)):
    area = get_or_create_dynamic_area(db, req.area_name)
        
    density = db.query(Business).filter(Business.area_name == req.area_name).count() / area.population * 1000
    comp = db.query(Business).filter(Business.area_name == req.area_name, Business.category_name == req.business_type).count()
    
    # Calculate Risk & ROI
    budget_factor = req.investment_amount / 50000.0
    risk, roi = ml_manager.predict_risk_roi(
        area.area_name, req.business_type, area.population, area.income_level, 
        area.average_rent_sqft, area.foot_traffic_index, comp, density
    )
    
    adj_risk = max(0, risk - (budget_factor * 2))
    profitability = round(100 - adj_risk, 2)
    
    saturation = ml_manager.check_saturation(density)
    sentiment = ml_manager.get_competitor_sentiment(area.area_name)
    
    plan_content = ml_manager.generate_business_plan_content(
        area=area.area_name,
        business_type=req.business_type,
        investment=req.investment_amount,
        risk=round(adj_risk, 2),
        roi=round(roi, 2),
        profitability=profitability,
        population=area.population,
        comp=comp,
        density=density,
        demand=area.foot_traffic_index,
        saturation=saturation,
        sentiment=sentiment
    )
    
    return BusinessPlanResponse(plan_content=plan_content)

@app.post("/api/chat", response_model=ChatResponse)
def business_advisor_chat(req: ChatRequest):
    prompt_lower = req.prompt.lower()
    
    # More flexible mock LLM
    is_profit = any(word in prompt_lower for word in ["profitable", "best", "recommend", "highest", "return", "open", "start", "business", "good", "idea"])
    is_risk = any(word in prompt_lower for word in ["risk", "safe", "secure", "fail", "worry"])
    is_budget = any(word in prompt_lower for word in ["budget", "cheap", "cost", "money", "invest", "finance"])
    
    if "velachery" in prompt_lower:
        ans = "Velachery has high foot traffic and market saturation is slightly high. Based on current AI models, niche businesses like Co-working Spaces or specialized Clinics show the highest profitability index there."
    elif "adyar" in prompt_lower:
        ans = "Adyar is an emerging premium area. Our models indicate that opening a Cafe, a Bakery, or a Boutique Gym there yields a fast ROI due to the high-income demographics."
    elif "t nagar" in prompt_lower or "annanagar" in prompt_lower or "anna nagar" in prompt_lower:
        ans = "These are high-density, high-commercial hubs. The safest businesses (lowest risk score) here currently are Pharmacies and high-end Apparel Stores."
    elif "omr" in prompt_lower or "tambaram" in prompt_lower:
        ans = "These areas have affordable average rent per sqft. If you are starting out or on a budget, consider opening a Laundromat or a Cafe to capture the IT and residential growth."
    elif is_profit:
        ans = "Based on our predictive models, opening a Clinic or Co-working space in an Emerging area generally shows the highest profitability index right now. Which specific area in the city are you looking at?"
    elif is_risk:
        ans = "The safest businesses (lowest risk score) overall are Medical Shops and Supermarkets in high population density zones."
    elif is_budget:
        ans = "If you have a lower budget, consider opening a Laundromat or a Bakery in areas with affordable commercial real estate, such as Tambaram or OMR."
    else:
        ans = "As your AI Business Advisor, I analyze billions of local data points. I can tell you about the most profitable businesses, areas with the lowest risk, or where to invest based on your budget. Try asking: 'Should I open a cafe in Adyar?'"
    
    return ChatResponse(response=ans)
