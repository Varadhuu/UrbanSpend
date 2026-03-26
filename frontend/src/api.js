import axios from 'react';
import axiosLib from 'axios';

// The FastAPI backend will run on port 8000
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const api = axiosLib.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const getAreas = async () => {
    const response = await api.get('/areas');
    return response.data;
};

export const getCategories = async () => {
    const response = await api.get('/categories');
    return response.data;
};

export const fetchLocationAnalysis = async (areaName) => {
    const response = await api.post('/location-analysis', { area_name: areaName });
    return response.data;
};

export const fetchRecommendation = async (areaName, budget, preferredCategory) => {
    const response = await api.post('/recommendation', {
        area_name: areaName,
        investment_budget: budget,
        preferred_category: preferredCategory !== "Any" ? preferredCategory : null
    });
    return response.data;
};

export const fetchWhatIf = async (areaName, budget, businessType) => {
    const response = await api.post('/what-if', {
        area_name: areaName,
        investment_amount: budget,
        business_type: businessType
    });
    return response.data;
};

export const fetchChatResponse = async (prompt) => {
    const response = await api.post('/chat', { prompt });
    return response.data;
};

export const generateBusinessPlan = async (areaName, budget, businessType) => {
    const response = await api.post('/business-plan', {
        area_name: areaName,
        investment_amount: budget,
        business_type: businessType
    });
    return response.data;
};

export default api;
