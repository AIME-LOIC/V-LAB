#!/usr/bin/env bash
# Virtual Science Lab - Quick Start Script

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
VENV_DIR="$ROOT_DIR/venv"

echo "⚗️  Virtual Science Lab - Startup Script"
echo "========================================"
echo ""

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3.7+ first."
    exit 1
fi

echo "✅ Python 3 found"
echo ""

# Backend Setup
echo "📦 Setting up Backend..."
cd "$ROOT_DIR"

if [ ! -x "$VENV_DIR/bin/python" ]; then
    echo "Creating virtual environment at: $VENV_DIR"
    python3 -m venv "$VENV_DIR"
fi

echo "Installing Python dependencies into venv..."
"$VENV_DIR/bin/python" -m pip install --upgrade pip >/dev/null
"$VENV_DIR/bin/pip" install -r "$ROOT_DIR/backend/requirements.txt"

echo ""
echo "✅ Backend setup complete!"
echo "📝 Backend is ready on http://localhost:5000"
echo ""

# Frontend Instructions
echo "🎨 Frontend Setup"
echo "======================="
echo ""
echo "Frontend options:"
echo "1) Existing static frontend (no Node.js required)"
echo "2) React frontend (requires Node.js + npm)"
echo ""

echo "🚀 To start the application:"
echo ""
echo "1. In Terminal 1, run the backend:"
echo "   cd \"$ROOT_DIR\""
echo "   \"$VENV_DIR/bin/python\" backend/app.py"
echo ""
echo "2a. (Static) In Terminal 2, start a web server for frontend:"
echo "   cd \"$ROOT_DIR/frontend\""
echo "   python3 -m http.server 8000"
echo ""
echo "2b. (React / Pro UI) In Terminal 2:"
echo "   cd \"$ROOT_DIR/frontend-react\""
echo "   npm run dev"
echo ""
echo "3. Open your browser and go to:"
echo "   Static: http://localhost:8000"
echo "   React:  http://localhost:5173"
echo ""
echo "⚗️  Virtual Science Lab is ready!"
