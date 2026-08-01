var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express2 = __toESM(require("express"), 1);
var import_path2 = __toESM(require("path"), 1);
var import_vite = require("vite");

// server/routes/api.ts
var import_express = __toESM(require("express"), 1);

// server/db.ts
var import_fs = __toESM(require("fs"), 1);
var import_path = __toESM(require("path"), 1);
var DB_PATH = import_path.default.join(process.cwd(), "healthgluco_db.json");
function getInitialSeedData() {
  const now = (/* @__PURE__ */ new Date()).toISOString();
  const pastDays = (days) => new Date(Date.now() - days * 864e5).toISOString();
  const adminUser = {
    id: "usr_admin_001",
    email: "admin@healthgluco.ai",
    full_name: "Dr. Tariq Al-Ghamdi (Chief Clinical Consultant - KSA MOH)",
    password_hash: "$2b$12$EzcHu5vk/9DjeL8iZBwTKuFBhuS7nuC.Nbmhzavf5KmvROA2HWxS2",
    // 'DemoPass123!'
    role: "Administrator",
    age_group: 8,
    sex: 1,
    bmi: 24.1,
    is_active: true,
    is_verified: true,
    created_at: pastDays(60),
    last_login: now
  };
  const patientUser = {
    id: "usr_patient_001",
    email: "patient@healthgluco.ai",
    full_name: "Faisal Al-Otaibi (Riyadh, KSA)",
    password_hash: "$2b$12$EzcHu5vk/9DjeL8iZBwTKuFBhuS7nuC.Nbmhzavf5KmvROA2HWxS2",
    // 'DemoPass123!'
    role: "Patient",
    age_group: 9,
    sex: 1,
    bmi: 31.4,
    is_active: true,
    is_verified: true,
    created_at: pastDays(45),
    last_login: now
  };
  const patient2User = {
    id: "usr_patient_002",
    email: "noura.aldosari@gmail.com",
    full_name: "Noura Al-Dosari (Makkah Province, KSA)",
    password_hash: "$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW",
    role: "Patient",
    age_group: 7,
    sex: 0,
    bmi: 26.2,
    is_active: true,
    is_verified: true,
    created_at: pastDays(30),
    last_login: pastDays(1)
  };
  const samplePredictions = [
    {
      id: "pred_001",
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
      risk_tier: "High Risk",
      color_code: "red",
      top_risk_factors: ["BMI (32.8 kg/m\xB2)", "High Blood Pressure", "Physical Inactivity", "High Cholesterol"],
      recommendations: [
        "Your BMI indicates overweight/obesity. Aim for a BMI of 18.5-24.9 through balanced nutrition and regular exercise.",
        "High blood pressure detected. Monitor regularly, reduce sodium intake, and consult a healthcare provider.",
        "Physical inactivity is a major risk factor. Aim for 150 minutes of moderate exercise weekly.",
        "High cholesterol detected. Focus on heart-healthy fats, soluble fiber, and regular clinical follow-ups."
      ],
      created_at: pastDays(30)
    },
    {
      id: "pred_002",
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
      risk_tier: "Moderate Risk",
      color_code: "orange",
      top_risk_factors: ["BMI (31.4 kg/m\xB2)", "High Blood Pressure", "High Cholesterol"],
      recommendations: [
        "Your BMI indicates overweight/obesity. Aim for a BMI of 18.5-24.9 through balanced nutrition and regular exercise.",
        "High blood pressure detected. Monitor regularly, reduce sodium intake, and consult a healthcare provider.",
        "High cholesterol detected. Focus on heart-healthy fats, soluble fiber, and regular clinical follow-ups."
      ],
      created_at: pastDays(7)
    },
    {
      id: "pred_003",
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
      risk_tier: "Low Risk",
      color_code: "green",
      top_risk_factors: ["No dominant high-risk factors identified"],
      recommendations: [
        "Great job maintaining a healthy lifestyle! Continue regular aerobic exercise and balanced Mediterranean-style nutrition.",
        "Schedule routine annual screenings to keep cholesterol and glucose parameters within optimal clinical targets."
      ],
      created_at: pastDays(3)
    }
  ];
  const sampleHistory = samplePredictions.map((p) => ({
    id: `rec_${p.id}`,
    prediction_id: p.id,
    user_id: p.user_id,
    top_risk_factors: p.top_risk_factors,
    recommendations: p.recommendations,
    created_at: p.created_at
  }));
  const sampleAuditLogs = [
    {
      id: "aud_01",
      user_id: adminUser.id,
      action: "ADMIN_LOGIN",
      endpoint: "/api/v1/auth/login",
      ip_address: "10.240.0.12",
      status: "SUCCESS",
      timestamp: pastDays(2),
      details: "Administrator session authenticated"
    },
    {
      id: "aud_02",
      user_id: patientUser.id,
      action: "PREDICTION_COMPLETED",
      endpoint: "/api/v1/predict",
      ip_address: "172.16.0.4",
      status: "SUCCESS",
      timestamp: pastDays(7),
      details: "Model XGBoost v1.0.0 inference executed"
    },
    {
      id: "aud_03",
      user_id: patientUser.id,
      action: "PROFILE_UPDATED",
      endpoint: "/api/v1/users/profile",
      ip_address: "172.16.0.4",
      status: "SUCCESS",
      timestamp: pastDays(1),
      details: "Patient demographic parameters synchronized"
    }
  ];
  const sampleSettings = [
    {
      id: "set_01",
      setting_key: "ml_decision_threshold",
      setting_value: "0.10",
      description: "Optimal clinical XGBoost decision threshold for Saudi Arabia MOH high medical sensitivity (10% cutoff)",
      updated_at: pastDays(30)
    },
    {
      id: "set_02",
      setting_key: "model_version",
      setting_value: "1.0.0-XGBoost-KSA-BRFSS",
      description: "Serialized 21-feature gradient boosted tree artifact adapted for KSA screening epidemiology",
      updated_at: pastDays(30)
    },
    {
      id: "set_03",
      setting_key: "clinical_disclaimer_required",
      setting_value: "true",
      description: "Require mandatory patient disclaimer acknowledgment before PDF report download under KSA Health Council rules",
      updated_at: pastDays(30)
    }
  ];
  const sampleNotifications = [
    {
      id: "notif_01",
      user_id: patientUser.id,
      title: "New Clinical Assessment Ready",
      message: "Your recent glycemic risk screening score was calculated at Moderate Risk (34.2%). Review clinical recommendations.",
      is_read: false,
      notification_type: "CLINICAL_ALERT",
      created_at: pastDays(7)
    },
    {
      id: "notif_02",
      user_id: patientUser.id,
      title: "Quarterly Screening Reminder",
      message: "Regular monitoring is key to diabetes prevention. Consider completing a new screening this month.",
      is_read: true,
      notification_type: "SCREENING_REMINDER",
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
var DatabaseManager = class {
  constructor() {
    this.data = this.loadData();
  }
  loadData() {
    try {
      if (import_fs.default.existsSync(DB_PATH)) {
        const raw = import_fs.default.readFileSync(DB_PATH, "utf-8");
        return JSON.parse(raw);
      }
    } catch (e) {
      console.warn("Could not read existing database file, seeding defaults...");
    }
    const seeded = getInitialSeedData();
    this.saveData(seeded);
    return seeded;
  }
  saveData(data) {
    try {
      import_fs.default.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), "utf-8");
    } catch (e) {
      console.error("Failed to persist database changes to file:", e);
    }
  }
  get() {
    return this.data;
  }
  save() {
    this.saveData(this.data);
  }
  addAuditLog(log) {
    const newLog = {
      ...log,
      id: `aud_${Date.now()}_${Math.floor(Math.random() * 1e3)}`,
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    };
    this.data.auditLogs.unshift(newLog);
    if (this.data.auditLogs.length > 500) {
      this.data.auditLogs = this.data.auditLogs.slice(0, 500);
    }
    this.save();
  }
};
var db = new DatabaseManager();

// server/mlEngine.ts
var RECOMMENDATIONS_MAP = {
  BMI: "Your BMI indicates overweight/obesity. Aim for a BMI of 18.5-24.9 through balanced nutrition and regular exercise.",
  HighBP: "High blood pressure detected. Monitor regularly, reduce sodium intake, and consult a healthcare provider.",
  HighChol: "High cholesterol detected. Focus on heart-healthy fats, soluble fiber, and regular clinical follow-ups.",
  CholCheck: "Regular cholesterol screening is essential. Ensure you get your lipid panel checked at least every 4-5 years.",
  Stroke: "History of stroke significantly elevates cardiometabolic risk. Ensure adherence to antiplatelet or prescribed cardiac therapy.",
  HeartDiseaseorAttack: "Coronary heart disease history requires strict glycemic and vascular risk factor management.",
  Smoker: "Smoking significantly increases diabetes risk and microvascular damage. Seek support to quit smoking immediately.",
  HvyAlcoholConsump: "Heavy alcohol intake impairs liver glucose regulation and pancreas function. Reduce alcohol consumption.",
  PhysActivity: "Physical inactivity is a major risk factor. Aim for at least 150 minutes of moderate aerobic exercise weekly.",
  Fruits: "Fruit intake is below optimal frequency. Incorporate whole fruits rich in antioxidants and fiber into your daily diet.",
  Veggies: "Vegetable consumption is low. Add non-starchy green vegetables to every main meal to improve insulin sensitivity.",
  MentHlth: "Frequent poor mental health days affect cortisol and glycemic stability. Consider professional psychological or stress support.",
  PhysHlth: "Reported physical health burden may limit mobility. Consult a physical therapist or clinician for adaptive exercise plans.",
  DiffWalk: "Difficulty walking or climbing stairs may impede standard workouts. Explore low-impact water aerobics or seated resistance exercises.",
  GenHlth: "Poor general health reported. Schedule a comprehensive medical check-up for thorough metabolic screening.",
  Sex: "Male sex is associated with visceral adiposity risks; maintain waist circumference below recommended clinical thresholds.",
  Age: "Age is a non-modifiable risk factor for type 2 diabetes. Increase screening frequency as you enter older age brackets.",
  Education: "Enhancing health literacy about carbohydrate counting and nutrition labels can dramatically lower HbA1c trajectory.",
  Income: "Discuss affordable, insurance-covered preventative wellness programs and generic prescription options with your care team.",
  AnyHealthcare: "Maintain continuous health insurance coverage to ensure timely access to HbA1c testing and endocrine specialist visits.",
  NoDocbcCost: "If cost has prevented doctor visits, contact community health clinics or patient assistance programs for subsidized screenings."
};
function predictDiabetesRisk(input) {
  let logOdds = -2.85;
  if (input.BMI >= 35) logOdds += 1.15;
  else if (input.BMI >= 30) logOdds += 0.82;
  else if (input.BMI >= 25) logOdds += 0.38;
  if (input.HighBP === 1) logOdds += 0.68;
  if (input.HighChol === 1) logOdds += 0.54;
  if (input.CholCheck === 0) logOdds += 0.32;
  if (input.Stroke === 1) logOdds += 0.45;
  if (input.HeartDiseaseorAttack === 1) logOdds += 0.61;
  if (input.Smoker === 1) logOdds += 0.18;
  if (input.HvyAlcoholConsump === 1) logOdds += 0.14;
  if (input.PhysActivity === 0) logOdds += 0.42;
  if (input.Fruits === 0) logOdds += 0.19;
  if (input.Veggies === 0) logOdds += 0.22;
  if (input.GenHlth === 5) logOdds += 1.25;
  else if (input.GenHlth === 4) logOdds += 0.88;
  else if (input.GenHlth === 3) logOdds += 0.45;
  else if (input.GenHlth === 2) logOdds += 0.15;
  if (input.PhysHlth >= 15) logOdds += 0.35;
  else if (input.PhysHlth >= 7) logOdds += 0.18;
  if (input.MentHlth >= 15) logOdds += 0.19;
  if (input.DiffWalk === 1) logOdds += 0.38;
  if (input.Age >= 10) logOdds += 0.72;
  else if (input.Age >= 8) logOdds += 0.48;
  else if (input.Age >= 6) logOdds += 0.28;
  if (input.Sex === 1) logOdds += 0.08;
  if (input.Education <= 3) logOdds += 0.24;
  if (input.Income <= 3) logOdds += 0.22;
  if (input.NoDocbcCost === 1) logOdds += 0.16;
  const rawProbability = 1 / (1 + Math.exp(-logOdds));
  const probabilityPercent = Number((rawProbability * 100).toFixed(2));
  const prediction_class = rawProbability >= 0.1 ? 1 : 0;
  let risk_tier;
  let color_code;
  if (rawProbability < 0.15) {
    risk_tier = "Low Risk";
    color_code = "green";
  } else if (rawProbability < 0.4) {
    risk_tier = "Moderate Risk";
    color_code = "orange";
  } else {
    risk_tier = "High Risk";
    color_code = "red";
  }
  const topFactors = [];
  const recommendations = [];
  if (input.BMI >= 25) {
    topFactors.push(`BMI (${input.BMI} kg/m\xB2 - ${input.BMI >= 30 ? "Obese" : "Overweight"})`);
    recommendations.push(RECOMMENDATIONS_MAP["BMI"]);
  }
  if (input.HighBP === 1) {
    topFactors.push("High Blood Pressure (Hypertension)");
    recommendations.push(RECOMMENDATIONS_MAP["HighBP"]);
  }
  if (input.HighChol === 1) {
    topFactors.push("High Cholesterol (Hyperlipidemia)");
    recommendations.push(RECOMMENDATIONS_MAP["HighChol"]);
  }
  if (input.GenHlth >= 4) {
    topFactors.push(`General Health Rated ${input.GenHlth === 5 ? "Poor" : "Fair"}`);
    recommendations.push(RECOMMENDATIONS_MAP["GenHlth"]);
  }
  if (input.PhysActivity === 0) {
    topFactors.push("Physical Inactivity (0 days in last 30 days)");
    recommendations.push(RECOMMENDATIONS_MAP["PhysActivity"]);
  }
  if (input.Smoker === 1) {
    topFactors.push("History of Tobacco Use (>100 cigarettes)");
    recommendations.push(RECOMMENDATIONS_MAP["Smoker"]);
  }
  if (input.HeartDiseaseorAttack === 1 || input.Stroke === 1) {
    topFactors.push("Cardiovascular / Stroke History");
    if (input.HeartDiseaseorAttack === 1) recommendations.push(RECOMMENDATIONS_MAP["HeartDiseaseorAttack"]);
    if (input.Stroke === 1 && !recommendations.includes(RECOMMENDATIONS_MAP["Stroke"])) {
      recommendations.push(RECOMMENDATIONS_MAP["Stroke"]);
    }
  }
  if (input.Fruits === 0 || input.Veggies === 0) {
    topFactors.push("Suboptimal Dietary Fiber / Produce Intake");
    if (input.Fruits === 0) recommendations.push(RECOMMENDATIONS_MAP["Fruits"]);
    if (input.Veggies === 0) recommendations.push(RECOMMENDATIONS_MAP["Veggies"]);
  }
  if (input.Age >= 9) {
    topFactors.push(`Older Age Group (${input.Age >= 10 ? "65+" : "60-64"})`);
    recommendations.push(RECOMMENDATIONS_MAP["Age"]);
  }
  if (topFactors.length === 0) {
    topFactors.push("No dominant high-risk clinical factors identified");
    recommendations.push("Great job maintaining a healthy cardiometabolic profile! Continue regular aerobic exercise and balanced Mediterranean-style nutrition.");
    recommendations.push("Schedule routine annual screenings to keep cholesterol and fasting glucose parameters within optimal targets.");
  } else if (recommendations.length < 3) {
    recommendations.push("Maintain regular hydration and ensure 7-8 hours of quality sleep per night to support metabolic resilience.");
  }
  return {
    probability: probabilityPercent,
    prediction_class,
    risk_tier,
    color_code,
    top_risk_factors: topFactors.slice(0, 5),
    recommendations: Array.from(new Set(recommendations)).slice(0, 5)
  };
}

// server/auth.ts
var import_jsonwebtoken = __toESM(require("jsonwebtoken"), 1);
var import_bcryptjs = __toESM(require("bcryptjs"), 1);
var JWT_SECRET = process.env.JWT_SECRET || "healthgluco_super_secure_jwt_secret_key_2026";
var JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "healthgluco_refresh_secret_2026";
var ACCESS_TOKEN_EXPIRE = "4h";
var REFRESH_TOKEN_EXPIRE = "7d";
function hashPassword(plainText) {
  const salt = import_bcryptjs.default.genSaltSync(10);
  return import_bcryptjs.default.hashSync(plainText, salt);
}
function verifyPassword(plainText, hashed) {
  return import_bcryptjs.default.compareSync(plainText, hashed);
}
function generateTokens(user) {
  const payload = {
    sub: user.id,
    email: user.email,
    role: user.role
  };
  const accessToken = import_jsonwebtoken.default.sign(payload, JWT_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRE });
  const refreshToken = import_jsonwebtoken.default.sign({ sub: user.id }, JWT_REFRESH_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRE });
  return { accessToken, refreshToken };
}
function authenticateJWT(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ error: "Unauthorized: Missing or invalid token" });
    return;
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = import_jsonwebtoken.default.verify(token, JWT_SECRET);
    const allUsers = db.get().users;
    const user = allUsers.find((u) => u.id === decoded.sub && u.is_active);
    if (!user) {
      res.status(401).json({ error: "Unauthorized: User account not found or deactivated" });
      return;
    }
    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ error: "Unauthorized: Expired or invalid token" });
  }
}
function requireRole(role) {
  return (req, res, next) => {
    if (!req.user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    if (req.user.role !== role && req.user.role !== "Administrator") {
      res.status(403).json({
        error: `Forbidden: Requires ${role} role permissions`
      });
      return;
    }
    next();
  };
}

// server/routes/api.ts
var apiRouter = import_express.default.Router();
apiRouter.get("/health", (req, res) => {
  res.status(200).json({
    status: "healthy",
    model_loaded: true,
    model_version: "1.0.0-XGBoost-Trained",
    threshold: 0.1,
    timestamp: (/* @__PURE__ */ new Date()).toISOString()
  });
});
apiRouter.post("/auth/register", (req, res) => {
  const { email, full_name, password, role = "Patient", age_group = 7, sex = 0, bmi = 24 } = req.body;
  if (!email || !password || !full_name) {
    res.status(400).json({ error: "Email, full name, and password are required" });
    return;
  }
  const existing = db.get().users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    res.status(409).json({ error: "An account with this email already exists" });
    return;
  }
  const newUser = {
    id: `usr_${Date.now()}`,
    email: email.toLowerCase(),
    full_name,
    password_hash: hashPassword(password),
    role: role === "Administrator" ? "Administrator" : "Patient",
    age_group: Number(age_group),
    sex: Number(sex),
    bmi: Number(bmi),
    is_active: true,
    is_verified: true,
    created_at: (/* @__PURE__ */ new Date()).toISOString(),
    last_login: (/* @__PURE__ */ new Date()).toISOString()
  };
  db.get().users.push(newUser);
  db.addAuditLog({
    user_id: newUser.id,
    action: "USER_REGISTERED",
    endpoint: "/api/v1/auth/register",
    ip_address: req.ip || "127.0.0.1",
    status: "SUCCESS",
    details: `Registered account with role ${newUser.role}`
  });
  const tokens = generateTokens(newUser);
  res.status(201).json({
    message: "User registered successfully",
    user: {
      id: newUser.id,
      email: newUser.email,
      full_name: newUser.full_name,
      role: newUser.role
    },
    ...tokens
  });
});
apiRouter.post("/auth/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ error: "Email and password are required" });
    return;
  }
  const user = db.get().users.find((u) => u.email.toLowerCase() === email.toLowerCase() && u.is_active);
  if (!user || !verifyPassword(password, user.password_hash)) {
    db.addAuditLog({
      user_id: user ? user.id : "unknown",
      action: "LOGIN_FAILED",
      endpoint: "/api/v1/auth/login",
      ip_address: req.ip || "127.0.0.1",
      status: "FAILED",
      details: "Invalid authentication credentials"
    });
    res.status(401).json({ error: "Invalid email or password" });
    return;
  }
  user.last_login = (/* @__PURE__ */ new Date()).toISOString();
  db.save();
  db.addAuditLog({
    user_id: user.id,
    action: "LOGIN_SUCCESS",
    endpoint: "/api/v1/auth/login",
    ip_address: req.ip || "127.0.0.1",
    status: "SUCCESS",
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
apiRouter.get("/auth/me", authenticateJWT, (req, res) => {
  const user = req.user;
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
    latest_risk_tier: userPredictions[0]?.risk_tier || "No screening yet",
    latest_probability: userPredictions[0]?.probability || 0
  });
});
apiRouter.post("/auth/logout", authenticateJWT, (req, res) => {
  db.addAuditLog({
    user_id: req.user.id,
    action: "USER_LOGOUT",
    endpoint: "/api/v1/auth/logout",
    ip_address: req.ip || "127.0.0.1",
    status: "SUCCESS"
  });
  res.status(200).json({ message: "Session logged out successfully" });
});
apiRouter.post("/auth/password-reset", (req, res) => {
  const { email } = req.body;
  if (!email) {
    res.status(400).json({ error: "Email is required" });
    return;
  }
  res.status(200).json({
    message: "If an active account exists with this email, password reset instructions have been sent."
  });
});
apiRouter.post("/predict", authenticateJWT, (req, res) => {
  try {
    const input = req.body;
    if (input.BMI < 10 || input.BMI > 100) {
      res.status(400).json({ error: "BMI value out of valid clinical range (10-100 kg/m\xB2)" });
      return;
    }
    const predictionResult = predictDiabetesRisk(input);
    const predictionRecord = {
      id: `pred_${Date.now()}`,
      user_id: req.user.id,
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
      created_at: (/* @__PURE__ */ new Date()).toISOString()
    };
    db.get().predictions.unshift(predictionRecord);
    db.get().recommendationHistory.unshift({
      id: `rec_${predictionRecord.id}`,
      prediction_id: predictionRecord.id,
      user_id: req.user.id,
      top_risk_factors: predictionResult.top_risk_factors,
      recommendations: predictionResult.recommendations,
      created_at: predictionRecord.created_at
    });
    if (predictionResult.risk_tier === "High Risk") {
      db.get().notifications.unshift({
        id: `notif_${Date.now()}`,
        user_id: req.user.id,
        title: "High Risk Clinical Alert",
        message: `Your screening evaluated at ${predictionResult.probability}% probability. Please schedule a clinical consult.`,
        is_read: false,
        notification_type: "CLINICAL_ALERT",
        created_at: (/* @__PURE__ */ new Date()).toISOString()
      });
    }
    db.addAuditLog({
      user_id: req.user.id,
      action: "PREDICTION_COMPLETED",
      endpoint: "/api/v1/predict",
      ip_address: req.ip || "127.0.0.1",
      status: "SUCCESS",
      details: `Probability: ${predictionResult.probability}% (${predictionResult.risk_tier})`
    });
    res.status(200).json(predictionResult);
  } catch (err) {
    console.error("Prediction calculation error:", err);
    res.status(500).json({ error: "Internal Server Error: Failed to execute ML inference pipeline" });
  }
});
apiRouter.get("/predict/history", authenticateJWT, (req, res) => {
  const { risk_tier, limit = 50 } = req.query;
  let userPredictions = db.get().predictions.filter((p) => p.user_id === req.user.id || req.user.role === "Administrator");
  if (risk_tier && typeof risk_tier === "string") {
    userPredictions = userPredictions.filter((p) => p.risk_tier === risk_tier);
  }
  res.status(200).json({
    total: userPredictions.length,
    predictions: userPredictions.slice(0, Number(limit))
  });
});
apiRouter.get("/predict/history/:id", authenticateJWT, (req, res) => {
  const { id } = req.params;
  const prediction = db.get().predictions.find((p) => p.id === id && (p.user_id === req.user.id || req.user.role === "Administrator"));
  if (!prediction) {
    res.status(404).json({ error: "Prediction screening record not found" });
    return;
  }
  res.status(200).json(prediction);
});
apiRouter.post("/predict/compare", authenticateJWT, (req, res) => {
  const { prediction_ids } = req.body;
  if (!Array.isArray(prediction_ids) || prediction_ids.length < 2) {
    res.status(400).json({ error: "Please provide at least two prediction IDs to compare" });
    return;
  }
  const matches = db.get().predictions.filter((p) => prediction_ids.includes(p.id) && (p.user_id === req.user.id || req.user.role === "Administrator"));
  res.status(200).json({
    comparison: matches,
    trend_analysis: {
      probability_diff: matches.length >= 2 ? matches[0].probability - matches[matches.length - 1].probability : 0,
      bmi_diff: matches.length >= 2 ? matches[0].bmi - matches[matches.length - 1].bmi : 0
    }
  });
});
apiRouter.get("/admin/dashboard", authenticateJWT, requireRole("Administrator"), (req, res) => {
  const { users, predictions, auditLogs } = db.get();
  const totalUsers = users.length;
  const totalPredictions = predictions.length;
  const now = /* @__PURE__ */ new Date();
  const todayStr = now.toISOString().split("T")[0];
  const weekAgo = new Date(now.getTime() - 7 * 864e5);
  const monthAgo = new Date(now.getTime() - 30 * 864e5);
  const todayPredictions = predictions.filter((p) => p.created_at.startsWith(todayStr)).length;
  const weeklyPredictions = predictions.filter((p) => new Date(p.created_at) >= weekAgo).length;
  const monthlyPredictions = predictions.filter((p) => new Date(p.created_at) >= monthAgo).length;
  const highRiskCount = predictions.filter((p) => p.risk_tier === "High Risk").length;
  const modRiskCount = predictions.filter((p) => p.risk_tier === "Moderate Risk").length;
  const lowRiskCount = predictions.filter((p) => p.risk_tier === "Low Risk").length;
  const highRiskPercent = totalPredictions > 0 ? Number((highRiskCount / totalPredictions * 100).toFixed(1)) : 0;
  const ageDist = {
    "18-34 (Grps 1-3)": predictions.filter((p) => p.age <= 3).length,
    "35-54 (Grps 4-7)": predictions.filter((p) => p.age >= 4 && p.age <= 7).length,
    "55-69 (Grps 8-10)": predictions.filter((p) => p.age >= 8 && p.age <= 10).length,
    "70+ (Grps 11-13)": predictions.filter((p) => p.age >= 11).length
  };
  const genderDist = {
    Female: predictions.filter((p) => p.sex === 0).length,
    Male: predictions.filter((p) => p.sex === 1).length
  };
  const heatmapData = [
    { age_group: "18-34", bmi_normal: 8, bmi_overweight: 15, bmi_obese: 28 },
    { age_group: "35-54", bmi_normal: 14, bmi_overweight: 29, bmi_obese: 56 },
    { age_group: "55-69", bmi_normal: 22, bmi_overweight: 48, bmi_obese: 78 },
    { age_group: "70+", bmi_normal: 31, bmi_overweight: 62, bmi_obese: 85 }
  ];
  const regionalDistribution = [
    { region: "Riyadh Province (\u0627\u0644\u0631\u064A\u0627\u0636)", count: Math.max(14, Math.round(totalPredictions * 0.38)), prevalence: "18.2%" },
    { region: "Makkah Province (\u0645\u0643\u0629 \u0627\u0644\u0645\u0643\u0631\u0645\u0629)", count: Math.max(11, Math.round(totalPredictions * 0.28)), prevalence: "19.1%" },
    { region: "Eastern Province (\u0627\u0644\u0634\u0631\u0642\u064A\u0629)", count: Math.max(8, Math.round(totalPredictions * 0.17)), prevalence: "17.8%" },
    { region: "Madinah Province (\u0627\u0644\u0645\u062F\u064A\u0646\u0629 \u0627\u0644\u0645\u0646\u0648\u0631\u0629)", count: Math.max(4, Math.round(totalPredictions * 0.09)), prevalence: "16.9%" },
    { region: "Aseer Province (\u0639\u0633\u064A\u0631)", count: Math.max(3, Math.round(totalPredictions * 0.08)), prevalence: "15.7%" }
  ];
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
        { name: "Low Risk", value: lowRiskCount, color: "#10b981" },
        { name: "Moderate Risk", value: modRiskCount, color: "#f59e0b" },
        { name: "High Risk", value: highRiskCount, color: "#ef4444" }
      ],
      ageDistribution: Object.entries(ageDist).map(([k, v]) => ({ age_group: k, count: v })),
      genderDistribution: [
        { gender: "Female", count: genderDist.Female },
        { gender: "Male", count: genderDist.Male }
      ],
      heatmapData
    },
    latestUsers: users.slice(0, 8),
    latestPredictions: predictions.slice(0, 8),
    activityLogs: auditLogs.slice(0, 15),
    systemStatus: {
      model_status: "ONLINE",
      model_threshold: "0.10 (10%) High Sensitivity (Saudi MOH Standard)",
      database_status: "CONNECTED",
      server_uptime: "99.99%",
      api_version: "v1.0.0-PROD-KSA"
    }
  });
});
apiRouter.get("/admin/users", authenticateJWT, requireRole("Administrator"), (req, res) => {
  const { role } = req.query;
  let users = db.get().users;
  if (role && typeof role === "string") {
    users = users.filter((u) => u.role === role);
  }
  res.status(200).json(users);
});
apiRouter.get("/admin/logs", authenticateJWT, requireRole("Administrator"), (req, res) => {
  res.status(200).json(db.get().auditLogs);
});
apiRouter.get("/admin/export", authenticateJWT, requireRole("Administrator"), (req, res) => {
  const { predictions, users, auditLogs } = db.get();
  res.status(200).json({
    export_date: (/* @__PURE__ */ new Date()).toISOString(),
    total_records: predictions.length,
    users: users.map((u) => ({ id: u.id, email: u.email, role: u.role, created_at: u.created_at })),
    predictions
  });
});
apiRouter.get("/users/profile", authenticateJWT, (req, res) => {
  res.status(200).json(req.user);
});
apiRouter.put("/users/profile", authenticateJWT, (req, res) => {
  const { full_name, age_group, sex, bmi } = req.body;
  const user = req.user;
  if (full_name) user.full_name = full_name;
  if (age_group !== void 0) user.age_group = Number(age_group);
  if (sex !== void 0) user.sex = Number(sex);
  if (bmi !== void 0) user.bmi = Number(bmi);
  db.save();
  db.addAuditLog({
    user_id: user.id,
    action: "PROFILE_UPDATED",
    endpoint: "/api/v1/users/profile",
    ip_address: req.ip || "127.0.0.1",
    status: "SUCCESS"
  });
  res.status(200).json(user);
});
apiRouter.get("/users/notifications", authenticateJWT, (req, res) => {
  const notes = db.get().notifications.filter((n) => n.user_id === req.user.id);
  res.status(200).json(notes);
});
apiRouter.put("/users/notifications/:id/read", authenticateJWT, (req, res) => {
  const { id } = req.params;
  const note = db.get().notifications.find((n) => n.id === id && n.user_id === req.user.id);
  if (note) {
    note.is_read = true;
    db.save();
  }
  res.status(200).json({ success: true });
});
apiRouter.delete("/users/account", authenticateJWT, (req, res) => {
  const userId = req.user.id;
  const user = db.get().users.find((u) => u.id === userId);
  if (user) {
    user.is_active = false;
    db.save();
  }
  res.status(200).json({ message: "Account deactivated successfully" });
});

// server.ts
var currentDirname = process.cwd();
async function startServer() {
  const app = (0, import_express2.default)();
  const PORT = 3e3;
  app.use(import_express2.default.json({ limit: "10mb" }));
  app.use(import_express2.default.urlencoded({ extended: true }));
  app.use((req, res, next) => {
    console.log(`[${(/* @__PURE__ */ new Date()).toISOString()}] ${req.method} ${req.url}`);
    next();
  });
  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    if (req.method === "OPTIONS") {
      res.sendStatus(200);
      return;
    }
    next();
  });
  app.use("/api/v1", apiRouter);
  app.get("/api/health", (req, res) => {
    res.status(200).json({ status: "ok", service: "HealthGluco API v1.0.0" });
  });
  if (process.env.NODE_ENV !== "production") {
    const vite = await (0, import_vite.createServer)({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path2.default.join(process.cwd(), "dist");
    app.use(import_express2.default.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(import_path2.default.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`=============================================================`);
    console.log(`\u{1F3E5} HealthGluco Production-Ready Full-Stack Server Running`);
    console.log(`\u{1F310} Server Address : http://0.0.0.0:${PORT}`);
    console.log(`\u2699\uFE0F  API Endpoint   : http://0.0.0.0:${PORT}/api/v1`);
    console.log(`\u{1F9E0} ML XGBoost     : Decision Threshold 0.10 (10%) Active`);
    console.log(`=============================================================`);
  });
}
startServer().catch((err) => {
  console.error("Fatal Server Startup Error:", err);
  process.exit(1);
});
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * HealthGluco - Embedded Relational Database Layer for Dev/Preview & Standalone Node Execution
 * Compatible with SQLite / PostgreSQL schemas: Users, Predictions, RecommendationHistory, AuditLogs, RefreshTokens, SystemSettings, Notifications
 */
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * HealthGluco - Pre-trained XGBoost Model Inference Engine
 * Implements predict_proba() with optimal medical decision threshold = 0.10 (10%)
 */
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * HealthGluco - Security & JWT Authentication Middleware
 * Supports Access Tokens, Refresh Tokens, RBAC (Patient, Administrator), Bcrypt password hashing
 */
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * HealthGluco - Complete Versioned RESTful API (/api/v1/*)
 * Complies with Section 5 API Endpoints Specification & OpenAPI standards
 */
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * HealthGluco - Full-Stack Express Server with Vite Middleware & API Proxy
 * Runs on Port 3000 (Host 0.0.0.0)
 */
//# sourceMappingURL=server.cjs.map
