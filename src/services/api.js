import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'https://datapulse-api-y158.onrender.com';
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const uploadFile = (formData) => {
  return api.post('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const getSummary = (sessionId) => {
  return api.get(`/summary/${sessionId}`);
};

export const manualClean = (data) => {
  return api.post('/clean/manual', data);
};

export const autoClean = (data) => {
  return api.post('/clean/auto', data);
};

export const getVisualizations = (sessionId, type = 'all') => {
  return api.get(`/visualizations/${sessionId}?type=${type}`);
};

export const getOutliers = (sessionId) => {
  return api.get(`/outliers/${sessionId}`);
};

export const treatOutliers = (data) => {
  return api.post('/outliers/treat', data);
};

export const trainModel = (data) => {
  return api.post('/ml/train', data);
};

export const predict = (data) => {
  return api.post('/ml/predict', data);
};

export const getInsights = (sessionId, type = 'enhanced') => {
  return api.get(`/insights/${sessionId}?type=${type}`);
};

export const downloadData = (sessionId) => {
  return `${API_URL}/download/${sessionId}`;
};

export const downloadModel = (sessionId) => {
  return `${API_URL}/download/model/${sessionId}`;
};

export const executeCode = (data) => {
  return api.post('/notebook/execute', data);
};

export default api;
