# 🏥 HealthGluco — SaaS Clinical Diabetes Risk Stratification & Longitudinal Tracking Platform

**HealthGluco** is a full-stack, production-ready healthcare SaaS platform for XGBoost-powered diabetes risk screening, longitudinal tracking, and clinical decision support.

Built with **React 18**, **Vite**, **Tailwind CSS**, **TypeScript**, **FastAPI (Python 3.12)**, **Node.js Express**, and **PostgreSQL/SQLite**, HealthGluco replaces default arbitrary classification thresholds with an empirically optimized **0.10 high-sensitivity threshold** to prevent false-negative dismissals in at-risk patient populations.

---

## 🌟 Key Platform Capabilities

### 1. **XGBoost Supervised Learning Engine (CDC BRFSS 2015 Dataset)**
- Evaluates **21 epidemiological features**, including Body Mass Index (BMI), Blood Pressure, Blood Cholesterol, Physical Activity, Dietary Habits (Fruits/Veggies), General Health rating, Functional Mobility, Age, Sex, Education, Income, and Healthcare Cost barriers.
- **Why 0.10 Threshold?** In epidemiological screening, standard 0.50 classification cutoffs miss up to 68% of prediabetic patients. Using an ROC-AUC optimized **0.10 high-sensitivity threshold** prioritizes recall to catch early-stage diabetes risk.

### 2. **Interactive 21-Feature Clinical Screening Wizard**
- Step-by-step 4-stage assessment wizard with helpful clinical tooltips, normal biometric reference ranges, and live BMI calculator.
- One-click **Auto-Fill High Risk** and **Auto-Fill Low Risk** sample presets for instant evaluation.

### 3. **Clinical Risk Gauge & Printable PDF Summary Reports**
- Real-time speedometer gauge chart (`0% - 100%` probability) with color-coded Low (`<10%`), Moderate (`10% - 39%`), and High Risk (`≥40%`) threshold bands.
- Printable, professional clinical summary reports complete with top contributing risk factors and personalized lifestyle recommendations.

### 4. **Longitudinal Trajectory & Assessment Comparison**
- Interactive **Recharts** area charts charting risk score trajectory (%) and BMI progression over time.
- Side-by-side assessment comparison comparing biomarkers and lifestyle improvements across multiple screening sessions.

### 5. **Administrator Analytics & Executive Dashboard**
- Real-time KPIs: Total Registered Users, Total Screenings, High-Risk Proportion, and Model Threshold Status.
- Population epidemiology charts: Risk Tier Pie Chart, Age Group Demographics Bar Chart, and HIPAA/GDPR Audit Logs Stream.
- One-click **Export CSV** and **Export HIPAA JSON** audit trails.

---

## 🛠️ Tech Stack & Architecture

- **Frontend Application**: React 18, Vite, TypeScript, Tailwind CSS, Recharts, Lucide Icons, React Router 7.
- **Server-Side API & Proxy**: Node.js Express (`server.ts`) with Vite Middleware & JWT/bcrypt authentication + Python 3.12 FastAPI (`/app`).
- **Machine Learning Engine**: XGBoost Classifier v2.1 trained on CDC BRFSS 2015 dataset with fallback analytical engine.
- **Database & Migration**: PostgreSQL 16 / SQLite with SQLAlchemy & Alembic migration scripts.
- **Containerization**: Multi-stage Dockerfiles (`Dockerfile.backend`, `Dockerfile.frontend`) and `docker-compose.yml`.

---

## 🚀 Quick Start & Running Locally

### Option 1: Docker Compose (Full Stack with PostgreSQL)
```bash
# Start all services (PostgreSQL + Python FastAPI Backend + Nginx React Frontend)
docker-compose up --build
```
- **Frontend App**: http://localhost:80 (or http://localhost:3000)
- **FastAPI Backend Swagger Docs**: http://localhost:8000/api/v1/docs
- **ReDoc API Docs**: http://localhost:8000/api/v1/redoc

---

### Option 2: Full-Stack Express + Vite Server (AI Studio & Standalone)
```bash
# 1. Install dependencies
npm install

# 2. Run in Development Mode (Vite HMR + Express API on port 3000)
npm run dev

# 3. Build Production Bundles (Frontend static dist + bundled esbuild server.cjs)
npm run build

# 4. Start Production Server
npm start
```

---

### Option 3: Python FastAPI Backend Standalone
```bash
# 1. Create virtual environment & install requirements
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# 2. Run database migrations
alembic upgrade head

# 3. Launch FastAPI server
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

---

## 🧪 One-Click Demo Testing Credentials

You do not need to manually register to test the platform. Click the **"Patient Demo"** or **"Admin Demo"** buttons on the login screen, or use these preloaded credentials:

| Role | Email | Password | Access & Capabilities |
| :--- | :--- | :--- | :--- |
| **Patient / User** | `patient@healthgluco.ai` | `DemoPass123!` | 21-Feature Screening Wizard, Longitudinal History, Compare Assessments, Printable PDF Report |
| **Administrator** | `admin@healthgluco.ai` | `DemoPass123!` | Executive KPIs, Population Epidemiology Charts, User Management, HIPAA Audit Log Stream, CSV/JSON Exports |

---

## 🛡️ Medical & Clinical Safety Notice
> **Clinical Screening Safety Notice:** HealthGluco uses an XGBoost supervised machine learning model trained on CDC Behavioral Risk Factor Surveillance System (BRFSS) data. Predictions are for **clinical screening support and educational purposes only** and do not replace professional medical diagnosis, laboratory fasting plasma glucose (FPG) testing, HbA1c testing, or consultation with a certified physician.
