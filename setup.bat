@echo off
echo ========================================
echo Interest Calculator - Setup Script
echo ========================================
echo.

echo [1/4] Installing Server Dependencies...
cd server
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Server dependency installation failed
    pause
    exit /b 1
)
cd ..
echo.

echo [2/4] Installing Client Dependencies...
cd client
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Client dependency installation failed
    pause
    exit /b 1
)
cd ..
echo.

echo ========================================
echo Setup Complete! ✅
echo ========================================
echo.
echo Next steps:
echo 1. Start MongoDB: docker compose up -d
echo 2. Start Backend: cd server ^&^& npm run dev
echo 3. Start Frontend: cd client ^&^& npm run dev
echo 4. Open http://localhost:5173
echo.
pause
