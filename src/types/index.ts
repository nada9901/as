/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * HealthGluco - Global TypeScript Type Definitions & Schemas
 */

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: 'Patient' | 'Administrator';
  age_group: number;
  sex: number; // 0 = Female, 1 = Male
  bmi: number;
  is_active?: boolean;
  is_verified?: boolean;
  created_at?: string;
  last_login?: string;
}

export interface PredictionInputPayload {
  BMI: number;
  HighBP: number;          // 0 = No, 1 = Yes
  HighChol: number;        // 0 = No, 1 = Yes
  CholCheck: number;       // 0 = No check in 5 yrs, 1 = Yes check
  Stroke: number;          // 0 = No, 1 = Yes
  HeartDiseaseorAttack: number; // 0 = No, 1 = Yes
  Smoker: number;          // 0 = No, 1 = Yes (>100 cigs in lifetime)
  HvyAlcoholConsump: number; // 0 = No, 1 = Yes
  PhysActivity: number;    // 0 = No activity, 1 = Physical activity in past 30 days
  Fruits: number;          // 0 = No fruit 1+ times per day, 1 = Yes
  Veggies: number;         // 0 = No veggies 1+ times per day, 1 = Yes
  MentHlth: number;        // Days of poor mental health (0-30)
  PhysHlth: number;        // Days of poor physical health (0-30)
  DiffWalk: number;        // 0 = No diff walking/stairs, 1 = Yes
  GenHlth: number;         // 1 = Excellent, 2 = Very Good, 3 = Good, 4 = Fair, 5 = Poor
  Sex: number;             // 0 = Female, 1 = Male
  Age: number;             // 1 to 13 age categories (18-24 to 80+)
  Education: number;       // 1 = Never attended to 6 = College graduate
  Income: number;          // 1 (<$10k) to 8 (>$75k)
  AnyHealthcare: number;   // 0 = No, 1 = Yes
  NoDocbcCost: number;     // 0 = No, 1 = Yes (cost prevented checkup)
}

export interface PredictionResponse {
  probability: number;
  prediction_class: 0 | 1;
  risk_tier: 'Low Risk' | 'Moderate Risk' | 'High Risk';
  color_code: 'green' | 'orange' | 'red';
  top_risk_factors: string[];
  recommendations: string[];
}

export interface PredictionHistoryRecord extends PredictionResponse {
  id: string;
  user_id: string;
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

export interface NotificationRecord {
  id: string;
  user_id: string;
  title: string;
  message: string;
  is_read: boolean;
  notification_type: 'CLINICAL_ALERT' | 'SYSTEM' | 'SCREENING_REMINDER';
  created_at: string;
}

export interface AdminDashboardMetrics {
  totalUsers: number;
  totalPredictions: number;
  todayPredictions: number;
  weeklyPredictions: number;
  monthlyPredictions: number;
  highRiskPercent: number;
  estimatedSavingsSar: number;
  regionalDistribution: Array<{ region: string; count: number; prevalence: string }>;
  riskDistribution: Array<{ name: string; value: number; color: string }>;
  ageDistribution: Array<{ age_group: string; count: number }>;
  genderDistribution: Array<{ gender: string; count: number }>;
  heatmapData: Array<{ age_group: string; bmi_normal: number; bmi_overweight: number; bmi_obese: number }>;
}

export interface AdminDashboardData {
  metrics: AdminDashboardMetrics;
  latestUsers: User[];
  latestPredictions: PredictionHistoryRecord[];
  activityLogs: AuditLogRecord[];
  systemStatus: {
    model_status: string;
    model_threshold: string;
    database_status: string;
    server_uptime: string;
    api_version: string;
  };
}

export const AGE_GROUP_LABELS: Record<number, string> = {
  1: '18 to 24 years',
  2: '25 to 29 years',
  3: '30 to 34 years',
  4: '35 to 39 years',
  5: '40 to 44 years',
  6: '45 to 49 years',
  7: '50 to 54 years',
  8: '55 to 59 years',
  9: '60 to 64 years',
  10: '65 to 69 years',
  11: '70 to 74 years',
  12: '75 to 79 years',
  13: '80 years or older',
};

export const EDUCATION_LABELS: Record<number, string> = {
  1: 'Never attended school / Kindergarten only',
  2: 'Elementary school (Grades 1-8)',
  3: 'Some high school (Grades 9-11)',
  4: 'High school graduate / GED',
  5: 'Some college / technical school',
  6: 'College graduate or higher',
};

export const INCOME_LABELS: Record<number, string> = {
  1: 'Less than 40,000 SAR (ر.س) / yr',
  2: '40,000 to 59,999 SAR (ر.س) / yr',
  3: '60,000 to 79,999 SAR (ر.س) / yr',
  4: '80,000 to 99,999 SAR (ر.س) / yr',
  5: '100,000 to 139,999 SAR (ر.س) / yr',
  6: '140,000 to 199,999 SAR (ر.س) / yr',
  7: '200,000 to 299,999 SAR (ر.س) / yr',
  8: '300,000 SAR (ر.س) / yr or more',
};
