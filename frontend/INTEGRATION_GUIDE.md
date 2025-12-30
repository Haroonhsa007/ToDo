# Frontend-Backend Integration Guide

This guide explains how the frontend is integrated with the Django backend API.

## Environment Setup

Create a `.env` file in the `frontend/` directory with the following:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:8000/api/v1

# Environment
VITE_APP_ENV=development
```

## API Integration

### Authentication Flow

1. **Registration**: User registers → Backend returns JWT tokens → Tokens stored in localStorage
2. **Login**: User logs in → Backend returns JWT tokens → Tokens stored in localStorage
3. **API Requests**: All authenticated requests include `Authorization: Bearer <token>` header
4. **Token Refresh**: On 401 error, axios interceptor automatically refreshes token using refresh token
5. **Logout**: Tokens cleared from localStorage

### API Service Structure

The frontend uses a centralized API service (`src/services/api.js`) with the following modules:

- **userAPI**: Authentication and user management
- **todoAPI**: Task CRUD operations and statistics
- **categoryAPI**: Category management

### Key Integration Points

#### 1. Authentication Context (`src/contexts/AuthContext.jsx`)

- Manages global authentication state
- Provides `login`, `register`, `logout` functions
- Automatically checks authentication on app load
- Used throughout the app via `useAuth()` hook

#### 2. Axios Configuration (`src/services/axios.js`)

- Base URL: `http://localhost:8000/api/v1`
- Automatic token injection in request headers
- Automatic token refresh on 401 errors
- Error handling with toast notifications

#### 3. Pages Integration

- **Login**: Integrated with `userAPI.login()`
- **Register**: Integrated with `userAPI.register()`
- **Dashboard**: Fetches tasks and statistics using `todoAPI`
- **AddTask**: Creates tasks using `todoAPI.create()`

## API Endpoints Used

### Authentication
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/refresh` - Token refresh

### User Management
- `GET /api/v1/users/me` - Get current user
- `PUT /api/v1/users/profile` - Update profile
- `POST /api/v1/users/change-password` - Change password

### Tasks
- `GET /api/v1/todos/` - List tasks (with filters)
- `POST /api/v1/todos/` - Create task
- `GET /api/v1/todos/{id}/` - Get task
- `PUT /api/v1/todos/{id}/` - Update task
- `DELETE /api/v1/todos/{id}/` - Delete task
- `GET /api/v1/todos/statistics/` - Get statistics

### Categories
- `GET /api/v1/categories/` - List categories
- `POST /api/v1/categories/` - Create category
- `PUT /api/v1/categories/{id}/` - Update category
- `DELETE /api/v1/categories/{id}/` - Delete category

## Data Flow

1. **User Action** → Component calls API service function
2. **API Service** → Makes HTTP request via axios
3. **Axios Interceptor** → Adds auth token to headers
4. **Backend** → Processes request, returns response
5. **Axios Interceptor** → Handles errors, refreshes tokens if needed
6. **Component** → Updates UI with response data

## Error Handling

- Network errors: Toast notification
- 401 Unauthorized: Automatic token refresh or redirect to login
- 400 Bad Request: Shows validation errors
- 500 Server Error: Shows generic error message

## Testing the Integration

1. Start backend: `cd backend && python manage.py runserver`
2. Start frontend: `cd frontend && npm run dev`
3. Register a new user
4. Login with credentials
5. Create tasks and verify they appear in dashboard
6. Check browser console for API requests/responses

## Troubleshooting

### CORS Errors
- Ensure backend CORS is configured for `http://localhost:5173`
- Check `backend/core/settings.py` CORS_ALLOWED_ORIGINS

### 401 Errors
- Check if token is stored in localStorage
- Verify token format: `Bearer <token>`
- Check token expiration (60 minutes for access token)

### Network Errors
- Verify backend is running on port 8000
- Check API_BASE_URL in `.env` file
- Verify database connection

### Data Not Loading
- Check browser console for errors
- Verify API endpoints match backend routes
- Check network tab for request/response details

