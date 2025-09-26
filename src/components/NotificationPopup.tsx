// components/NotificationPopup.tsx
import React from 'react';
import { useNotifications } from '../context/NotificationContext';
import { FiCheck, FiAlertTriangle, FiInfo, FiX, FiAlertCircle } from 'react-icons/fi';
import { miniApp } from '@telegram-apps/sdk-react';

const NotificationPopup: React.FC = () => {
  const { notifications, removeNotification } = useNotifications();

  // ** Move TMA to Notification Provider ** //
  const TMA = miniApp.ready.isAvailable();
  // ** Move TMA to Notification Provider ** //

  const getIcon = (type: string) => {
    switch (type) {
      case 'success': return <FiCheck className="w-5 h-5" />;
      case 'error': return <FiAlertCircle className="w-5 h-5" />;
      case 'warning': return <FiAlertTriangle className="w-5 h-5" />;
      default: return <FiInfo className="w-5 h-5" />;
    }
  };

  const getColor = (type: string) => {
    switch (type) {
      case 'success': return 'bg-blue-100 border-blue-400 text-blue-700';
      case 'error': return 'bg-red-100 border-red-400 text-red-700';
      case 'warning': return 'bg-yellow-100 border-yellow-400 text-yellow-700';
      default: return 'bg-blue-100 border-blue-400 text-blue-700';
    }
  };

  return (
    <div className={`fixed ${!TMA ? "top-4" : "top-[calc(var(--tg-viewport-content-safe-area-inset-top)+48px)]"} right-4 z-50 space-y-3 w-80`}>
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`flex items-start p-4 rounded-lg border-l-4 ${getColor(notification.type)} shadow-lg transition-all duration-300 animate-fadeIn`}
        >
          <div className="mr-3 mt-0.5">
            {getIcon(notification.type)}
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium">{notification.message}</p>
          </div>
          <button
            onClick={() => removeNotification(notification.id)}
            className="ml-2 text-gray-500 hover:text-gray-700"
          >
            <FiX className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};

export default NotificationPopup;