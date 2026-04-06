#!/bin/bash
# scripts/setup.sh
# Complete setup script for MedTriage-Env

set -e

echo "🏥 MedTriage-Env Setup Script"
echo "============================"

# Backend Setup
echo ""
echo "1️⃣  Setting up Backend..."
cd tasks

# Check if venv exists
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python -m venv venv
fi

# Activate venv
source venv/bin/activate 2>/dev/null || . venv/Scripts/activate 2>/dev/null

# Install dependencies
echo "Installing Python dependencies..."
pip install --upgrade pip
pip install -r requirements.txt

# Setup .env
if [ ! -f ".env" ]; then
    echo "Creating .env file from template..."
    cp .env.example .env
    echo "⚠️  Please edit tasks/.env and add your OpenAI API key"
fi

cd ..

# Frontend Setup
echo ""
echo "2️⃣  Setting up Frontend..."
cd frontend

if [ ! -d "node_modules" ]; then
    echo "Installing Node dependencies..."
    npm install
fi

if [ ! -f ".env.local" ]; then
    echo "Creating .env.local..."
    echo "NEXT_PUBLIC_API_URL=http://localhost:8000" > .env.local
fi

cd ..

echo ""
echo "✅ Setup complete!"
echo ""
echo "📚 Next steps:"
echo "1. Edit tasks/.env and add your OpenAI API key"
echo "2. Run: npm run dev:backend (in one terminal)"
echo "3. Run: npm run dev:frontend (in another terminal)"
echo "4. Open http://localhost:3000 in your browser"
