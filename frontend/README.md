# ToDo Frontend (React + Tailwind CSS)

A professional, scalable React application for the ToDo list platform, built with modern tools and best practices and wired to a Django REST backend (with Unfold admin and Django Control Room for operations).

## Features

- ⚡ **Vite** - Fast build tool and development server
- ⚛️ **React 19** - Latest version of React
- 🎨 **Tailwind CSS v4** - Latest Tailwind with new PostCSS plugin
- 🌐 **Axios** - HTTP client with interceptors for API calls
- 🔔 **React Hot Toast** - Beautiful toast notifications
- 📏 **ESLint** - Code linting for consistent code quality
- 💅 **Prettier** - Code formatting
- 🔧 **Custom Hooks** - Reusable React hooks (useAPI, useLocalStorage)
- 📁 **Organized Structure** - Scalable folder organization
- 🎯 **VSCode Integration** - Recommended extensions and settings

## Project Structure

```
src/
├── assets/          # Static assets (images, icons, etc.)
├── components/      # React components
│   ├── common/      # Reusable UI components
│   ├── features/    # Feature-specific components
│   └── layout/      # Layout components (Header, Footer, etc.)
├── constants/       # App constants and configuration
├── hooks/           # Custom React hooks
├── pages/           # Page components
├── services/        # API services and external integrations
├── store/           # State management (Redux, Zustand, etc.)
├── styles/          # Global styles and Tailwind customizations
├── types/           # TypeScript types (if using TypeScript)
└── utils/           # Utility functions
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create environment file:
```bash
cp .env.example .env
```

3. Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors automatically
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting

## Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=http://localhost:8000/api/v1
VITE_APP_ENV=development
```

**Note**: See [BACKEND_API_DOCUMENTATION.md](./BACKEND_API_DOCUMENTATION.md) for detailed backend requirements and API documentation.

## Code Quality

This project uses ESLint and Prettier to maintain code quality:

- ESLint configuration: `eslint.config.js`
- Prettier configuration: `.prettierrc`
- Editor configuration: `.editorconfig`

### VSCode Setup

Install the recommended extensions:
- ESLint
- Prettier
- Tailwind CSS IntelliSense

The project includes VSCode settings for automatic formatting on save.

## Component Examples

### Button Component

```jsx
import { Button } from './components/common/Button';

<Button variant="primary" size="md" onClick={handleClick}>
  Click me
</Button>
```

Variants: `primary`, `secondary`, `outline`
Sizes: `sm`, `md`, `lg`

### Card Component

```jsx
import { Card } from './components/common/Card';

<Card className="custom-class">
  <h2>Card Title</h2>
  <p>Card content...</p>
</Card>
```

### Custom Hooks

#### useLocalStorage

```jsx
import { useLocalStorage } from './hooks/useLocalStorage';

const [value, setValue] = useLocalStorage('key', initialValue);
```

#### useAPI

```jsx
import { useAPI } from './hooks/useAPI';
import { todoAPI } from './services/api';

const { loading, error, execute } = useAPI();

const fetchData = async () => {
  await execute(
    () => todoAPI.getAll(),
    'Data fetched successfully!'
  );
};
```

## API Integration (Axios)

### Basic Usage

```jsx
import { api } from './services/api';

// GET request
const data = await api.get('/endpoint');

// POST request
const result = await api.post('/endpoint', { data });
```

### Using API Services

```jsx
import { todoAPI } from './services/api';

// Get all todos
const todos = await todoAPI.getAll();

// Create a todo
const newTodo = await todoAPI.create({ title: 'New Todo' });

// Update a todo
const updated = await todoAPI.update(id, { completed: true });

// Delete a todo
await todoAPI.delete(id);
```

### Axios Configuration

The Axios instance is pre-configured with:
- Base URL from environment variables
- Request/Response interceptors
- Automatic error handling with toast notifications
- Authentication token handling
- Request/Response logging in development mode

Configuration file: `src/services/axios.js`

## Toast Notifications

### Basic Usage

```jsx
import { showToast } from './utils/toast';

// Success toast
showToast.success('Operation successful!');

// Error toast
showToast.error('Something went wrong!');

// Loading toast
const toastId = showToast.loading('Processing...');
// Later dismiss it
showToast.dismiss(toastId);

// Promise toast
showToast.promise(
  asyncFunction(),
  {
    loading: 'Loading...',
    success: 'Success!',
    error: 'Failed!',
  }
);
```

### Toast with react-hot-toast

```jsx
import toast from 'react-hot-toast';

toast.success('Direct toast usage');
toast.error('Error message');
toast.loading('Loading...');
```

## Building for Production

1. Build the project:
```bash
npm run build
```

2. The production-ready files will be in the `dist` directory

3. Preview the build:
```bash
npm run preview
```

## Best Practices

1. **Component Organization**
   - Keep components small and focused
   - Use the `components/common` folder for reusable components
   - Use the `components/features` folder for feature-specific components

2. **Styling**
   - Use Tailwind utility classes
   - Create reusable variants for common patterns
   - Use the `cn()` utility for conditional classes

3. **State Management**
   - Use local state for component-specific data
   - Use custom hooks for shared logic
   - Consider Context API or state management libraries for global state

4. **Code Quality**
   - Run linting before committing: `npm run lint`
   - Format code: `npm run format`
   - Follow the ESLint rules

## Contributing

1. Create a feature branch
2. Make your changes
3. Run linting and formatting
4. Submit a pull request

## License

MIT
