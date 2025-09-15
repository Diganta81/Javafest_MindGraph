# MindGraph - AI-Integrated Smart Scheduling System

## Overview

MindGraph is an intelligent scheduling and time management system that uses AI to optimize task management based on individual preferences, workload perception, time constraints, and task interdependencies. The system learns from user behavior patterns to create more effective and personalized schedules.

## Features

- **Intelligent Task Management**: Create, manage, and track tasks with AI-powered scheduling suggestions
- **Natural Language Interface**: Interact with the system using a chatbot to create tasks, schedule events, and query free time
- **Personalized Scheduling**: AI learns from user preferences and behavior to optimize schedules
- **Task Dependency Management**: Handle complex task relationships and prerequisites
- **Smart Reminders**: Intelligent notifications based on urgency, priority, and user context
- **Calendar Integration**: Comprehensive calendar view with event management
- **User Preferences**: Customizable settings for work hours, energy levels, and scheduling preferences
- **Analytics & Insights**: Track productivity patterns and get insights into time usage

## Technology Stack

### Backend
- **Java 17** with **Spring Boot 3.2.0**
- **Spring Security** for authentication and authorization
- **Spring Data JPA** for data persistence
- **PostgreSQL** database
- **JWT** for secure authentication
- **Maven** for dependency management

### Frontend
- **React 18** with functional components and hooks
- **Material-UI (MUI)** for component library
- **React Router** for navigation
- **Axios** for API communication
- **React Query** for state management and caching
- **React Hook Form** for form handling

### Database
- **PostgreSQL 13+** with optimized indexes and triggers

## Project Structure

```
mindgraph/
├── backend/                    # Spring Boot backend
│   ├── src/main/java/com/mindgraph/
│   │   ├── entity/            # JPA entities
│   │   ├── repository/        # Data repositories
│   │   ├── service/           # Business logic
│   │   ├── controller/        # REST controllers
│   │   ├── dto/              # Data transfer objects
│   │   └── config/           # Configuration classes
│   ├── src/main/resources/
│   │   └── application.properties
│   └── pom.xml
├── frontend/                   # React frontend
│   ├── src/
│   │   ├── components/        # Reusable React components
│   │   ├── pages/            # Page components
│   │   ├── services/         # API service layer
│   │   ├── hooks/            # Custom React hooks
│   │   └── utils/            # Utility functions
│   ├── public/
│   └── package.json
└── database/
    └── schema.sql             # Database schema and sample data
```

## Setup Instructions

### Prerequisites

- Java 17 or higher
- Node.js 16 or higher
- PostgreSQL 13 or higher
- Maven 3.6 or higher

### Database Setup

1. Install PostgreSQL and create a database:
```sql
CREATE DATABASE mindgraph;
CREATE USER mindgraph_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE mindgraph TO mindgraph_user;
```

2. Run the schema script:
```bash
psql -U mindgraph_user -d mindgraph -f database/schema.sql
```

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Update `src/main/resources/application.properties` with your database credentials:
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/mindgraph
spring.datasource.username=mindgraph_user
spring.datasource.password=your_password
```

3. Run the Spring Boot application:
```bash
mvn spring-boot:run
```

The backend will start on `http://localhost:8080`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the React development server:
```bash
npm start
```

The frontend will start on `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - User logout

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/preferences` - Get user preferences
- `PUT /api/users/preferences` - Update user preferences

### Tasks
- `GET /api/tasks` - Get user tasks
- `POST /api/tasks` - Create new task
- `GET /api/tasks/{id}` - Get specific task
- `PUT /api/tasks/{id}` - Update task
- `DELETE /api/tasks/{id}` - Delete task
- `PATCH /api/tasks/{id}/complete` - Mark task as complete

### Events
- `GET /api/events` - Get user events
- `POST /api/events` - Create new event
- `GET /api/events/{id}` - Get specific event
- `PUT /api/events/{id}` - Update event
- `DELETE /api/events/{id}` - Delete event

### Chatbot
- `POST /api/chatbot/message` - Send message to AI assistant
- `POST /api/chatbot/create-task` - Create task via chatbot
- `POST /api/chatbot/query-schedule` - Query schedule information

### Scheduling
- `POST /api/schedule/generate` - Generate AI-optimized schedule
- `GET /api/schedule/conflicts` - Check for scheduling conflicts
- `GET /api/schedule/available` - Get available time slots

## Key Features Implementation

### Entity Relationships
- **Users** can have multiple **Tasks** and **Events**
- **Tasks** can have subtasks (self-referencing relationship)
- **UserPreferences** store personalized settings for AI scheduling
- **Tasks** and **Events** support categorization and tagging

### AI Scheduling Logic
The system will learn from:
- Task completion times vs. estimates
- User energy levels at different times
- Task difficulty ratings and actual effort required
- Preferred work patterns and break intervals

### Security
- JWT-based authentication
- Role-based access control
- Password encryption using BCrypt
- CORS configuration for frontend-backend communication

## Future Enhancements

- Machine learning models for better schedule optimization
- Integration with external calendars (Google Calendar, Outlook)
- Mobile application
- Team collaboration features
- Advanced analytics and reporting
- Voice commands and natural language processing
- Third-party integrations (Slack, Microsoft Teams)

## Development Guidelines

### Backend
- Follow Spring Boot best practices
- Use DTOs for API communication
- Implement proper error handling and validation
- Write unit tests for services and controllers
- Use meaningful commit messages

### Frontend
- Follow React best practices and hooks pattern
- Use Material-UI components consistently
- Implement proper error boundaries
- Write reusable components
- Maintain consistent code formatting

### Database
- Use proper indexing for performance
- Implement soft deletes where appropriate
- Use database constraints for data integrity
- Regular backup procedures

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Write tests for new functionality
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
