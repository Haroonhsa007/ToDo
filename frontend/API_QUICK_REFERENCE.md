# API Quick Reference Guide

This is a quick reference guide for the ToDo application API endpoints. For detailed documentation, see [BACKEND_API_DOCUMENTATION.md](./BACKEND_API_DOCUMENTATION.md).

## Base URL

```
Development: http://localhost:8000/api
Production: https://api.yourdomain.com/api
```

## Authentication

All protected endpoints require the `Authorization` header:
```
Authorization: Bearer <access_token>
```

---

## Quick Endpoint Reference

### Authentication

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/auth/login` | User login | No |
| POST | `/auth/register` | User registration | No |
| POST | `/auth/logout` | User logout | Yes |
| POST | `/auth/refresh` | Refresh access token | No |

### User Management

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/users/me` | Get current user | Yes |
| PUT | `/users/profile` | Update user profile | Yes |
| POST | `/users/change-password` | Change password | Yes |

### Tasks

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/todos` | Get all tasks | Yes |
| GET | `/todos/{id}` | Get single task | Yes |
| POST | `/todos` | Create task | Yes |
| PUT | `/todos/{id}` | Update task | Yes |
| DELETE | `/todos/{id}` | Delete task | Yes |
| GET | `/todos/statistics` | Get task statistics | Yes |

### Categories

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/categories` | Get all categories | Yes |
| POST | `/categories` | Create category | Yes |
| PUT | `/categories/{id}` | Update category | Yes |
| DELETE | `/categories/{id}` | Delete category | Yes |

### Task Status & Priority

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/task-statuses` | Get all statuses | Yes |
| GET | `/task-priorities` | Get all priorities | Yes |

---

## Request/Response Examples

### Login

**Request:**
```http
POST /auth/login
Content-Type: application/json

{
  "username": "sundar",
  "password": "password123"
}
```

**Response:**
```json
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "user": {
    "id": 1,
    "username": "sundar",
    "email": "sundar@example.com"
  }
}
```

### Create Task

**Request:**
```http
POST /todos
Authorization: Bearer <token>
Content-Type: multipart/form-data

title: "New Task"
description: "Task description"
priority: "Moderate"
status: "Not Started"
due_date: "2023-06-25"
image: <file>
```

**Response:**
```json
{
  "id": 1,
  "title": "New Task",
  "description": "Task description",
  "priority": "Moderate",
  "status": "Not Started",
  "image": "http://localhost:8000/media/tasks/task1.jpg",
  "due_date": "2023-06-25T00:00:00Z",
  "created_at": "2023-06-20T10:00:00Z"
}
```

### Get All Tasks

**Request:**
```http
GET /todos?status=In Progress&priority=Extreme
Authorization: Bearer <token>
```

**Response:**
```json
{
  "count": 10,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": 1,
      "title": "Task Title",
      "description": "Description",
      "priority": "Extreme",
      "status": "In Progress",
      "image": "http://localhost:8000/media/tasks/task1.jpg",
      "due_date": "2023-06-25T00:00:00Z",
      "created_at": "2023-06-20T10:00:00Z"
    }
  ]
}
```

---

## Data Models

### Task

```typescript
{
  id: number;
  title: string;              // Required, max 200 chars
  description: string;         // Required
  priority: "Extreme" | "Moderate" | "Low";  // Required
  status: "Not Started" | "In Progress" | "Completed";  // Default: "Not Started"
  image?: string;              // URL to image
  due_date?: string;           // ISO 8601 datetime
  created_at: string;          // ISO 8601 datetime
  updated_at: string;          // ISO 8601 datetime
  user: number;                // User ID
  category?: number;           // Category ID (optional)
}
```

### User

```typescript
{
  id: number;
  username: string;           // Unique, required
  email: string;              // Unique, required
  first_name?: string;
  last_name?: string;
  avatar?: string;            // URL to avatar
  created_at: string;         // ISO 8601 datetime
  updated_at: string;         // ISO 8601 datetime
}
```

### Category

```typescript
{
  id: number;
  name: string;               // Required, max 100 chars
  color?: string;             // Hex color (default: "#FF6767")
  created_at: string;         // ISO 8601 datetime
  updated_at: string;         // ISO 8601 datetime
}
```

---

## Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK - Request successful |
| 201 | Created - Resource created |
| 204 | No Content - Delete successful |
| 400 | Bad Request - Validation error |
| 401 | Unauthorized - Authentication required |
| 403 | Forbidden - Permission denied |
| 404 | Not Found - Resource not found |
| 500 | Internal Server Error |

---

## Error Response Format

```json
{
  "message": "Error message",
  "error": "error_code",
  "details": {
    "field_name": ["Field-specific error"]
  }
}
```

---

## Query Parameters

### Task Filtering

- `status`: Filter by status (`Not Started`, `In Progress`, `Completed`)
- `priority`: Filter by priority (`Extreme`, `Moderate`, `Low`)
- `search`: Search in title and description
- `ordering`: Sort by field (`-created_at`, `priority`, `status`)
- `page`: Page number (for pagination)
- `page_size`: Items per page (default: 20)

**Example:**
```
GET /todos?status=In Progress&priority=Extreme&ordering=-created_at&page=1&page_size=10
```

---

## File Upload

- **Max Size**: 5MB
- **Allowed Types**: JPEG, PNG, GIF, WebP
- **Content-Type**: `multipart/form-data`
- **Field Name**: `image`

---

## Frontend Integration

### Using the API Service

```javascript
import { todoAPI, userAPI } from './services/api';

// Get all tasks
const tasks = await todoAPI.getAll();

// Create task
const newTask = await todoAPI.create({
  title: "New Task",
  description: "Description",
  priority: "Moderate",
  status: "Not Started"
});

// Update task
const updated = await todoAPI.update(taskId, {
  status: "In Progress"
});

// Delete task
await todoAPI.delete(taskId);

// Get current user
const user = await userAPI.getCurrentUser();
```

### Using the useAPI Hook

```javascript
import { useAPI } from './hooks/useAPI';
import { todoAPI } from './services/api';

function MyComponent() {
  const { loading, error, execute } = useAPI();

  const handleCreateTask = async () => {
    try {
      const task = await execute(
        () => todoAPI.create(taskData),
        'Task created successfully!'
      );
      // Handle success
    } catch (err) {
      // Error is already handled by interceptor
    }
  };

  return (
    <button onClick={handleCreateTask} disabled={loading}>
      {loading ? 'Creating...' : 'Create Task'}
    </button>
  );
}
```

---

## Environment Variables

Create a `.env` file:

```env
VITE_API_BASE_URL=http://localhost:8000/api
VITE_APP_ENV=development
```

---

## Testing with cURL

```bash
# Login
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "testuser", "password": "testpass"}'

# Get Tasks
curl -X GET http://localhost:8000/api/todos \
  -H "Authorization: Bearer YOUR_TOKEN"

# Create Task
curl -X POST http://localhost:8000/api/todos \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "title=New Task" \
  -F "description=Description" \
  -F "priority=Moderate" \
  -F "status=Not Started" \
  -F "image=@/path/to/image.jpg"
```

---

For complete documentation, see [BACKEND_API_DOCUMENTATION.md](./BACKEND_API_DOCUMENTATION.md).

