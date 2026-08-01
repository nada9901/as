@echo off
SETLOCAL EnableDelayedExpansion
title HealthGluco - Full Stack Runner

:: HealthGluco Final Run Script for Windows
:: ==========================================

echo.
echo  ##########################################
echo  #                                        #
echo  #         HealthGluco v1.0.0             #
echo  #     Diabetes Risk Prediction App       #
echo  #                                        #
echo  ##########################################
echo.

:: 1. Check for Node.js
node -v >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed!
    echo Please download and install it from: https://nodejs.org/
    echo.
    pause
    exit /b
)

:: 2. Check for node_modules and install if missing
if not exist "node_modules\" (
    echo [INFO] First time setup: Installing dependencies...
    echo This may take a few minutes...
    call npm install
    if !errorlevel! neq 0 (
        echo [ERROR] npm install failed. Please check your internet connection.
        pause
        exit /b
    )
    echo [SUCCESS] Dependencies installed.
)

:: 3. Ask for Run Mode
echo.
echo Choose run mode:
echo [1] Development Mode (Vite HMR + Express API) - Recommended for testing
echo [2] Production Mode (Build + Start) - Recommended for deployment
echo.
set /p mode="Enter choice (1 or 2, default is 1): "

if "%mode%"=="2" (
    echo [INFO] Building production bundle...
    call npm run build
    if !errorlevel! neq 0 (
        echo [ERROR] Build failed.
        pause
        exit /b
    )
    echo [INFO] Starting Production Server...
    echo App will be available at: http://localhost:3000
    call npm start
) else (
    echo [INFO] Starting Development Server...
    echo App will be available at: http://localhost:3000
    call npm run dev
)

pause
