/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * HealthGluco - Frontend API Service Layer
 */

import axios, { AxiosError } from 'axios';
import {
  User,
  PredictionInputPayload,
  PredictionResponse,
  PredictionHistoryRecord,
  AdminDashboardData,
  NotificationRecord,
  AuditLogRecord
} from '../types';

const BASE_URL = '/api/v1';

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Inject JWT token into Authorization header
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('hg_access_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle expired tokens / 401 Unauthorized
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Avoid redirect loops if checking /auth/me
      if (!error.config?.url?.includes('/auth/me')) {
        localStorage.removeItem('hg_access_token');
        localStorage.removeItem('hg_refresh_token');
        window.dispatchEvent(new Event('auth:unauthorized'));
      }
    }
    return Promise.reject(error);
  }
);

export const apiService = {
  // Authentication & Session
  async register(data: { email: string; full_name: string; password: string; role?: string; age_group?: number; sex?: number; bmi?: number }) {
    const res = await apiClient.post('/auth/register', data);
    return res.data;
  },

  async login(data: { email: string; password: string }) {
    const res = await apiClient.post('/auth/login', data);
    return res.data;
  },

  async getMe(): Promise<{ user: User; total_predictions: number; latest_risk_tier: string; latest_probability: number }> {
    const res = await apiClient.get('/auth/me');
    return res.data;
  },

  async logout() {
    try {
      await apiClient.post('/auth/logout');
    } finally {
      localStorage.removeItem('hg_access_token');
      localStorage.removeItem('hg_refresh_token');
    }
  },

  // Prediction Screening Engine
  async submitPrediction(payload: PredictionInputPayload): Promise<PredictionResponse> {
    const res = await apiClient.post('/predict', payload);
    return res.data;
  },

  async getPredictionHistory(riskTier?: string, limit = 50): Promise<{ total: number; predictions: PredictionHistoryRecord[] }> {
    const params: Record<string, string | number> = { limit };
    if (riskTier && riskTier !== 'ALL') {
      params.risk_tier = riskTier;
    }
    const res = await apiClient.get('/predict/history', { params });
    return res.data;
  },

  async getPredictionById(id: string): Promise<PredictionHistoryRecord> {
    const res = await apiClient.get(`/predict/history/${id}`);
    return res.data;
  },

  async comparePredictions(ids: string[]): Promise<{
    comparison: PredictionHistoryRecord[];
    trend_analysis: { probability_diff: number; bmi_diff: number };
  }> {
    const res = await apiClient.post('/predict/compare', { prediction_ids: ids });
    return res.data;
  },

  // Administrator Dashboard
  async getAdminDashboard(): Promise<AdminDashboardData> {
    const res = await apiClient.get('/admin/dashboard');
    return res.data;
  },

  async getAdminUsers(role?: string): Promise<User[]> {
    const params = role && role !== 'ALL' ? { role } : {};
    const res = await apiClient.get('/admin/users', { params });
    return res.data;
  },

  async getAdminLogs(): Promise<AuditLogRecord[]> {
    const res = await apiClient.get('/admin/logs');
    return res.data;
  },

  async getAdminExport(): Promise<any> {
    const res = await apiClient.get('/admin/export');
    return res.data;
  },

  // User Profile & Notifications
  async updateProfile(data: { full_name?: string; age_group?: number; sex?: number; bmi?: number }): Promise<User> {
    const res = await apiClient.put('/users/profile', data);
    return res.data;
  },

  async getNotifications(): Promise<NotificationRecord[]> {
    const res = await apiClient.get('/users/notifications');
    return res.data;
  },

  async markNotificationRead(id: string): Promise<void> {
    await apiClient.put(`/users/notifications/${id}/read`);
  },

  async deleteAccount(): Promise<void> {
    await apiClient.delete('/users/account');
  },

  async getHealth(): Promise<{ status: string; model_loaded: boolean; model_version: string; threshold: number }> {
    const res = await apiClient.get('/health');
    return res.data;
  }
};
