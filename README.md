# SERAPHINE

![SERAPHINE Logo](frontend/favicon.png)

**SERAPHINE** is a high-end luxury fashion e-commerce platform featuring an elegant, brutalist design aesthetic and a built-in AI concierge.

## 🌟 Live Demo
Experience the platform here:
**[https://seraphine-1095764831391.us-central1.run.app](https://seraphine-1095764831391.us-central1.run.app)**

## 🛠️ Technology Stack
- **Frontend**: Pure HTML, CSS (Vanilla), JavaScript
- **Backend**: Python, FastAPI, Uvicorn
- **Deployment**: Docker, Google Cloud Run

## 🚀 Running Locally

### Prerequisites
- Python 3.10+

### Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/Suma103413/seraphine.git
   cd seraphine
   ```
2. Install dependencies:
   ```bash
   pip install -r backend/requirements.txt
   ```
3. Run the development server:
   ```bash
   uvicorn backend.main:app --reload --port 8000
   ```
4. Open your browser and navigate to `http://localhost:8000`.
