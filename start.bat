@echo off
echo Starting Book Cafe Application...
echo.

REM Start Backend
echo [1/2] Starting Backend Server...
cd /d "c:\ProjectZero\backend"
start "Backend Server" cmd /k "npm start"
timeout /t 3 >nul

REM Start Frontend
echo [2/2] Starting Frontend Server...
cd /d "c:\ProjectZero"
start "Frontend Server" cmd /k "npm run dev"
timeout /t 3 >nul

echo.
echo ========================================
echo Book Cafe is starting up...
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:5173
echo ========================================
echo.
echo Servers will open in separate windows.
echo Wait a few seconds, then open your browser to:
echo http://localhost:5173
echo.
pause
