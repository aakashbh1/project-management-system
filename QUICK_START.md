# Quick Start Guide

Get the Project Management System up and running in minutes!

## Prerequisites

- **Docker Desktop** (recommended) OR
- **Python 3.11+** and **Node.js 18+** and **PostgreSQL 15+**

## Option 1: Docker Setup (Easiest) ⭐

### Windows

1. Open PowerShell or Command Prompt in the project directory
2. Run the setup script:
   ```cmd
## Docker Setup (Recommended)

### Prerequisites
- Docker Desktop installed and running
- Git installed

### Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd "Project Managerment system"
   ```

2. **Setup environment variables (Optional for Docker)**
   
   The Docker setup works with default values, but you can customize:
   ```bash
   # Copy the example file
   cp backend/.env.example backend/.env
   
   # Edit if needed (optional)
   # For Docker, ensure DATABASE_HOST=db
   ```

3. **Start all services**
   ```bash
   docker-compose up -d --build
   ```

4. **Wait for services to start** (~30 seconds)
   
   Check status:
   ```bash
   docker-compose ps
   ```

5. **Create a superuser**
   ```bash
   docker-compose exec backend python manage.py createsuperuser
   ```
   
   Follow the prompts to set:
   - Username
   - Email
   - Password

6. **Access the application**
   - Frontend: http://localhost:3000
   - GraphQL API: http://localhost:8000/graphql/
   - Admin Panel: http://localhost:8000/admin/

## Option 2: Local Development Setup

### Backend

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Setup environment
cp .env.example .env
# Edit .env with your PostgreSQL credentials

# Create database
# Using psql:
psql -U postgres
CREATE DATABASE project_management;
\q

# Run migrations
python manage.py makemigrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Start server
python manage.py runserver
```

### Frontend

```bash
# Open a new terminal
cd frontend

# Install dependencies
npm install

# Start development server
npm start
```

## First Steps After Setup

1. **Access the Application**
   - Open http://localhost:3000 in your browser

2. **Create Your First Organization**
   - Click "Organizations" in the header
   - Click "+ New Organization"
   - Fill in the details and submit

3. **Create a Project**
   - Select your organization from the sidebar
   - Click "+ New Project"
   - Enter project details

4. **Add Tasks**
   - Click on your project card
   - Click "+ New Task"
   - Create tasks and organize them

5. **Explore the Admin Panel**
   - Visit http://localhost:8000/admin/
   - Login with your superuser credentials
   - Manage all data from the admin interface

## Stopping the Application

### Docker
```bash
docker-compose down
```

### Local Development
- Press `Ctrl+C` in both terminal windows (backend and frontend)

## Troubleshooting

### Docker Issues

**Problem**: Port already in use
```bash
# Stop the conflicting service or change ports in docker-compose.yml
```

**Problem**: Database connection failed
```bash
# Restart the database service
docker-compose restart db
```

### Local Development Issues

**Problem**: PostgreSQL connection error
- Ensure PostgreSQL is running
- Check credentials in `.env` file
- Verify database exists

**Problem**: Frontend can't connect to backend
- Ensure backend is running on port 8000
- Check CORS settings in `backend/project_manager/settings.py`

**Problem**: Module not found errors
- Backend: Ensure virtual environment is activated
- Frontend: Run `npm install` again

## Next Steps

- Read the [README.md](./README.md) for detailed information
- Check [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for API usage
- Review [TECHNICAL_SUMMARY.md](./TECHNICAL_SUMMARY.md) for architecture details

## Support

For issues or questions:
1. Check the documentation files
2. Review error messages in terminal/console
3. Check Docker logs: `docker-compose logs -f`

---

**Happy Project Managing! 🚀**
