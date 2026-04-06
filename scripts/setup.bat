@echo off
REM scripts/setup.bat
REM Setup script for Windows

echo.
echo 🏥 MedTriage-Env Setup Script
echo ============================

REM Backend Setup
echo.
echo 1️⃣  Setting up Backend...
cd tasks

if not exist "venv" (
    echo Creating virtual environment...
    python -m venv venv
)

REM Activate venv
call venv\Scripts\activate.bat

REM Install dependencies
echo Installing Python dependencies...
python -m pip install --upgrade pip
pip install -r requirements.txt

REM Setup .env
if not exist ".env" (
    echo Creating .env file from template...
    copy .env.example .env
    echo ⚠️  Please edit tasks\.env and add your OpenAI API key
)

cd ..

REM Frontend Setup
echo.
echo 2️⃣  Setting up Frontend...
cd frontend

if not exist "node_modules" (
    echo Installing Node dependencies...
    call npm install
)

if not exist ".env.local" (
    echo Creating .env.local...
    (
        echo NEXT_PUBLIC_API_URL=http://localhost:8000
    ) > .env.local
)

cd ..

echo.
echo ✅ Setup complete!
echo.
echo 📚 Next steps:
echo 1. Edit tasks\.env and add your OpenAI API key
echo 2. Run backend: cd tasks && python app.py
echo 3. Run frontend: cd frontend && npm run dev
echo 4. Open http://localhost:3000 in your browser
