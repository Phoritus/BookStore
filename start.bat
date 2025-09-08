@echo off
echo Starting Book Cafe Application...
echo.

REM Start Frontend (Vite on port 5175)
echo [1/1] Starting Frontend Server...
cd /d "c:\BookStore"
start "Frontend Server" cmd /k "npm run dev -- --port 5175"
timeout /t 3 >nul

echo.
echo ========================================
echo Book Cafe UI is starting up...
echo Frontend (UI-only): http://localhost:5175
echo ========================================
echo.
echo Servers will open in separate windows.
echo If a Windows Firewall prompt appears for Node.js, click "Allow access".
echo After a few seconds, open your browser to:
echo   http://localhost:5175
echo.
pause
