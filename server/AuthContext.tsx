/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * HealthGluco - Authentication & Session Context Provider
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { apiService } from '../services/api';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  totalPredictions: number;
  latestRiskTier: string;
  latestProbability: number;
  login: (token: string, refreshToken: string, userData: User) => Promise<void>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [totalPredictions, setTotalPredictions] = useState(0);
  const [latestRiskTier, setLatestRiskTier] = useState('Not Evaluated');
  const [latestProbability, setLatestProbability] = useState(0);

  const loadCurrentUser = async () => {
    const token = localStorage.getItem('hg_access_token');
    if (!token) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    try {
      const res = await apiService.getMe();
      setUser(res.user);
      setTotalPredictions(res.total_predictions);
      setLatestRiskTier(res.latest_risk_tier);
      setLatestProbability(res.latest_probability);
    } catch (err) {
      setUser(null);
      localStorage.removeItem('hg_access_token');
      localStorage.removeItem('hg_refresh_token');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCurrentUser();

    const handleUnauthorized = () => {
      setUser(null);
      setIsLoading(false);
    };

    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('auth:unauthorized', handleUnauthorized);
  }, []);

  const login = async (token: string, refreshToken: string, userData: User) => {
    localStorage.setItem('hg_access_token', token);
    localStorage.setItem('hg_refresh_token', refreshToken);
    setUser(userData);
    await loadCurrentUser();
  };

  const logout = async () => {
    try {
      await apiService.logout();
    } catch {
      // ignore network errors on logout
    } finally {
      setUser(null);
      setTotalPredictions(0);
      setLatestRiskTier('Not Evaluated');
      setLatestProbability(0);
    }
  };

  const refreshProfile = async () => {
    await loadCurrentUser();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'Administrator',
        isLoading,
        totalPredictions,
        latestRiskTier,
        latestProbability,
        login,
        logout,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
