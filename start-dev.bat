@echo off
echo ========================================
echo Starting Interest Calculator App
echo ========================================
echo.
echo Starting Backend Server...
start "Backend Server" cmd /k "cd server && npm run dev"
timeout /t 3 /nobreak >nul
echo.
echo Starting Frontend...
start "Frontend" cmd /k "cd client && npm run dev"
echo.
echo ========================================
echo Both servers are starting in separate windows
echo Backend: http://localhost:5000
echo Frontend: http://localhost:5173
echo ========================================
