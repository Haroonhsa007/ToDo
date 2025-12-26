import { useState } from 'react';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useAPI } from '../hooks/useAPI';
import { showToast } from '../utils/toast';
import { todoAPI } from '../services/api';

export function Home() {
  const [count, setCount] = useState(0);
  const [savedCount, setSavedCount] = useLocalStorage('count', 0);
  const { loading, execute } = useAPI();

  const handleSave = () => {
    setSavedCount(count);
    showToast.success('Count saved successfully!');
  };

  // Toast notification examples
  const showSuccessToast = () => {
    showToast.success('This is a success message!');
  };

  const showErrorToast = () => {
    showToast.error('This is an error message!');
  };

  const showLoadingToast = () => {
    const toastId = showToast.loading('Loading data...');
    setTimeout(() => {
      showToast.dismiss(toastId);
      showToast.success('Data loaded!');
    }, 2000);
  };

  const showPromiseToast = () => {
    const mockPromise = new Promise((resolve, reject) => {
      setTimeout(() => {
        Math.random() > 0.5 ? resolve('Success!') : reject('Failed!');
      }, 2000);
    });

    showToast.promise(mockPromise, {
      loading: 'Processing...',
      success: 'Operation completed!',
      error: 'Operation failed!',
    });
  };

  // API call example
  const fetchTodos = async () => {
    try {
      await execute(
        () => todoAPI.getAll(),
        'Todos fetched successfully!'
      );
    } catch (err) {
      // Error is already handled by the interceptor
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Welcome to Your React App
        </h1>
        <p className="text-lg text-gray-600">
          A professional, scalable React setup with Tailwind CSS
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Counter Example</h2>
          <div className="space-y-4">
            <p className="text-3xl font-bold text-blue-600">{count}</p>
            <div className="flex gap-2 flex-wrap">
              <Button onClick={() => setCount(count + 1)}>Increment</Button>
              <Button variant="secondary" onClick={() => setCount(count - 1)}>
                Decrement
              </Button>
              <Button variant="outline" onClick={() => setCount(0)}>
                Reset
              </Button>
            </div>
          </div>
        </Card>

        <Card>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">LocalStorage Hook</h2>
          <div className="space-y-4">
            <p className="text-gray-600">
              Saved count: <span className="font-bold text-blue-600">{savedCount}</span>
            </p>
            <Button onClick={handleSave}>Save Current Count</Button>
          </div>
        </Card>

        <Card>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Toast Notifications</h2>
          <div className="space-y-3">
            <p className="text-gray-600 text-sm mb-3">
              Click buttons to see different toast types
            </p>
            <div className="flex flex-col gap-2">
              <Button size="sm" onClick={showSuccessToast}>
                Success Toast
              </Button>
              <Button size="sm" variant="secondary" onClick={showErrorToast}>
                Error Toast
              </Button>
              <Button size="sm" variant="outline" onClick={showLoadingToast}>
                Loading Toast
              </Button>
              <Button size="sm" onClick={showPromiseToast}>
                Promise Toast
              </Button>
            </div>
          </div>
        </Card>

        <Card>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">API Integration</h2>
          <div className="space-y-4">
            <p className="text-gray-600 text-sm">
              Test Axios API calls with automatic error handling
            </p>
            <Button onClick={fetchTodos} disabled={loading}>
              {loading ? 'Loading...' : 'Fetch Todos (Demo)'}
            </Button>
            <p className="text-xs text-gray-500">
              Note: This will fail as no backend is configured. Check the network tab and
              toast notifications.
            </p>
          </div>
        </Card>
      </div>

      <Card>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Features Included</h2>
        <ul className="space-y-2 text-gray-700">
          <li className="flex items-start">
            <span className="text-green-500 mr-2">✓</span>
            <span>React 19 with Vite for fast development</span>
          </li>
          <li className="flex items-start">
            <span className="text-green-500 mr-2">✓</span>
            <span>Tailwind CSS for utility-first styling</span>
          </li>
          <li className="flex items-start">
            <span className="text-green-500 mr-2">✓</span>
            <span>ESLint & Prettier for code quality</span>
          </li>
          <li className="flex items-start">
            <span className="text-green-500 mr-2">✓</span>
            <span>Professional folder structure (components, hooks, utils, etc.)</span>
          </li>
          <li className="flex items-start">
            <span className="text-green-500 mr-2">✓</span>
            <span>Reusable components with Tailwind variants</span>
          </li>
          <li className="flex items-start">
            <span className="text-green-500 mr-2">✓</span>
            <span>Custom hooks for common patterns</span>
          </li>
          <li className="flex items-start">
            <span className="text-green-500 mr-2">✓</span>
            <span>Environment variables setup</span>
          </li>
          <li className="flex items-start">
            <span className="text-green-500 mr-2">✓</span>
            <span>VSCode configuration for optimal DX</span>
          </li>
          <li className="flex items-start">
            <span className="text-green-500 mr-2">✓</span>
            <span>Axios with interceptors for API calls</span>
          </li>
          <li className="flex items-start">
            <span className="text-green-500 mr-2">✓</span>
            <span>React Hot Toast for notifications</span>
          </li>
          <li className="flex items-start">
            <span className="text-green-500 mr-2">✓</span>
            <span>Custom API hooks with loading states</span>
          </li>
        </ul>
      </Card>
    </div>
  );
}
