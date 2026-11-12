@echo off
echo ===================================================
echo   Starting Smart Job Application Tracker
echo ===================================================
echo.

:: 1. Start Spring Boot Backend in a new window
echo Starting Spring Boot Backend (Port 8080)...
start "Job Tracker - Backend" cmd /k "cd /d %~dp0backend && mvnw.cmd spring-boot:run"

:: Wait 3 seconds
timeout /t 3 >nul

:: 2. Start React Frontend in a new window
echo Starting React Frontend (Port 5173)...
start "Job Tracker - Frontend" cmd /k "cd /d %~dp0frontend && npm run dev"

echo.
echo ===================================================
echo Backend running on: http://localhost:8080
echo Frontend running on: http://localhost:5173
echo ===================================================
echo Once Vite is ready, open http://localhost:5173 in your browser.
pause
