import { useState } from 'react';
import { MdNotifications, MdCheckCircle, MdDelete } from 'react-icons/md';

export function Notifications() {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'New task assigned',
      message: 'You have been assigned a new task: "Landing Page Design"',
      time: '2 hours ago',
      read: false,
      type: 'task',
    },
    {
      id: 2,
      title: 'Task completed',
      message: 'Task "Walk the dog" has been marked as completed',
      time: '5 hours ago',
      read: false,
      type: 'success',
    },
    {
      id: 3,
      title: 'Reminder',
      message: 'Task "Attend Birthday Party" is due in 2 hours',
      time: '1 day ago',
      read: true,
      type: 'reminder',
    },
    {
      id: 4,
      title: 'Team update',
      message: 'New team member joined your project',
      time: '2 days ago',
      read: true,
      type: 'team',
    },
  ]);

  const markAsRead = id => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const deleteNotification = id => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 gap-3 sm:gap-0">
        <div className="flex items-center gap-2 sm:gap-3">
          <MdNotifications className="text-primary" size={24} className="sm:w-8 sm:h-8" />
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-neutral-text">Notifications</h1>
            {unreadCount > 0 && (
              <p className="text-xs sm:text-sm text-neutral-text-muted">{unreadCount} unread notifications</p>
            )}
          </div>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="px-3 sm:px-4 py-2 bg-primary text-white rounded-lg text-xs sm:text-sm font-medium hover:bg-primary-dark transition-colors w-full sm:w-auto"
          >
            Mark all as read
          </button>
        )}
      </div>

      {/* Main Content */}
      <div>
        {notifications.length === 0 ? (
          <div className="text-center py-12">
            <MdNotifications className="mx-auto text-neutral-text-muted mb-4" size={64} />
            <p className="text-neutral-text-muted text-lg">No notifications</p>
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4 max-w-4xl">
            {notifications.map(notification => (
              <div
                key={notification.id}
                className={`bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-soft border border-neutral-border/20 hover:shadow-medium transition-shadow ${
                  !notification.read ? 'border-l-4 border-l-primary' : ''
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg text-neutral-text">{notification.title}</h3>
                      {!notification.read && (
                        <span className="w-2 h-2 bg-primary rounded-full"></span>
                      )}
                    </div>
                    <p className="text-neutral-text-light mb-2">{notification.message}</p>
                    <p className="text-xs text-neutral-text-muted">{notification.time}</p>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    {!notification.read && (
                      <button
                        onClick={() => markAsRead(notification.id)}
                        className="p-2 text-neutral-text-muted hover:text-status-completed transition-colors"
                        title="Mark as read"
                      >
                        <MdCheckCircle size={20} />
                      </button>
                    )}
                    <button
                      onClick={() => deleteNotification(notification.id)}
                      className="p-2 text-neutral-text-muted hover:text-status-not-started transition-colors"
                      title="Delete"
                    >
                      <MdDelete size={20} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

