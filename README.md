# Project Management System

A modern, full-stack multi-tenant project management application built with Django, GraphQL, React, and TypeScript.

## 🚀 Features

- **Multi-tenant Architecture**: Complete organization-based data isolation
- **GraphQL API**: Efficient data fetching with Graphene-Django
- **Modern UI**: Responsive React interface with TailwindCSS
- **Type Safety**: Full TypeScript implementation
- **Real-time Updates**: Optimistic UI updates with Apollo Client
- **Project Management**: Create and manage projects with status tracking
- **Task Board**: Kanban-style task management with drag-and-drop
- **Comments**: Collaborative task discussions
- **Statistics**: Project completion rates and task analytics
- **Docker Support**: Containerized deployment

## 📋 Tech Stack

### Backend
- **Django 4.2**: Python web framework
- **Graphene-Django**: GraphQL integration
- **PostgreSQL**: Relational database
- **Django CORS Headers**: Cross-origin resource sharing

### Frontend
- **React 18**: UI library
- **TypeScript**: Type-safe JavaScript
- **Apollo Client**: GraphQL client with caching
- **TailwindCSS**: Utility-first CSS framework
- **React Router**: Client-side routing
- **date-fns**: Date formatting

## 🛠️ Installation & Setup

### Prerequisites
- Python 3.11+
- Node.js 18+
- PostgreSQL 15+
- Docker & Docker Compose (optional)

### Option 1: Docker Setup (Recommended)

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd "Project Managerment system"
   ```

2. **Start all services**
   ```bash
   docker-compose up --build
   ```

3. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000/graphql/
   - Admin Panel: http://localhost:8000/admin/

4. **Create a superuser** (in a new terminal)
   ```bash
   docker-compose exec backend python manage.py createsuperuser
   ```

### Option 2: Local Development Setup

#### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Create and activate virtual environment**
   ```bash
   python -m venv venv
   
   # Windows
   venv\Scripts\activate
   
   # macOS/Linux
   source venv/bin/activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Setup environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials
   ```

5. **Create PostgreSQL database**
   ```bash
   # Using psql
   psql -U postgres
   CREATE DATABASE project_management;
   \q
   ```

6. **Run migrations**
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

7. **Create superuser**
   ```bash
   python manage.py createsuperuser
   ```

8. **Start development server**
   ```bash
   python manage.py runserver
   ```

#### Frontend Setup

1. **Navigate to frontend directory** (new terminal)
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm start
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend GraphQL: http://localhost:8000/graphql/

## 📖 Usage Guide

### 1. Create an Organization
- Navigate to "Organizations" page
- Click "+ New Organization"
- Fill in organization details
- Submit the form

### 2. Create a Project
- Select an organization from the sidebar
- Click "+ New Project" on the dashboard
- Enter project details (name, description, status, due date)
- Submit to create

### 3. Manage Tasks
- Click on a project card to view details
- Use the task board to create and manage tasks
- Drag tasks between columns (To Do, In Progress, Done)
- Add comments to tasks for collaboration

### 4. View Statistics
- Project completion rates
- Task distribution across statuses
- Real-time progress tracking

## 🔧 Configuration

### Backend Environment Variables
Create a `.env` file in the `backend` directory:

```env
SECRET_KEY=your-secret-key-here
DEBUG=True
DATABASE_NAME=project_management
DATABASE_USER=postgres
DATABASE_PASSWORD=postgres
DATABASE_HOST=localhost
DATABASE_PORT=5432
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:3000
```

### Frontend Configuration
The frontend is configured to connect to `http://localhost:8000/graphql/` by default. To change this, edit `frontend/src/apollo/client.ts`.

## 🧪 Testing

### Backend Tests
```bash
cd backend
python manage.py test
```

### Frontend Tests
```bash
cd frontend
npm test
```

## 📁 Project Structure

```
Project Managerment system/
├── backend/
│   ├── core/                  # Main Django app
│   │   ├── models.py         # Database models
│   │   ├── schema.py         # GraphQL schema
│   │   └── admin.py          # Admin configuration
│   ├── project_manager/      # Django project settings
│   │   ├── settings.py       # Configuration
│   │   └── urls.py           # URL routing
│   ├── requirements.txt      # Python dependencies
│   └── manage.py             # Django management script
├── frontend/
│   ├── src/
│   │   ├── components/       # React components
│   │   │   ├── Layout/       # Header, Sidebar
│   │   │   ├── Projects/     # Project components
│   │   │   ├── Tasks/        # Task components
│   │   │   └── UI/           # Reusable UI components
│   │   ├── pages/            # Page components
│   │   ├── graphql/          # GraphQL queries & mutations
│   │   ├── apollo/           # Apollo Client setup
│   │   ├── types/            # TypeScript interfaces
│   │   └── App.tsx           # Main app component
│   ├── package.json          # Node dependencies
│   └── tailwind.config.js    # TailwindCSS configuration
├── docker-compose.yml        # Docker orchestration
└── README.md                 # This file
```

## 🔐 Security Notes

- Change `SECRET_KEY` in production
- Set `DEBUG=False` in production
- Use environment-specific database credentials
- Implement proper authentication for production use
- Enable HTTPS in production

## 🚢 Deployment

### Production Checklist
1. Set `DEBUG=False` in Django settings
2. Configure proper `ALLOWED_HOSTS`
3. Use strong `SECRET_KEY`
4. Setup production database
5. Configure static file serving
6. Enable HTTPS
7. Setup proper CORS origins
8. Implement authentication/authorization
9. Setup monitoring and logging
10. Configure backup strategy

## 📝 API Documentation

See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for detailed GraphQL API documentation.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👥 Authors

- Your Name - Initial work

## 🙏 Acknowledgments

- Django and React communities
- GraphQL and Apollo teams
- TailwindCSS creators
