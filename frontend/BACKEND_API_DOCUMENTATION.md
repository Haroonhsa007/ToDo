# Backend API Documentation

This document provides comprehensive details about the backend requirements, API endpoints, environment variables, and data models needed for the ToDo application frontend.

## Table of Contents

1. [Environment Variables](#environment-variables)
2. [Backend Requirements](#backend-requirements)
3. [API Base Configuration](#api-base-configuration)
4. [Authentication](#authentication)
5. [API Endpoints](#api-endpoints)
6. [Data Models](#data-models)
7. [Error Handling](#error-handling)
8. [File Upload](#file-upload)
9. [Response Formats](#response-formats)

---

## Environment Variables

### Frontend Environment Variables

Create a `.env` file in the `frontend/` directory with the following variables:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:8000/api

# Environment
VITE_APP_ENV=development
```

### Backend Environment Variables (Recommended)

The backend should support the following environment variables:

```env
# Django Settings
DEBUG=True
SECRET_KEY=your-secret-key-here
ALLOWED_HOSTS=localhost,127.0.0.1

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/todo_db

# CORS Settings
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
CORS_ALLOW_CREDENTIALS=True

# JWT Settings
JWT_SECRET_KEY=your-jwt-secret-key
JWT_ALGORITHM=HS256
JWT_ACCESS_TOKEN_LIFETIME=60  # minutes
JWT_REFRESH_TOKEN_LIFETIME=1440  # minutes (24 hours)

# File Upload Settings
MEDIA_ROOT=/path/to/media
MEDIA_URL=/media/
MAX_UPLOAD_SIZE=5242880  # 5MB in bytes
ALLOWED_IMAGE_TYPES=image/jpeg,image/png,image/gif,image/webp

# Email Settings (Optional - for password reset)
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password
```

---

## Backend Requirements

### Technology Stack

The frontend expects a RESTful API backend. Recommended stack:

- **Framework**: Django REST Framework or FastAPI or Node.js/Express
- **Database**: PostgreSQL (recommended) or MySQL
- **Authentication**: JWT (JSON Web Tokens)
- **File Storage**: Local filesystem or cloud storage (AWS S3, Cloudinary, etc.)
- **CORS**: Enabled for frontend origin

### Required Backend Features

1. **User Authentication & Authorization**
   - User registration
   - User login with JWT tokens
   - Token refresh mechanism
   - Password reset (optional)
   - Social authentication (Facebook, Google, Twitter) - optional

2. **Task Management**
   - CRUD operations for tasks
   - Task filtering and search
   - Task status management
   - Task priority management
   - Task categorization

3. **File Upload**
   - Image upload for tasks
   - File validation (type, size)
   - Image storage and retrieval

4. **User Management**
   - User profile management
   - Password change
   - Account information

5. **Team/Collaboration** (Future feature)
   - Team member management
   - Task sharing
   - Invitations

---

## API Base Configuration

### Base URL

The frontend uses the base URL from `VITE_API_BASE_URL` environment variable:

- **Development**: `http://localhost:8000/api`
- **Production**: `https://api.yourdomain.com/api`

### Request Headers

All authenticated requests must include:

```
Authorization: Bearer <access_token>
Content-Type: application/json
```

### Response Headers

Backend should include CORS headers:

```
Access-Control-Allow-Origin: http://localhost:5173
Access-Control-Allow-Credentials: true
Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
```

---

## Authentication

### Authentication Flow

1. User logs in via `/auth/login`
2. Backend returns access token and refresh token
3. Frontend stores token in `localStorage` as `authToken`
4. All subsequent requests include token in `Authorization` header
5. On 401 error, frontend clears token and redirects to login

### Token Storage

- **Storage**: `localStorage.getItem('authToken')`
- **Format**: `Bearer <token>`
- **Expiration**: Handled by backend (recommended: 60 minutes)

---

## API Endpoints

### Authentication Endpoints

#### 1. User Login

```http
POST /auth/login
Content-Type: application/json

{
  "username": "string",
  "password": "string"
}
```

**Response (200 OK):**
```json
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "user": {
    "id": 1,
    "username": "sundar",
    "email": "sundar@example.com",
    "first_name": "Sundar",
    "last_name": "User"
  }
}
```

**Error Response (401 Unauthorized):**
```json
{
  "message": "Invalid credentials",
  "error": "authentication_failed"
}
```

#### 2. User Registration

```http
POST /auth/register
Content-Type: application/json

{
  "username": "string",
  "email": "string",
  "password": "string",
  "first_name": "string (optional)",
  "last_name": "string (optional)"
}
```

**Response (201 Created):**
```json
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "user": {
    "id": 1,
    "username": "newuser",
    "email": "newuser@example.com"
  }
}
```

#### 3. User Logout

```http
POST /auth/logout
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "message": "Successfully logged out"
}
```

#### 4. Refresh Token

```http
POST /auth/refresh
Content-Type: application/json

{
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

**Response (200 OK):**
```json
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

---

### User Endpoints

#### 5. Get Current User

```http
GET /users/me
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "id": 1,
  "username": "sundar",
  "email": "sundar@example.com",
  "first_name": "Sundar",
  "last_name": "User",
  "avatar": "http://localhost:8000/media/avatars/user1.jpg",
  "created_at": "2023-06-20T10:00:00Z"
}
```

#### 6. Update User Profile

```http
PUT /users/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "first_name": "string",
  "last_name": "string",
  "email": "string"
}
```

**Response (200 OK):**
```json
{
  "id": 1,
  "username": "sundar",
  "email": "updated@example.com",
  "first_name": "Updated",
  "last_name": "Name"
}
```

#### 7. Change Password

```http
POST /users/change-password
Authorization: Bearer <token>
Content-Type: application/json

{
  "old_password": "string",
  "new_password": "string",
  "confirm_password": "string"
}
```

**Response (200 OK):**
```json
{
  "message": "Password changed successfully"
}
```

---

### Task Endpoints

#### 8. Get All Tasks

```http
GET /todos
Authorization: Bearer <token>
```

**Query Parameters (Optional):**
- `status`: Filter by status (`Not Started`, `In Progress`, `Completed`)
- `priority`: Filter by priority (`Extreme`, `Moderate`, `Low`)
- `search`: Search in title and description
- `ordering`: Sort by field (`-created_at`, `priority`, etc.)
- `page`: Page number for pagination
- `page_size`: Items per page

**Response (200 OK):**
```json
{
  "count": 10,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": 1,
      "title": "Attend Nischal's Birthday Party",
      "description": "Buy gifts on the way and pick up cake from the bakery...",
      "priority": "Moderate",
      "status": "Not Started",
      "image": "http://localhost:8000/media/tasks/task1.jpg",
      "due_date": "2023-06-20T18:00:00Z",
      "created_at": "2023-06-20T10:00:00Z",
      "updated_at": "2023-06-20T10:00:00Z",
      "user": 1,
      "category": null
    }
  ]
}
```

#### 9. Get Single Task

```http
GET /todos/{id}
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "id": 1,
  "title": "Attend Nischal's Birthday Party",
  "description": "Buy gifts on the way and pick up cake from the bakery. (6 PM | Fresh Elements)\n\n1. A cake, with candles to blow out...",
  "priority": "Moderate",
  "status": "Not Started",
  "image": "http://localhost:8000/media/tasks/task1.jpg",
  "due_date": "2023-06-20T18:00:00Z",
  "created_at": "2023-06-20T10:00:00Z",
  "updated_at": "2023-06-20T10:00:00Z",
  "user": 1,
  "category": null
}
```

#### 10. Create Task

```http
POST /todos
Authorization: Bearer <token>
Content-Type: multipart/form-data

{
  "title": "string (required)",
  "description": "string (required)",
  "priority": "Extreme|Moderate|Low (required)",
  "status": "Not Started|In Progress|Completed (default: Not Started)",
  "due_date": "YYYY-MM-DD (optional)",
  "image": "file (optional, image file)",
  "category": "integer (optional, category ID)"
}
```

**Response (201 Created):**
```json
{
  "id": 1,
  "title": "New Task",
  "description": "Task description",
  "priority": "Moderate",
  "status": "Not Started",
  "image": "http://localhost:8000/media/tasks/task1.jpg",
  "due_date": "2023-06-25T00:00:00Z",
  "created_at": "2023-06-20T10:00:00Z",
  "updated_at": "2023-06-20T10:00:00Z",
  "user": 1,
  "category": null
}
```

#### 11. Update Task

```http
PUT /todos/{id}
Authorization: Bearer <token>
Content-Type: multipart/form-data

{
  "title": "string",
  "description": "string",
  "priority": "Extreme|Moderate|Low",
  "status": "Not Started|In Progress|Completed",
  "due_date": "YYYY-MM-DD",
  "image": "file (optional)",
  "category": "integer (optional)"
}
```

**Response (200 OK):**
```json
{
  "id": 1,
  "title": "Updated Task",
  "description": "Updated description",
  "priority": "Extreme",
  "status": "In Progress",
  "image": "http://localhost:8000/media/tasks/task1.jpg",
  "due_date": "2023-06-25T00:00:00Z",
  "created_at": "2023-06-20T10:00:00Z",
  "updated_at": "2023-06-20T11:00:00Z",
  "user": 1,
  "category": null
}
```

#### 12. Delete Task

```http
DELETE /todos/{id}
Authorization: Bearer <token>
```

**Response (204 No Content)**

---

### Task Statistics Endpoints

#### 13. Get Task Statistics

```http
GET /todos/statistics
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "total": 10,
  "completed": 8,
  "in_progress": 1,
  "not_started": 1,
  "completed_percentage": 80,
  "in_progress_percentage": 10,
  "not_started_percentage": 10
}
```

---

### Category Endpoints

#### 14. Get All Categories

```http
GET /categories
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "name": "Work",
    "color": "#FF6767",
    "created_at": "2023-06-20T10:00:00Z"
  }
]
```

#### 15. Create Category

```http
POST /categories
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "string (required)",
  "color": "string (optional, hex color)"
}
```

**Response (201 Created):**
```json
{
  "id": 1,
  "name": "Personal",
  "color": "#42ADE2",
  "created_at": "2023-06-20T10:00:00Z"
}
```

#### 16. Update Category

```http
PUT /categories/{id}
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "string",
  "color": "string"
}
```

#### 17. Delete Category

```http
DELETE /categories/{id}
Authorization: Bearer <token>
```

---

### Task Status & Priority Management

#### 18. Get Task Statuses

```http
GET /task-statuses
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "name": "Not Started",
    "color": "#F21E1E",
    "order": 1
  },
  {
    "id": 2,
    "name": "In Progress",
    "color": "#0225FF",
    "order": 2
  },
  {
    "id": 3,
    "name": "Completed",
    "color": "#05A301",
    "order": 3
  }
]
```

#### 19. Get Task Priorities

```http
GET /task-priorities
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "name": "Extreme",
    "color": "#F21E1E",
    "order": 1
  },
  {
    "id": 2,
    "name": "Moderate",
    "color": "#42ADE2",
    "order": 2
  },
  {
    "id": 3,
    "name": "Low",
    "color": "#05A301",
    "order": 3
  }
]
```

---

## Data Models

### User Model

```python
{
  "id": "integer (primary key)",
  "username": "string (unique, required)",
  "email": "string (unique, required)",
  "first_name": "string (optional)",
  "last_name": "string (optional)",
  "avatar": "string (URL, optional)",
  "created_at": "datetime (ISO 8601)",
  "updated_at": "datetime (ISO 8601)"
}
```

### Task Model

```python
{
  "id": "integer (primary key)",
  "title": "string (required, max 200 chars)",
  "description": "text (required)",
  "priority": "string (choices: 'Extreme', 'Moderate', 'Low', required)",
  "status": "string (choices: 'Not Started', 'In Progress', 'Completed', default: 'Not Started')",
  "image": "string (URL, optional)",
  "due_date": "datetime (ISO 8601, optional)",
  "created_at": "datetime (ISO 8601)",
  "updated_at": "datetime (ISO 8601)",
  "user": "integer (foreign key to User, required)",
  "category": "integer (foreign key to Category, optional, nullable)"
}
```

### Category Model

```python
{
  "id": "integer (primary key)",
  "name": "string (required, max 100 chars)",
  "color": "string (hex color, optional, default: '#FF6767')",
  "user": "integer (foreign key to User, required)",
  "created_at": "datetime (ISO 8601)",
  "updated_at": "datetime (ISO 8601)"
}
```

### Task Status Model (Optional - for custom statuses)

```python
{
  "id": "integer (primary key)",
  "name": "string (required, max 50 chars)",
  "color": "string (hex color, optional)",
  "order": "integer (for sorting)",
  "user": "integer (foreign key to User, optional for global statuses)"
}
```

### Task Priority Model (Optional - for custom priorities)

```python
{
  "id": "integer (primary key)",
  "name": "string (required, max 50 chars)",
  "color": "string (hex color, optional)",
  "order": "integer (for sorting)",
  "user": "integer (foreign key to User, optional for global priorities)"
}
```

---

## Error Handling

### Standard Error Response Format

All errors should follow this format:

```json
{
  "message": "Human-readable error message",
  "error": "error_code",
  "details": {
    "field_name": ["Error message for this field"]
  }
}
```

### HTTP Status Codes

- **200 OK**: Successful GET, PUT, PATCH requests
- **201 Created**: Successful POST request (resource created)
- **204 No Content**: Successful DELETE request
- **400 Bad Request**: Validation errors, malformed request
- **401 Unauthorized**: Missing or invalid authentication token
- **403 Forbidden**: Authenticated but not authorized
- **404 Not Found**: Resource not found
- **500 Internal Server Error**: Server error

### Common Error Responses

#### Validation Error (400)

```json
{
  "message": "Validation failed",
  "error": "validation_error",
  "details": {
    "title": ["This field is required."],
    "priority": ["Invalid choice. Must be one of: Extreme, Moderate, Low."]
  }
}
```

#### Unauthorized (401)

```json
{
  "message": "Authentication credentials were not provided.",
  "error": "authentication_required"
}
```

#### Not Found (404)

```json
{
  "message": "Task not found",
  "error": "not_found"
}
```

#### Permission Denied (403)

```json
{
  "message": "You do not have permission to perform this action.",
  "error": "permission_denied"
}
```

---

## File Upload

### Image Upload Requirements

1. **Supported Formats**: JPEG, PNG, GIF, WebP
2. **Max File Size**: 5MB (recommended)
3. **Storage**: Backend should store files and return full URL
4. **Upload Endpoint**: Can be part of task creation/update or separate endpoint

### Image Upload in Task Creation

When creating/updating a task with an image:

```http
POST /todos
Content-Type: multipart/form-data
Authorization: Bearer <token>

title: "Task Title"
description: "Task description"
priority: "Moderate"
status: "Not Started"
due_date: "2023-06-25"
image: <binary file>
```

### Separate Image Upload Endpoint (Alternative)

```http
POST /todos/{id}/upload-image
Content-Type: multipart/form-data
Authorization: Bearer <token>

image: <binary file>
```

**Response (200 OK):**
```json
{
  "image": "http://localhost:8000/media/tasks/task1.jpg",
  "message": "Image uploaded successfully"
}
```

### Image URL Format

Backend should return full URLs for images:

- **Development**: `http://localhost:8000/media/tasks/filename.jpg`
- **Production**: `https://api.yourdomain.com/media/tasks/filename.jpg`

---

## Response Formats

### Pagination Format

For paginated responses:

```json
{
  "count": 100,
  "next": "http://localhost:8000/api/todos?page=3",
  "previous": "http://localhost:8000/api/todos?page=1",
  "results": [
    // ... array of items
  ]
}
```

### Success Response

Standard success response:

```json
{
  "message": "Operation completed successfully",
  "data": {
    // ... response data
  }
}
```

### List Response

For list endpoints:

```json
[
  {
    // ... item 1
  },
  {
    // ... item 2
  }
]
```

---

## Frontend API Service Implementation

The frontend uses the following API service structure (see `src/services/api.js`):

### Current Implementation

```javascript
// User API
userAPI.getCurrentUser()
userAPI.updateProfile(userData)
userAPI.login(credentials)
userAPI.logout()

// Todo API
todoAPI.getAll()
todoAPI.getById(id)
todoAPI.create(todoData)
todoAPI.update(id, todoData)
todoAPI.delete(id)
```

### Required Extensions

The following API methods should be added to support all frontend features:

```javascript
// Task Statistics
todoAPI.getStatistics()

// Categories
categoryAPI.getAll()
categoryAPI.create(categoryData)
categoryAPI.update(id, categoryData)
categoryAPI.delete(id)

// Task Statuses & Priorities
statusAPI.getAll()
priorityAPI.getAll()
```

---

## CORS Configuration

Backend must allow requests from frontend origin:

### Django CORS Settings

```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",  # Vite dev server
    "http://localhost:3000",  # Alternative dev port
    "https://yourdomain.com",  # Production
]

CORS_ALLOW_CREDENTIALS = True

CORS_ALLOW_METHODS = [
    'DELETE',
    'GET',
    'OPTIONS',
    'PATCH',
    'POST',
    'PUT',
]
```

---

## Security Considerations

1. **Authentication**: All endpoints except login/register should require authentication
2. **Authorization**: Users should only access their own tasks
3. **Input Validation**: Validate all inputs on backend
4. **File Upload Security**: 
   - Validate file types and sizes
   - Scan for malware (optional)
   - Store files outside web root or use secure URLs
5. **Rate Limiting**: Implement rate limiting for API endpoints
6. **HTTPS**: Use HTTPS in production
7. **Token Expiration**: Implement reasonable token expiration times

---

## Testing the API

### Using cURL

```bash
# Login
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "testuser", "password": "testpass"}'

# Get Tasks (with token)
curl -X GET http://localhost:8000/api/todos \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Using Postman/Insomnia

1. Create a collection for the API
2. Set base URL: `http://localhost:8000/api`
3. Add authentication: Bearer Token
4. Test all endpoints

---

## Additional Notes

1. **Date Format**: Use ISO 8601 format for all datetime fields
2. **Timezone**: Store dates in UTC, convert to user timezone in frontend
3. **Image Optimization**: Consider image compression/optimization on upload
4. **Caching**: Implement caching for frequently accessed data
5. **Logging**: Log all API requests and errors
6. **Monitoring**: Set up API monitoring and alerting

---

## Support

For questions or issues regarding the API integration, please refer to:
- Frontend API service: `frontend/src/services/api.js`
- Axios configuration: `frontend/src/services/axios.js`
- Constants: `frontend/src/constants/index.js`

