#!/bin/bash

echo "========================================"
echo "  ServeEase - Starting All Services"
echo "========================================"
echo ""

# Check if node_modules exist
if [ ! -d "server/node_modules" ]; then
    echo "[!] Installing backend dependencies..."
    cd server
    npm install
    cd ..
fi

if [ ! -d "client/node_modules" ]; then
    echo "[!] Installing frontend dependencies..."
    cd client
    npm install
    cd ..
fi

echo ""
echo "========================================"
echo "  Starting Services..."
echo "========================================"
echo ""

echo "[1/3] Starting Python ML Service (Port 5001)..."
cd ml-service
python3 app.py &
cd ..
sleep 2

echo "[2/3] Starting Node.js Backend (Port 5000)..."
cd server
npm run dev &
cd ..
sleep 2

echo "[3/3] Starting React Frontend (Port 5173)..."
cd client
npm run dev &
cd ..

echo ""
echo "========================================"
echo "  All Services Started!"
echo "========================================"
echo ""
echo "Frontend:   http://localhost:5173"
echo "Backend:    http://localhost:5000"
echo "ML Service: http://localhost:5001"
echo ""
echo "Press Ctrl+C to stop all services"

wait
