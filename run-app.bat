@echo off
title Smart Job Application Tracker
echo ===================================================
echo   Starting Smart Job Application Tracker
echo ===================================================
echo.

echo [1/2] Starting Spring Boot Backend on port 8080...
start "Job Tracker - Backend" cmd /k "cd /d "%~dp0backend" && java -jar target\smart-job-tracker-1.0.0.jar"

echo Waiting for Backend to initialize...
ping 127.0.0.1 -n 6 >nul

echo [2/2] Starting React Frontend on port 5173...
start "Job Tracker - Frontend" cmd /k "cd /d "%~dp0frontend" && npm run dev"

echo Waiting for Frontend to initialize...
ping 127.0.0.1 -n 4 >nul

echo Opening browser at http://localhost:5173...
start http://localhost:5173

echo.
echo ===================================================
echo   Both services started successfully!
echo   Backend:  http://localhost:8080
echo   Frontend: http://localhost:5173
echo ===================================================
echo.
echo Keep the Backend and Frontend windows open.
echo You can minimize them while using the app.
pause
