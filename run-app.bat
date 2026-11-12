@echo off
echo ===================================================
echo   Starting Smart Job Application Tracker
echo ===================================================
echo.

:: 1. Free port 8080 if already in use by an old session
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":8080 "') do (
    echo Freeing port 8080 (Process ID: %%a)...
    taskkill /F /PID %%a >nul 2>&1
)

:: 2. Start Spring Boot Backend in a new window
echo Starting Spring Boot Backend (Port 8080)...
if exist "%~dp0backend\target\smart-job-tracker-1.0.0.jar" (
    start "Job Tracker - Backend" cmd /k "cd /d %~dp0backend && java -jar target\smart-job-tracker-1.0.0.jar"
) else (
    start "Job Tracker - Backend" cmd /k "cd /d %~dp0backend && mvnw.cmd spring-boot:run"
)

:: Wait 3 seconds
timeout /t 3 >nul

:: 3. Start React Frontend in a new window
echo Starting React Frontend (Port 5173)...
start "Job Tracker - Frontend" cmd /k "cd /d %~dp0frontend && npm run dev"

echo.
echo ===================================================
echo Backend starting on: http://localhost:8080
echo Frontend starting on: http://localhost:5173
echo ===================================================
echo Once both windows say ready, open: http://localhost:5173
echo.
pause
