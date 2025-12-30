import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Layout } from './components/layout/Layout';
import { Dashboard } from './pages/Dashboard';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { MyTask } from './pages/MyTask';
import { TaskCategories } from './pages/TaskCategories';
import { Vitals } from './pages/Vitals';
import { AccountInfo } from './pages/AccountInfo';
import { ChangePassword } from './pages/ChangePassword';
import { AddTask } from './pages/AddTask';
import { EditTask } from './pages/EditTask';
import { ViewTask } from './pages/ViewTask';
import { Notifications } from './pages/Notifications';
import { Calendar } from './pages/Calendar';
import { CreateCategories } from './pages/CreateCategories';
import { Settings } from './pages/Settings';
import { Help } from './pages/Help';

// Protected Route Component
function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function AppRoutes() {
  const { isAuthenticated, logout } = useAuth();

  return (
    <>
      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#04C400',
              secondary: '#fff',
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: '#FF6767',
              secondary: '#fff',
            },
          },
        }}
      />
      <Routes>
        {/* Public Routes */}
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Login />
            )
          }
        />
        <Route
          path="/register"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Register />
            )
          }
        />

        {/* Protected Routes */}
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <Layout onLogout={logout}>
                <Routes>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/my-task" element={<MyTask />} />
                  <Route path="/vital-task" element={<Vitals />} />
                  <Route path="/categories" element={<TaskCategories />} />
                  <Route path="/notifications" element={<Notifications />} />
                  <Route path="/calendar" element={<Calendar />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/help" element={<Help />} />
                  <Route path="/account-info" element={<AccountInfo />} />
                  <Route path="/change-password" element={<ChangePassword />} />
                  <Route path="/add-task" element={<AddTask />} />
                  <Route path="/edit-task" element={<EditTask />} />
                  <Route path="/view-task" element={<ViewTask />} />
                  <Route path="/create-category" element={<CreateCategories />} />
                  <Route path="/" element={<Navigate to="/dashboard" replace />} />
                  <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Routes>
              </Layout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
