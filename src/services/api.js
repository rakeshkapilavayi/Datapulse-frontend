import axios from 'axios';

const API_URL = 'https://datapulse-api-y158.onrender.com/api';  // FIXED: Added /api

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Upload file
export const uploadFile = (formData) => {
  return api.post('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

// Get dataset summary
export const getSummary = (sessionId) => {
  return api.get(`/summary/${sessionId}`);  // FIXED: Proper template literal
};

// Manual cleaning
export const manualClean = (data) => {
  return api.post('/clean/manual', data);
};

// Auto cleaning
export const autoClean = (data) => {
  return api.post('/clean/auto', data);
};

// Get visualizations
export const getVisualizations = (sessionId, type = 'all') => {
  return api.get(`/visualizations/${sessionId}?type=${type}`);  // FIXED: Proper template literal
};

// Get outliers
export const getOutliers = (sessionId) => {
  return api.get(`/outliers/${sessionId}`);  // FIXED: Proper template literal
};

// Treat outliers
export const treatOutliers = (data) => {
  return api.post('/outliers/treat', data);
};

// Train ML model
export const trainModel = (data) => {
  return api.post('/ml/train', data);
};

// Make predictions
export const predict = (data) => {
  return api.post('/ml/predict', data);
};

// Get insights
export const getInsights = (sessionId, type = 'raw') => {  // FIXED: Changed default to 'raw'
  return api.get(`/insights/${sessionId}?type=${type}`);  // FIXED: Proper template literal
};

// Download cleaned data
export const downloadData = (sessionId) => {
  return `${API_URL}/download/${sessionId}`;
};

// Download trained model
export const downloadModel = (sessionId) => {
  return `${API_URL}/download/model/${sessionId}`;
};

// Execute notebook code
export const executeCode = (data) => {
  return api.post('/notebook/execute', data);
};

// Create custom visualization
export const createCustomVisualization = (sessionId, data) => {
  return api.post(`/visualizations/${sessionId}/custom`, data);
};

// Get box plot for outliers
export const getBoxPlot = (sessionId, column) => {
  return api.get(`/outliers/${sessionId}/boxplot/${column}`);
};

// Upload secondary dataset
export const uploadSecondaryDataset = (sessionId, formData) => {
  return api.post('/upload_secondary', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

// Get suitable columns for ML
export const getSuitableColumns = (sessionId, taskType) => {
  return api.get(`/ml/suitable-columns/${sessionId}?task_type=${taskType}`);
};

export default api;
