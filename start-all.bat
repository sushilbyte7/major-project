@echo off
echo ========================================
echo   ServeEase - Starting All Services
echo ========================================
echo.

REM Check if node_modules exist
if not exist "server\node_modules\" (
    echo [!] Installing backend dependencies...
    cd server
    call npm install
    cd ..
)

if not exist "client\node_modules\" (
    echo [!] Installing frontend dependencies...
    cd client
    call npm install
    cd ..
)

echo.
echo ========================================
echo   Starting Services...
echo ========================================
echo.
echo [1/3] Starting Python ML Service (Port 5001)...
start "ML Service" cmd /k "cd ml-service && python app.py"
timeout /t 3

echo [2/3] Starting Node.js Backend (Port 5000)...
start "Backend" cmd /k "cd server && npm run dev"
timeout /t 3

echo [3/3] Starting React Frontend (Port 5173)...
start "Frontend" cmd /k "cd client && npm run dev"

echo.
echo ========================================
echo   All Services Started!
echo ========================================
echo.
echo Frontend:  http://localhost:5173
echo Backend:   http://localhost:5000
echo ML Service: http://localhost:5001
echo.
echo Press any key to close this window...
pause >nul
