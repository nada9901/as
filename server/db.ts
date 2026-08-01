/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * HealthGluco - Embedded Relational Database Layer for Dev/Preview & Standalone Node Execution
 * Compatible with SQLite / PostgreSQL schemas: Users, Predictions, RecommendationHistory, AuditLogs, RefreshTokens, SystemSettings, Notifications
 */

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

export interface UserRecord {
  id: string;
  email: string;
  full_name: string;
  password_hash: string;
  role: 'Patient' | 'Administrator';
  age_group: number;
  sex: number;
  bmi: number;
  is_active: boolean;
  is_verified: boolean;
  created_at: string;
  last_login?: string;
}

export interface PredictionRecord {
  id: string;
  user_id: string;
  bmi: number;
  high_bp: number;
  high_chol: number;
  chol_check: number;
  stroke: number;
  heart_disease_or_attack: number;
  smoker: number;
  hvy_alcohol_consump: number;
  phys_activity: number;
  fruits: number;
  veggies: number;
  ment_hlth: number;
  phys_hlth: number;
  diff_walk: number;
  gen_hlth: number;
  sex: number;
  age: number;
  education: number;
  income: number;
  any_healthcare: number;
  no_docbc_cost: number;
  probability: number;
  prediction_class: number;
  risk_tier: 'Low Risk' | 'Moderate Risk' | 'High Risk';
  color_code: 'green' | 'orange' | 'red';
  top_risk_factors: string[];
  recommendations: string[];
  created_at: string;
}

export interface AuditLogRecord {
  id: string;
  user_id: string;
  action: string;
  endpoint: string;
  ip_address: string;
  status: 'SUCCESS' | 'WARNING' | 'FAILED';
  timestamp: string;
  details?: string;
}

export interface RecommendationHistoryRecord {
  id: string;
  prediction_id: string;
  user_id: string;
  top_risk_factors: string[];
  recommendations: string[];
  created_at: string;
}

export interface SystemSettingRecord {
  id: string;
  setting_key: string;
  setting_value: string;
  description: string;
  updated_at: string;
}

export interface NotificationRecord {
  id: string;
  user_id: string;
  title: string;
  message: string;
  is_read: boolean;
  notification_type: 'CLINICAL_ALERT' | 'SYSTEM' | 'SCREENING_REMINDER';
  created_at: string;
}

export interface DatabaseSchema {
  users: UserRecord[];
  predictions: PredictionRecord[];
  recommendationHistory: RecommendationHistoryRecord[];
  auditLogs: AuditLogRecord[];
  systemSettings: SystemSettingRecord[];
  notifications: NotificationRecord[];
}

const DB_PATH = path.join(process.cwd(), 'healthgluco_db.json');

function getInitialSeedData(): DatabaseSchema {
  const now = new Date().toISOString();
  const pastDays = (days: number) => new Date(Date.now() - days * 86400000).toISOString();

  const adminUser: UserRecord = {
    id: 'usr_admin_001',
    email: 'admin@healthgluco.ai',
    full_name: 'Dr. Tariq Al-Ghamdi (Chief Clinical Consultant - KSA MOH)',
    password_hash: '$2b$12$EzcHu5vk/9DjeL8iZBwTKuFBhuS7nuC.Nbmhzavf5KmvROA2HWxS2', // 'DemoPass123!'
    role: 'Administrator',
    age_group: 8,
    sex: 1,
    bmi: 24.1,
    is_active: true,
    is_verified: true,
    created_at: pastDays(60),
    last_login: now,
  };

  const patientUser: UserRecord = {
    id: 'usr_patient_001',
    email: 'patient@healthgluco.ai',
    full_name: 'Faisal Al-Otaibi (Riyadh, KSA)',
    password_hash: '$2b$12$EzcHu5vk/9DjeL8iZBwTKuFBhuS7nuC.Nbmhzavf5KmvROA2HWxS2', // 'DemoPass123!'
    role: 'Patient',
    age_group: 9,
    sex: 1,
    bmi: 31.4,
    is_active: true,
    is_verified: true,
    created_at: pastDays(45),
    last_login: now,
  };

  const patient2User: UserRecord = {
    id: 'usr_patient_002',
    email: 'noura.aldosari@gmail.com',
    full_name: 'Noura Al-Dosari (Makkah Province, KSA)',
    password_hash: '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW',
    role: 'Patient',
    age_group: 7,
    sex: 0,
    bmi: 26.2,
    is_active: true,
    is_verified: true,
    created_at: pastDays(30),
    last_login: pastDays(1),
  };

  const samplePredictions: PredictionRecord[] = [
    {
      id: 'pred_001',
      user_id: patientUser.id,
      bmi: 32.8,
      high_bp: 1,
      high_chol: 1,
      chol_check: 1,
      stroke: 0,
      heart_disease_or_attack: 0,
      smoker: 1,
      hvy_alcohol_consump: 0,
      phys_activity: 0,
      fruits: 0,
      veggies: 1,
      ment_hlth: 5,
      phys_hlth: 4,
      diff_walk: 0,
      gen_hlth: 4,
      sex: 1,
      age: 9,
      education: 5,
      income: 6,
      any_healthcare: 1,
      no_docbc_cost: 0,
      probability: 68.4,
      prediction_class: 1,
      risk_tier: 'High Risk',
      color_code: 'red',
      top_risk_factors: ['BMI (32.8 kg/m²)', 'High Blood Pressure', 'Physical Inactivity', 'High Cholesterol'],
      recommendations: [
        'Your BMI indicates overweight/obesity. Aim for a BMI of 18.5-24.9 through balanced nutrition and regular exercise.',
        'High blood pressure detected. Monitor regularly, reduce sodium intake, and consult a healthcare provider.',
        'Physical inactivity is a major risk factor. Aim for 150 minutes of moderate exercise weekly.',
        'High cholesterol detected. Focus on heart-healthy fats, soluble fiber, and regular clinical follow-ups.'
      ],
      created_at: pastDays(30)
    },
    {
      id: 'pred_002',
      user_id: patientUser.id,
      bmi: 31.4,
      high_bp: 1,
      high_chol: 1,
      chol_check: 1,
      stroke: 0,
      heart_disease_or_attack: 0,
      smoker: 0,
      hvy_alcohol_consump: 0,
      phys_activity: 1,
      fruits: 1,
      veggies: 1,
      ment_hlth: 2,
      phys_hlth: 1,
      diff_walk: 0,
      gen_hlth: 3,
      sex: 1,
      age: 9,
      education: 5,
      income: 6,
      any_healthcare: 1,
      no_docbc_cost: 0,
      probability: 34.2,
      prediction_class: 1,
      risk_tier: 'Moderate Risk',
      color_code: 'orange',
      top_risk_factors: ['BMI (31.4 kg/m²)', 'High Blood Pressure', 'High Cholesterol'],
      recommendations: [
        'Your BMI indicates overweight/obesity. Aim for a BMI of 18.5-24.9 through balanced nutrition and regular exercise.',
        'High blood pressure detected. Monitor regularly, reduce sodium intake, and consult a healthcare provider.',
        'High cholesterol detected. Focus on heart-healthy fats, soluble fiber, and regular clinical follow-ups.'
      ],
      created_at: pastDays(7)
    },
    {
      id: 'pred_003',
      user_id: patient2User.id,
      bmi: 24.1,
      high_bp: 0,
      high_chol: 0,
      chol_check: 1,
      stroke: 0,
      heart_disease_or_attack: 0,
      smoker: 0,
      hvy_alcohol_consump: 0,
      phys_activity: 1,
      fruits: 1,
      veggies: 1,
      ment_hlth: 0,
      phys_hlth: 0,
      diff_walk: 0,
      gen_hlth: 2,
      sex: 0,
      age: 7,
      education: 6,
      income: 7,
      any_healthcare: 1,
      no_docbc_cost: 0,
      probability: 8.4,
      prediction_class: 0,
      risk_tier: 'Low Risk',
      color_code: 'green',
      top_risk_factors: ['No dominant high-risk factors identified'],
      recommendations: [
        'Great job maintaining a healthy lifestyle! Continue regular aerobic exercise and balanced Mediterranean-style nutrition.',
        'Schedule routine annual screenings to keep cholesterol and glucose parameters within optimal clinical targets.'
      ],
      created_at: pastDays(3)
    }
  ];

  const sampleHistory: RecommendationHistoryRecord[] = samplePredictions.map(p => ({
    id: `rec_${p.id}`,
    prediction_id: p.id,
    user_id: p.user_id,
    top_risk_factors: p.top_risk_factors,
    recommendations: p.recommendations,
    created_at: p.created_at
  }));

  const sampleAuditLogs: AuditLogRecord[] = [
    {
      id: 'aud_01',
      user_id: adminUser.id,
      action: 'ADMIN_LOGIN',
      endpoint: '/api/v1/auth/login',
      ip_address: '10.240.0.12',
      status: 'SUCCESS',
      timestamp: pastDays(2),
      details: 'Administrator session authenticated'
    },
    {
      id: 'aud_02',
      user_id: patientUser.id,
      action: 'PREDICTION_COMPLETED',
      endpoint: '/api/v1/predict',
      ip_address: '172.16.0.4',
      status: 'SUCCESS',
      timestamp: pastDays(7),
      details: 'Model XGBoost v1.0.0 inference executed'
    },
    {
      id: 'aud_03',
      user_id: patientUser.id,
      action: 'PROFILE_UPDATED',
      endpoint: '/api/v1/users/profile',
      ip_address: '172.16.0.4',
      status: 'SUCCESS',
      timestamp: pastDays(1),
      details: 'Patient demographic parameters synchronized'
    }
  ];

  const sampleSettings: SystemSettingRecord[] = [
    {
      id: 'set_01',
      setting_key: 'ml_decision_threshold',
      setting_value: '0.10',
      description: 'Optimal clinical XGBoost decision threshold for Saudi Arabia MOH high medical sensitivity (10% cutoff)',
      updated_at: pastDays(30)
    },
    {
      id: 'set_02',
      setting_key: 'model_version',
      setting_value: '1.0.0-XGBoost-KSA-BRFSS',
      description: 'Serialized 21-feature gradient boosted tree artifact adapted for KSA screening epidemiology',
      updated_at: pastDays(30)
    },
    {
      id: 'set_03',
      setting_key: 'clinical_disclaimer_required',
      setting_value: 'true',
      description: 'Require mandatory patient disclaimer acknowledgment before PDF report download under KSA Health Council rules',
      updated_at: pastDays(30)
    }
  ];

  const sampleNotifications: NotificationRecord[] = [
    {
      id: 'notif_01',
      user_id: patientUser.id,
      title: 'New Clinical Assessment Ready',
      message: 'Your recent glycemic risk screening score was calculated at Moderate Risk (34.2%). Review clinical recommendations.',
      is_read: false,
      notification_type: 'CLINICAL_ALERT',
      created_at: pastDays(7)
    },
    {
      id: 'notif_02',
      user_id: patientUser.id,
      title: 'Quarterly Screening Reminder',
      message: 'Regular monitoring is key to diabetes prevention. Consider completing a new screening this month.',
      is_read: true,
      notification_type: 'SCREENING_REMINDER',
      created_at: pastDays(2)
    }
  ];

  return {
    users: [adminUser, patientUser, patient2User],
    predictions: samplePredictions,
    recommendationHistory: sampleHistory,
    auditLogs: sampleAuditLogs,
    systemSettings: sampleSettings,
    notifications: sampleNotifications
  };
}

class DatabaseManager {
  private data: DatabaseSchema;

  constructor() {
    this.data = this.loadData();
  }

  private loadData(): DatabaseSchema {
    try {
      if (fs.existsSync(DB_PATH)) {
        const raw = fs.readFileSync(DB_PATH, 'utf-8');
        return JSON.parse(raw);
      }
    } catch (e) {
      console.warn('Could not read existing database file, seeding defaults...');
    }
    const seeded = getInitialSeedData();
    this.saveData(seeded);
    return seeded;
  }

  private saveData(data: DatabaseSchema) {
    try {
      fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
    } catch (e) {
      console.error('Failed to persist database changes to file:', e);
    }
  }

  public get(): DatabaseSchema {
    return this.data;
  }

  public save() {
    this.saveData(this.data);
  }

  public addAuditLog(log: Omit<AuditLogRecord, 'id' | 'timestamp'>) {
    const newLog: AuditLogRecord = {
      ...log,
      id: `aud_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString()
    };
    this.data.auditLogs.unshift(newLog);
    if (this.data.auditLogs.length > 500) {
      this.data.auditLogs = this.data.auditLogs.slice(0, 500);
    }
    this.save();
  }
}

export const db = new DatabaseManager();
