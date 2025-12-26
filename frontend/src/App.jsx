import { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { Sidebar } from './components/layout/Sidebar';
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

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentPage, setCurrentPage] = useState('Dashboard');
  const [showRegister, setShowRegister] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showAddTask, setShowAddTask] = useState(false);
  const [showEditTask, setShowEditTask] = useState(false);
  const [showViewTask, setShowViewTask] = useState(false);
  const [showCreateCategory, setShowCreateCategory] = useState(false);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentPage('Dashboard');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'Dashboard':
        return <Dashboard onNavigate={setCurrentPage} />;
      case 'My Task':
        return <MyTask />;
      case 'Task Categories':
        return <TaskCategories />;
      case 'Vital Task':
        return <Vitals />;
      case 'Account Info':
        return <AccountInfo />;
      case 'Change Password':
        return <ChangePassword />;
      case 'Notifications':
        return <Notifications />;
      case 'Calendar':
        return <Calendar />;
      case 'Settings':
        return (
          <div className="flex-1 bg-white min-h-screen overflow-y-auto">
            <header className="bg-white border-b border-neutral-border px-8 py-6">
              <h1 className="text-3xl font-bold text-neutral-text">Settings</h1>
            </header>
            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
                <button
                  onClick={() => setCurrentPage('Account Info')}
                  className="bg-white rounded-2xl p-6 shadow-soft border border-neutral-border/20 hover:shadow-medium transition-shadow text-left"
                >
                  <h3 className="font-semibold text-lg text-neutral-text mb-2">Account Information</h3>
                  <p className="text-neutral-text-light text-sm">Update your profile information</p>
                </button>
                <button
                  onClick={() => setCurrentPage('Change Password')}
                  className="bg-white rounded-2xl p-6 shadow-soft border border-neutral-border/20 hover:shadow-medium transition-shadow text-left"
                >
                  <h3 className="font-semibold text-lg text-neutral-text mb-2">Change Password</h3>
                  <p className="text-neutral-text-light text-sm">Update your account password</p>
                </button>
              </div>
            </div>
          </div>
        );
      case 'Help':
        return (
          <div className="flex-1 bg-white min-h-screen overflow-y-auto p-8">
            <h1 className="text-3xl font-bold text-neutral-text mb-6">Help & Support</h1>
            <div className="max-w-4xl space-y-6">
              <div className="bg-white rounded-2xl p-6 shadow-soft border border-neutral-border/20">
                <h2 className="text-xl font-semibold text-neutral-text mb-4">Getting Started</h2>
                <p className="text-neutral-text-light">
                  Welcome to the Task Management System! This guide will help you get started with managing your tasks efficiently.
                </p>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-soft border border-neutral-border/20">
                <h2 className="text-xl font-semibold text-neutral-text mb-4">FAQs</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-neutral-text mb-2">How do I create a task?</h3>
                    <p className="text-neutral-text-light">Click on the "Add Task" button in the Dashboard or My Tasks page.</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-neutral-text mb-2">How do I organize tasks?</h3>
                    <p className="text-neutral-text-light">You can create categories and assign tasks to them for better organization.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return <Dashboard />;
    }
  };

  if (!isAuthenticated) {
    if (showRegister) {
      return (
        <>
          <Toaster position="top-right" />
          <Register
            onRegister={handleLogin}
            onBack={() => setShowRegister(false)}
          />
        </>
      );
    }
    return (
      <>
        <Toaster position="top-right" />
        <Login
          onLogin={handleLogin}
          onShowRegister={() => setShowRegister(true)}
        />
      </>
    );
  }

  // Handle modal pages
  if (showAddTask) {
    return (
      <>
        <Toaster position="top-right" />
        <div className="flex h-screen overflow-hidden">
          <Sidebar activeItem={currentPage} onNavigate={setCurrentPage} />
          <AddTask onBack={() => setShowAddTask(false)} />
        </div>
      </>
    );
  }

  if (showEditTask && selectedTask) {
    return (
      <>
        <Toaster position="top-right" />
        <div className="flex h-screen overflow-hidden">
          <Sidebar activeItem={currentPage} onNavigate={setCurrentPage} />
          <EditTask task={selectedTask} onBack={() => { setShowEditTask(false); setSelectedTask(null); }} />
        </div>
      </>
    );
  }

  if (showViewTask && selectedTask) {
    return (
      <>
        <Toaster position="top-right" />
        <div className="flex h-screen overflow-hidden">
          <Sidebar activeItem={currentPage} onNavigate={setCurrentPage} />
          <ViewTask
            task={selectedTask}
            onBack={() => { setShowViewTask(false); setSelectedTask(null); }}
            onEdit={() => { setShowViewTask(false); setShowEditTask(true); }}
            onDelete={() => { setShowViewTask(false); setSelectedTask(null); }}
          />
        </div>
      </>
    );
  }

  if (showCreateCategory) {
    return (
      <>
        <Toaster position="top-right" />
        <div className="flex h-screen overflow-hidden">
          <Sidebar activeItem={currentPage} onNavigate={setCurrentPage} />
          <CreateCategories onBack={() => setShowCreateCategory(false)} />
        </div>
      </>
    );
  }

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
      <div className="flex h-screen overflow-hidden">
        <Sidebar
          activeItem={currentPage}
          onNavigate={setCurrentPage}
          onLogout={handleLogout}
        />
        {renderPage()}
      </div>
    </>
  );
}

export default App;
