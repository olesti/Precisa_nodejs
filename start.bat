@echo off
SETLOCAL EnableDelayedExpansion

echo Checking if Node.js is installed...
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Node.js is not installed!
    echo Please download and install Node.js from https://nodejs.org/
    echo Press any key to open the download page...
    pause >nul
    start https://nodejs.org/
    exit /b 1
)

echo Node.js is installed. Version:
node --version

echo.
echo Checking if npm is installed...
where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo npm is not installed!
    echo Please reinstall Node.js which includes npm
    exit /b 1
)

echo npm is installed. Version:
npm --version

echo.
echo Checking for node_modules...
if not exist "node_modules" (
    echo node_modules not found. Installing dependencies...
    call npm install
    if !ERRORLEVEL! NEQ 0 (
        echo Failed to install dependencies
        echo Please try running 'npm install' manually
        pause
        exit /b 1
    )
) else (
    echo node_modules found. Checking for updates...
    call npm install
)

echo.
echo Checking if required directories exist...
if not exist "appraisal\temp" (
    echo Creating temp directory for appraisals...
    mkdir "appraisal\temp"
)

echo.
echo Starting the application...
echo Press Ctrl+C to stop the server
echo.

npm run start

if %ERRORLEVEL% NEQ 0 (
    echo Failed to start the application
    echo Please check the error message above
    pause
    exit /b 1
)

pause 