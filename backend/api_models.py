from pydantic import BaseModel
from typing import Optional, List, Dict, Any

class LocationAnalysisRequest(BaseModel):
    area_name: str

class LocationAnalysisResponse(BaseModel):
    area_name: str
    population: int
    income_level: int
    rent_sqft: float
    total_existing_businesses: int
    competition_score: float
    demand_score: float
    market_saturation_index: str
    top_growing_categories: List[Dict[str, Any]]
    foot_traffic_index: float
    cluster_tier: str
    competitor_sentiment: Dict[str, Any]

class RecommendationRequest(BaseModel):
    investment_budget: float
    area_name: str
    preferred_category: Optional[str] = None

class RecommendationResponse(BaseModel):
    recommended_business_type: str
    risk_score: float
    expected_roi_months: float
    predicted_6_month_growth: float
    predicted_1_year_growth: float
    profitability_index: float

class WhatIfRequest(BaseModel):
    investment_amount: float
    business_type: str
    area_name: str

class WhatIfResponse(BaseModel):
    risk_score: float
    expected_roi_months: float
    profitability_index: float
    warning_message: Optional[str] = None

class BusinessPlanRequest(BaseModel):
    area_name: str
    business_type: str
    investment_amount: float
    
class BusinessPlanResponse(BaseModel):
    plan_content: str

class ChatRequest(BaseModel):
    prompt: str

class ChatResponse(BaseModel):
    response: str
