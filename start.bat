@echo off
SETLOCAL EnableDelayedExpansion

echo Checking if Node.js is installed...
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Node.js is not installed!
    echo Please download and install Node.js from https://nodejs.org/
    pause
    start https://nodejs.org/
    exit /b 1
)

echo Node.js is installed. Version:
node --version
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Failed to get Node.js version.
    pause
    exit /b 1
)

echo Checking if npm is installed...
where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: npm is not installed!
    pause
    exit /b 1
)

echo npm is installed. Version:
call npm --version
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Failed to get npm version.
    pause
    exit /b 1
)

echo Checking for node_modules...
if not exist "node_modules" (
    echo node_modules not found. Installing dependencies...
    call npm install
    if !ERRORLEVEL! NEQ 0 (
        echo ERROR: Failed to install dependencies.
        pause
        exit /b 1
    )
) else (
    echo node_modules found. Checking for updates...
    call npm install
    if !ERRORLEVEL! NEQ 0 (
        echo ERROR: npm install/update failed.
        pause
        exit /b 1
    )
)

echo Checking if required directories exist...
if not exist "appraisal\temp" (
    echo Creating appraisal\temp directory...
    mkdir "appraisal\temp"
    if %ERRORLEVEL% NEQ 0 (
        echo ERROR: Failed to create the directory.
        pause
        exit /b 1
    )
)

echo Starting the application...
echo (Press Ctrl+C to stop the server)

call npm run start
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Failed to start the application.
    pause
    exit /b 1
)
