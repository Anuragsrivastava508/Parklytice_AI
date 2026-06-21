# 🚦 Parklytics AI

## Illegal Parking Hotspot Intelligence & Enforcement Optimization Platform

Parklytics AI is a **Smart City Intelligence Platform** designed to transform raw parking violation records into actionable enforcement insights using **Artificial Intelligence**, **Geospatial Analytics**, and **Data-Driven Decision Making**.

Instead of simply displaying violations, the platform:
- ✅ Detects illegal parking hotspots
- ✅ Identifies recurring violation patterns
- ✅ Estimates congestion impact
- ✅ Generates explainable risk scores
- ✅ Recommends enforcement actions
- ✅ Provides operational dashboards for traffic authorities

---

## 🎯 Problem Statement

Illegal parking is one of the leading contributors to:
- Urban traffic congestion
- Emergency response delays
- Reduced road capacity
- Increased travel time
- Inefficient traffic enforcement

Current enforcement systems are largely reactive and depend heavily on manual patrolling.

**Parklytics AI enables authorities to:**
- ✅ Identify high-risk locations
- ✅ Understand violation trends
- ✅ Measure congestion impact
- ✅ Prioritize enforcement resources
- ✅ Shift from reactive to predictive enforcement

---

## ✨ Key Features

### 📍 AI-Powered Hotspot Detection
- Geospatial clustering using DBSCAN
- Illegal parking hotspot discovery
- Hotspot ranking and prioritization
- Spatial intelligence visualization

### 📊 Advanced Analytics Dashboard
- Daily violation trends
- Peak violation hours
- Vehicle type analysis
- Police station workload insights
- Zone-wise violation distribution

### ⚠️ Explainable Risk Scoring Engine
Risk scores are generated using:
- Violation density
- Repeat offender frequency
- Offence severity
- Peak-hour occurrence
- Enforcement delays
- Location sensitivity

Each hotspot receives an interpretable score for easy decision-making.

### 🚗 Congestion Impact Estimation
The system estimates congestion severity using:
- Violation frequency
- Vehicle obstruction weight
- Peak-hour density
- Hotspot recurrence
- Violation duration

### 🎯 Enforcement Recommendation Engine
Provides intelligent recommendations such as:
- Routine Patrol Deployment
- Peak-Hour Enforcement
- Tow-Away Zones
- Camera Surveillance
- Signage Improvements
- Repeat Offender Monitoring

### 🗺️ Interactive Geospatial Dashboard
Features:
- Hotspot visualization
- Heatmaps
- Risk-based color coding
- Junction-level insights
- Congestion overlays

---

## 🏗️ System Architecture
```text
Parking Violation Dataset
           │
           ▼
Data Cleaning & Validation
           │
           ▼
Feature Engineering
           │
           ▼
DBSCAN Hotspot Detection
           │
           ▼
Risk Scoring Engine
           │
           ▼
Congestion Impact Engine
           │
           ▼
Recommendation Engine
           │
           ▼
FastAPI Backend
           │
           ▼
Next.js 15 Frontend
           │
           ▼
Interactive Dashboard
```

---

## 🛠️ Tech Stack

### Frontend
- Next.js 15
- React
- JavaScript
- Tailwind CSS
- shadcn/ui
- React Leaflet
- Recharts

### Backend
- FastAPI
- Python

### Database
- MySQL

### Data Analytics
- Pandas
- NumPy
- Scikit-Learn

### Geospatial Intelligence
- DBSCAN
- GeoPandas
- Leaflet
- Folium

---

## 📂 Project Structure
```text
Parklytics-AI/
│
├── backend/
│   ├── app/
│   ├── preprocess.py
│   ├── feature_engineering.py
│   ├── hotspot_detection.py
│   ├── risk_engine.py
│   ├── congestion_engine.py
│   ├── recommendation_engine.py
│   ├── seed_db.py
│   └── requirements.txt
│
├── frontend/
│   ├── app/
│   ├── components/
│   ├── services/
│   ├── public/
│   └── package.json
│
└── README.md
```

---

## 🚀 Installation & Setup

### Prerequisites

Install the following:
- Python 3.10+
- Node.js 18+
- MySQL Server
- Git

### 🔧 Backend Setup (Terminal 1)

1. Navigate to backend directory:
```bash
cd backend
```

2. Install Python Dependencies:
```bash
pip install -r requirements.txt
```

3. Initialize Database:
```bash
python seed_db.py
```

4. Start FastAPI Server:
```bash
python -m uvicorn app.main:app --reload --port 9000
```

**Backend Running At:** `http://localhost:9000`

**FastAPI Documentation:** `http://localhost:9000/docs`

### 💻 Frontend Setup (Terminal 2)

1. Open a new terminal and navigate to frontend directory:
```bash
cd frontend
```

2. Install Dependencies:
```bash
npm install --legacy-peer-deps
```

3. Start Next.js 15 Application:
```bash
npm run dev
```

**Frontend Running At:** `http://localhost:3000`

---

## ▶️ Running the Complete Application

**Terminal 1:**
```bash
cd backend
pip install -r requirements.txt
python seed_db.py
python -m uvicorn app.main:app --reload --port 9000
```

**Terminal 2:**
```bash
cd frontend
npm install --legacy-peer-deps
npm run dev
```

---

## 🌐 Application Flow
```text
MySQL Database
       │
       ▼
 FastAPI Backend
       │
       ▼
 REST APIs
       │
       ▼
 Next.js 15 Frontend
       │
       ▼
 Interactive Dashboard
```

## 📊 Core Modules

| Module | Description |
|--------|-------------|
| **Hotspot Detection** | Detects parking violation clusters using DBSCAN |
| **Risk Assessment** | Calculates explainable hotspot risk scores |
| **Congestion Analysis** | Measures impact of parking violations on traffic flow |
| **Recommendation Engine** | Suggests targeted enforcement strategies |
| **Dashboard Analytics** | Provides operational intelligence to authorities |

---

## 🔥 Use Cases

- Smart City Monitoring
- Urban Mobility Planning
- Traffic Enforcement Optimization
- Congestion Reduction
- Parking Policy Evaluation
- Resource Allocation Planning

---

## 🛠 Troubleshooting

### Backend Not Starting
Verify Python packages:
```bash
pip install -r requirements.txt
```

### Frontend Build Errors
Delete dependencies and reinstall:
```bash
rm -rf node_modules
npm install --legacy-peer-deps
```

### Port Already In Use
Run FastAPI on another port:
```bash
python -m uvicorn app.main:app --reload --port 9001
```

### API Connection Issues
Verify backend is accessible:
http://localhost:9000/docs

text

If Swagger UI opens successfully, the backend is running correctly.

---

## 📈 Future Scope

- Real-Time CCTV Integration
- Live Traffic Feed Integration
- AI-Based Congestion Prediction
- Predictive Hotspot Forecasting
- Smart Patrol Route Optimization
- Mobile Enforcement Application
- Digital Tow-Away Management

---

## 🔗 Live Deployment

**Live Website on Vercel:**  
🌐 [https://parklytice-ailive.vercel.app/](https://parklytice-ailive.vercel.app/)

---

## 👥 Team

- Anurag Srivastava
- Satvik Gupta
- Nupur Madaan
- Pritam

---

## 🏆 Impact

### Before Parklytics AI
- ❌ Reactive Enforcement
- ❌ Manual Monitoring
- ❌ Delayed Responses
- ❌ Resource Wastage

### After Parklytics AI
- ✅ Predictive Enforcement
- ✅ AI-Powered Insights
- ✅ Proactive Decision Making
- ✅ Efficient Resource Allocation

---

## 🚦 Transforming Raw Parking Violations into Actionable Urban Intelligence

**Parklytics AI — Smarter Parking Analytics for Smarter Cities**
