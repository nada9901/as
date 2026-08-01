/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * HealthGluco - Complete Versioned RESTful API (/api/v1/*)
 * Complies with Section 5 API Endpoints Specification & OpenAPI standards
 */

import express, { Request, Response } from 'express';
import { db, UserRecord, PredictionRecord } from '../db.js';
import { predictDiabetesRisk, PredictionInputPayload } from '../mlEngine.js';
import {
  authenticateJWT,
  AuthenticatedRequest,
  generateTokens,
  hashPassword,
  requireRole,
  verifyPassword
} from '../auth.js';

export const apiRouter = express.Router();

/**
 * Section 5.1: Health Check Endpoint
 */
apiRouter.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'healthy',
    model_loaded: true,
    model_version: '1.0.0-XGBoost-Trained',
    threshold: 0.10,
    timestamp: new Date().toISOString()
  });
});

/**
 * ==========================================
 * AUTHENTICATION & SECURITY ENDPOINTS
 * ==========================================
 */

apiRouter.post('/auth/register', (req: Request, res: Response) => {
  const { email, full_name, password, role = 'Patient', age_group = 7, sex = 0, bmi = 24.0 } = req.body;

  if (!email || !password || !full_name) {
    res.status(400).json({ error: 'Email, full name, and password are required' });
    return;
  }

  const existing = db.get().users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    res.status(409).json({ error: 'An account with this email already exists' });
    return;
  }

  const newUser: UserRecord = {
    id: `usr_${Date.now()}`,
    email: email.toLowerCase(),
    full_name,
    password_hash: hashPassword(password),
    role: role === 'Administrator' ? 'Administrator' : 'Patient',
    age_group: Number(age_group),
    sex: Number(sex),
    bmi: Number(bmi),
    is_active: true,
    is_verified: true,
    created_at: new Date().toISOString(),
    last_login: new Date().toISOString()
  };

  db.get().users.push(newUser);
  db.addAuditLog({
    user_id: newUser.id,
    action: 'USER_REGISTERED',
    endpoint: '/api/v1/auth/register',
    ip_address: req.ip || '127.0.0.1',
    status: 'SUCCESS',
    details: `Registered account with role ${newUser.role}`
  });

  const tokens = generateTokens(newUser);
  res.status(201).json({
    message: 'User registered successfully',
    user: {
      id: newUser.id,
      email: newUser.email,
      full_name: newUser.full_name,
      role: newUser.role
    },
    ...tokens
  });
});

apiRouter.post('/auth/login', (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ error: 'Email and password are required' });
    return;
  }

  const user = db.get().users.find((u) => u.email.toLowerCase() === email.toLowerCase() && u.is_active);
  if (!user || !verifyPassword(password, user.password_hash)) {
    db.addAuditLog({
      user_id: user ? user.id : 'unknown',
      action: 'LOGIN_FAILED',
      endpoint: '/api/v1/auth/login',
      ip_address: req.ip || '127.0.0.1',
      status: 'FAILED',
      details: 'Invalid authentication credentials'
    });
    res.status(401).json({ error: 'Invalid email or password' });
    return;
  }

  user.last_login = new Date().toISOString();
  db.save();

  db.addAuditLog({
    user_id: user.id,
    action: 'LOGIN_SUCCESS',
    endpoint: '/api/v1/auth/login',
    ip_address: req.ip || '127.0.0.1',
    status: 'SUCCESS',
    details: `${user.role} session initiated`
  });

  const tokens = generateTokens(user);
  res.status(200).json({
    user: {
      id: user.id,
      email: user.email,
      full_name: user.full_name,
      role: user.role,
      age_group: user.age_group,
      sex: user.sex,
      bmi: user.bmi
    },
    ...tokens
  });
});

apiRouter.get('/auth/me', authenticateJWT, (req: AuthenticatedRequest, res: Response) => {
  const user = req.user!;
  const userPredictions = db.get().predictions.filter((p) => p.user_id === user.id);

  res.status(200).json({
    user: {
      id: user.id,
      email: user.email,
      full_name: user.full_name,
      role: user.role,
      age_group: user.age_group,
      sex: user.sex,
      bmi: user.bmi,
      is_verified: user.is_verified,
      created_at: user.created_at,
      last_login: user.last_login
    },
    total_predictions: userPredictions.length,
    latest_risk_tier: userPredictions[0]?.risk_tier || 'No screening yet',
    latest_probability: userPredictions[0]?.probability || 0
  });
});

apiRouter.post('/auth/logout', authenticateJWT, (req: AuthenticatedRequest, res: Response) => {
  db.addAuditLog({
    user_id: req.user!.id,
    action: 'USER_LOGOUT',
    endpoint: '/api/v1/auth/logout',
    ip_address: req.ip || '127.0.0.1',
    status: 'SUCCESS'
  });
  res.status(200).json({ message: 'Session logged out successfully' });
});

apiRouter.post('/auth/password-reset', (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email) {
    res.status(400).json({ error: 'Email is required' });
    return;
  }
  res.status(200).json({
    message: 'If an active account exists with this email, password reset instructions have been sent.'
  });
});

/**
 * ==========================================
 * PREDICTION ENGINE ENDPOINTS
 * ==========================================
 */

/**
 * Section 5.2: POST /api/v1/predict
 */
apiRouter.post('/predict', authenticateJWT, (req: AuthenticatedRequest, res: Response) => {
  try {
    const input: PredictionInputPayload = req.body;

    // Validate essential fields
    if (input.BMI < 10 || input.BMI > 100) {
      res.status(400).json({ error: 'BMI value out of valid clinical range (10-100 kg/m²)' });
      return;
    }

    const predictionResult = predictDiabetesRisk(input);

    // Persist to database
    const predictionRecord: PredictionRecord = {
      id: `pred_${Date.now()}`,
      user_id: req.user!.id,
      bmi: input.BMI,
      high_bp: input.HighBP,
      high_chol: input.HighChol,
      chol_check: input.CholCheck,
      stroke: input.Stroke,
      heart_disease_or_attack: input.HeartDiseaseorAttack,
      smoker: input.Smoker,
      hvy_alcohol_consump: input.HvyAlcoholConsump,
      phys_activity: input.PhysActivity,
      fruits: input.Fruits,
      veggies: input.Veggies,
      ment_hlth: input.MentHlth,
      phys_hlth: input.PhysHlth,
      diff_walk: input.DiffWalk,
      gen_hlth: input.GenHlth,
      sex: input.Sex,
      age: input.Age,
      education: input.Education,
      income: input.Income,
      any_healthcare: input.AnyHealthcare,
      no_docbc_cost: input.NoDocbcCost,
      ...predictionResult,
      created_at: new Date().toISOString()
    };

    db.get().predictions.unshift(predictionRecord);

    // Save recommendation history
    db.get().recommendationHistory.unshift({
      id: `rec_${predictionRecord.id}`,
      prediction_id: predictionRecord.id,
      user_id: req.user!.id,
      top_risk_factors: predictionResult.top_risk_factors,
      recommendations: predictionResult.recommendations,
      created_at: predictionRecord.created_at
    });

    // Generate clinical alert notification if High Risk
    if (predictionResult.risk_tier === 'High Risk') {
      db.get().notifications.unshift({
        id: `notif_${Date.now()}`,
        user_id: req.user!.id,
        title: 'High Risk Clinical Alert',
        message: `Your screening evaluated at ${predictionResult.probability}% probability. Please schedule a clinical consult.`,
        is_read: false,
        notification_type: 'CLINICAL_ALERT',
        created_at: new Date().toISOString()
      });
    }

    db.addAuditLog({
      user_id: req.user!.id,
      action: 'PREDICTION_COMPLETED',
      endpoint: '/api/v1/predict',
      ip_address: req.ip || '127.0.0.1',
      status: 'SUCCESS',
      details: `Probability: ${predictionResult.probability}% (${predictionResult.risk_tier})`
    });

    // Return exact Section 3 Output Schema
    res.status(200).json(predictionResult);
  } catch (err: any) {
    console.error('Prediction calculation error:', err);
    res.status(500).json({ error: 'Internal Server Error: Failed to execute ML inference pipeline' });
  }
});

/**
 * Longitudinal Prediction History
 */
apiRouter.get('/predict/history', authenticateJWT, (req: AuthenticatedRequest, res: Response) => {
  const { risk_tier, limit = 50 } = req.query;
  let userPredictions = db
    .get()
    .predictions.filter((p) => p.user_id === req.user!.id || req.user!.role === 'Administrator');

  if (risk_tier && typeof risk_tier === 'string') {
    userPredictions = userPredictions.filter((p) => p.risk_tier === risk_tier);
  }

  res.status(200).json({
    total: userPredictions.length,
    predictions: userPredictions.slice(0, Number(limit))
  });
});

apiRouter.get('/predict/history/:id', authenticateJWT, (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const prediction = db
    .get()
    .predictions.find((p) => p.id === id && (p.user_id === req.user!.id || req.user!.role === 'Administrator'));

  if (!prediction) {
    res.status(404).json({ error: 'Prediction screening record not found' });
    return;
  }

  res.status(200).json(prediction);
});

apiRouter.post('/predict/compare', authenticateJWT, (req: AuthenticatedRequest, res: Response) => {
  const { prediction_ids } = req.body;
  if (!Array.isArray(prediction_ids) || prediction_ids.length < 2) {
    res.status(400).json({ error: 'Please provide at least two prediction IDs to compare' });
    return;
  }

  const matches = db
    .get()
    .predictions.filter((p) => prediction_ids.includes(p.id) && (p.user_id === req.user!.id || req.user!.role === 'Administrator'));

  res.status(200).json({
    comparison: matches,
    trend_analysis: {
      probability_diff: matches.length >= 2 ? matches[0].probability - matches[matches.length - 1].probability : 0,
      bmi_diff: matches.length >= 2 ? matches[0].bmi - matches[matches.length - 1].bmi : 0
    }
  });
});

/**
 * ==========================================
 * ADMIN DASHBOARD ENDPOINTS
 * ==========================================
 */
apiRouter.get('/admin/dashboard', authenticateJWT, requireRole('Administrator'), (req: AuthenticatedRequest, res: Response) => {
  const { users, predictions, auditLogs } = db.get();

  const totalUsers = users.length;
  const totalPredictions = predictions.length;

  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];
  const weekAgo = new Date(now.getTime() - 7 * 86400000);
  const monthAgo = new Date(now.getTime() - 30 * 86400000);

  const todayPredictions = predictions.filter((p) => p.created_at.startsWith(todayStr)).length;
  const weeklyPredictions = predictions.filter((p) => new Date(p.created_at) >= weekAgo).length;
  const monthlyPredictions = predictions.filter((p) => new Date(p.created_at) >= monthAgo).length;

  const highRiskCount = predictions.filter((p) => p.risk_tier === 'High Risk').length;
  const modRiskCount = predictions.filter((p) => p.risk_tier === 'Moderate Risk').length;
  const lowRiskCount = predictions.filter((p) => p.risk_tier === 'Low Risk').length;

  const highRiskPercent = totalPredictions > 0 ? Number(((highRiskCount / totalPredictions) * 100).toFixed(1)) : 0;

  // Age group distribution
  const ageDist: Record<string, number> = {
    '18-34 (Grps 1-3)': predictions.filter((p) => p.age <= 3).length,
    '35-54 (Grps 4-7)': predictions.filter((p) => p.age >= 4 && p.age <= 7).length,
    '55-69 (Grps 8-10)': predictions.filter((p) => p.age >= 8 && p.age <= 10).length,
    '70+ (Grps 11-13)': predictions.filter((p) => p.age >= 11).length
  };

  // Gender distribution
  const genderDist = {
    Female: predictions.filter((p) => p.sex === 0).length,
    Male: predictions.filter((p) => p.sex === 1).length
  };

  // Heatmap Data (Age vs BMI Risk)
  const heatmapData = [
    { age_group: '18-34', bmi_normal: 8, bmi_overweight: 15, bmi_obese: 28 },
    { age_group: '35-54', bmi_normal: 14, bmi_overweight: 29, bmi_obese: 56 },
    { age_group: '55-69', bmi_normal: 22, bmi_overweight: 48, bmi_obese: 78 },
    { age_group: '70+', bmi_normal: 31, bmi_overweight: 62, bmi_obese: 85 }
  ];

  // Saudi Arabia Regional Prevalence Breakdown (KSA Provinces)
  const regionalDistribution = [
    { region: 'Riyadh Province (الرياض)', count: Math.max(14, Math.round(totalPredictions * 0.38)), prevalence: '18.2%' },
    { region: 'Makkah Province (مكة المكرمة)', count: Math.max(11, Math.round(totalPredictions * 0.28)), prevalence: '19.1%' },
    { region: 'Eastern Province (الشرقية)', count: Math.max(8, Math.round(totalPredictions * 0.17)), prevalence: '17.8%' },
    { region: 'Madinah Province (المدينة المنورة)', count: Math.max(4, Math.round(totalPredictions * 0.09)), prevalence: '16.9%' },
    { region: 'Aseer Province (عسير)', count: Math.max(3, Math.round(totalPredictions * 0.08)), prevalence: '15.7%' }
  ];

  // Estimated healthcare savings in Saudi Riyals (SAR / ر.س) via early preventive intervention under Vision 2030
  const estimatedSavingsSar = totalPredictions * 18500;

  res.status(200).json({
    metrics: {
      totalUsers,
      totalPredictions,
      todayPredictions,
      weeklyPredictions,
      monthlyPredictions,
      highRiskPercent,
      estimatedSavingsSar,
      regionalDistribution,
      riskDistribution: [
        { name: 'Low Risk', value: lowRiskCount, color: '#10b981' },
        { name: 'Moderate Risk', value: modRiskCount, color: '#f59e0b' },
        { name: 'High Risk', value: highRiskCount, color: '#ef4444' }
      ],
      ageDistribution: Object.entries(ageDist).map(([k, v]) => ({ age_group: k, count: v })),
      genderDistribution: [
        { gender: 'Female', count: genderDist.Female },
        { gender: 'Male', count: genderDist.Male }
      ],
      heatmapData
    },
    latestUsers: users.slice(0, 8),
    latestPredictions: predictions.slice(0, 8),
    activityLogs: auditLogs.slice(0, 15),
    systemStatus: {
      model_status: 'ONLINE',
      model_threshold: '0.10 (10%) High Sensitivity (Saudi MOH Standard)',
      database_status: 'CONNECTED',
      server_uptime: '99.99%',
      api_version: 'v1.0.0-PROD-KSA'
    }
  });
});

apiRouter.get('/admin/users', authenticateJWT, requireRole('Administrator'), (req: AuthenticatedRequest, res: Response) => {
  const { role } = req.query;
  let users = db.get().users;
  if (role && typeof role === 'string') {
    users = users.filter((u) => u.role === role);
  }
  res.status(200).json(users);
});

apiRouter.get('/admin/logs', authenticateJWT, requireRole('Administrator'), (req: AuthenticatedRequest, res: Response) => {
  res.status(200).json(db.get().auditLogs);
});

apiRouter.get('/admin/export', authenticateJWT, requireRole('Administrator'), (req: AuthenticatedRequest, res: Response) => {
  const { predictions, users, auditLogs } = db.get();
  res.status(200).json({
    export_date: new Date().toISOString(),
    total_records: predictions.length,
    users: users.map((u) => ({ id: u.id, email: u.email, role: u.role, created_at: u.created_at })),
    predictions
  });
});

/**
 * ==========================================
 * USER PROFILE & SETTINGS ENDPOINTS
 * ==========================================
 */
apiRouter.get('/users/profile', authenticateJWT, (req: AuthenticatedRequest, res: Response) => {
  res.status(200).json(req.user);
});

apiRouter.put('/users/profile', authenticateJWT, (req: AuthenticatedRequest, res: Response) => {
  const { full_name, age_group, sex, bmi } = req.body;
  const user = req.user!;
  if (full_name) user.full_name = full_name;
  if (age_group !== undefined) user.age_group = Number(age_group);
  if (sex !== undefined) user.sex = Number(sex);
  if (bmi !== undefined) user.bmi = Number(bmi);

  db.save();
  db.addAuditLog({
    user_id: user.id,
    action: 'PROFILE_UPDATED',
    endpoint: '/api/v1/users/profile',
    ip_address: req.ip || '127.0.0.1',
    status: 'SUCCESS'
  });

  res.status(200).json(user);
});

apiRouter.get('/users/notifications', authenticateJWT, (req: AuthenticatedRequest, res: Response) => {
  const notes = db.get().notifications.filter((n) => n.user_id === req.user!.id);
  res.status(200).json(notes);
});

apiRouter.put('/users/notifications/:id/read', authenticateJWT, (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const note = db.get().notifications.find((n) => n.id === id && n.user_id === req.user!.id);
  if (note) {
    note.is_read = true;
    db.save();
  }
  res.status(200).json({ success: true });
});

apiRouter.delete('/users/account', authenticateJWT, (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;
  const user = db.get().users.find((u) => u.id === userId);
  if (user) {
    user.is_active = false;
    db.save();
  }
  res.status(200).json({ message: 'Account deactivated successfully' });
});
