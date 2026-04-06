# QUICK START GUIDE 🚀

## 1️⃣ Clone & Setup

```bash
git clone https://github.com/KashishSingh1213/med-triage.git
cd medtriage-env
```

## 2️⃣ Backend Setup (Python)

```bash
# Navigate to backend
cd tasks

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Setup environment variables
cp .env.example .env
# Edit .env and add your OpenAI API key

# Run backend
python app.py
```

**Backend running on:** http://localhost:8000

## 3️⃣ Frontend Setup (Next.js)

```bash
# Open new terminal, navigate to frontend
cd frontend

# Install dependencies
npm install

# Create environment file
echo "NEXT_PUBLIC_API_URL=http://localhost:8000" > .env.local

# Run frontend
npm run dev
```

**Frontend running on:** http://localhost:3000

## 4️⃣ Access the Application

Open browser and go to: **http://localhost:3000**

You should see the MedTriage dashboard!

## 🐳 Docker Setup (Alternative)

```bash
# Make sure Docker is installed

# From root directory:
OPENAI_API_KEY=your_api_key_here docker-compose up

# Access on http://localhost:3000
```

## 🧪 Test the System

### 1. Go to "New Triage" (or http://localhost:3000/triage)
### 2. Fill in patient data:
   - Name: John Doe
   - Age: 45
   - Symptoms: Select "Chest Pain" + "Shortness of Breath"
   - Vitals: Heart Rate 120, Temp 37.5°C

### 3. Click "Start Triage Assessment"
### 4. View the AI Assessment Results!

## 📊 API Testing

### Health Check
```bash
curl http://localhost:8000/api/health
```

### Create Patient
```bash
curl -X POST http://localhost:8000/api/patients \
  -H "Content-Type: application/json" \
  -d '{
    "id": "test_001",
    "name": "Jane Smith",
    "age": 35,
    "gender": "F",
    "symptoms": ["Fever"],
    "vitals": {
      "heartRate": 90,
      "bloodPressure": "120/80",
      "temperature": 38.5,
      "respiratoryRate": 18
    },
    "medicalHistory": [],
    "allergies": [],
    "currentMedications": [],
    "createdAt": "2026-04-06T10:00:00Z"
  }'
```

## ⚠️ Common Issues

### Backend won't start?
- Check OPENAI_API_KEY is set in .env
- Ensure port 8000 is not in use
- Python version 3.8+ required

### Frontend won't connect to backend?
- Check NEXT_PUBLIC_API_URL in .env.local
- Ensure backend is running on port 8000
- Check CORS is enabled (already is)

### Port conflicts?
```bash
# Kill process on port 8000:
sudo lsof -ti:8000 | xargs kill -9

# Kill process on port 3000:
sudo lsof -ti:3000 | xargs kill -9
```

## 📚 Project Structure

```
backend/
├── app.py              ← Main Flask app
├── models.py           ← Data models
├── triage_engine.py    ← AI triage logic
└── requirements.txt

frontend/
├── src/app/            ← Pages
├── src/components/    ← React components
├── src/lib/           ← Utilities
└── package.json
```

## 🎯 Next Steps

1. ✅ Get system running
2. 📝 Create test patients
3. 🤖 Test AI assessments
4. 💾 Add database (PostgreSQL/MongoDB)
5. 🔐 Add authentication
6. 📊 Build analytics dashboard

## 💡 Tips

- Frontend auto-reloads on code changes
- Backend needs restart for Python changes
- Use Redux or Context API for state management
- Consider adding patient photos/scans

---

**Need help?** Check README.md for full documentation

**Happy coding! 🚀**
