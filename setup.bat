@echo off
REM Project Management System - Quick Setup Script for Windows

echo =========================================
echo Project Management System - Quick Setup
echo =========================================
echo.

REM Check if Docker is installed
docker --version >nul 2>&1
if errorlevel 1 (
    echo X Docker is not installed. Please install Docker first.
    echo Visit: https://docs.docker.com/get-docker/
    exit /b 1
)

docker-compose --version >nul 2>&1
if errorlevel 1 (
    echo X Docker Compose is not installed. Please install Docker Compose first.
    echo Visit: https://docs.docker.com/compose/install/
    exit /b 1
)

echo + Docker and Docker Compose are installed
echo.

REM Create .env file for backend if it doesn't exist
if not exist "backend\.env" (
    echo Creating backend .env file...
    copy "backend\.env.example" "backend\.env"
    echo + Created backend\.env (please update with your settings)
) else (
    echo + backend\.env already exists
)

echo.
echo Starting Docker containers...
docker-compose up -d --build

echo.
echo Waiting for services to be ready...
timeout /t 10 /nobreak >nul

echo.
echo Running database migrations...
docker-compose exec -T backend python manage.py migrate

echo.
echo Creating superuser...
echo Please enter superuser details:
docker-compose exec backend python manage.py createsuperuser

echo.
echo =========================================
echo + Setup Complete!
echo =========================================
echo.
echo Access the application:
echo    Frontend:  http://localhost:3000
echo    Backend:   http://localhost:8000/graphql/
echo    Admin:     http://localhost:8000/admin/
echo.
echo To view logs:
echo    docker-compose logs -f
echo.
echo To stop services:
echo    docker-compose down
echo.
echo Happy coding!
pause
