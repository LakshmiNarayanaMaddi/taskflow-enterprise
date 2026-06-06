import { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useQuery, useMutation, useQueryClient }
  from '@tanstack/react-query';
import { notificationsApi } from '../../api/notifications';
import useWebSocket from '../../hooks/useWebSocket';
import { Bell, Check, CheckCheck, X } from 'lucide-react';

const NotificationBell = () => {
  const { user }        = useSelector(state => state.auth);
  const queryClient     = useQueryClient();
  const [open, setOpen] = useState(false);

  // Fetch all notifications
  const { data: notifications = [] } = useQuery({
    queryKey: ['notifications', user?.userId],
    queryFn:  () => notificationsApi.getAll(user?.userId),
    enabled:  !!user?.userId,
    refetchInterval: 30000,
  });

  // Fetch unread count
  const { data: unreadData } = useQuery({
    queryKey: ['unread-count', user?.userId],
    queryFn:  () => notificationsApi.getUnreadCount(user?.userId),
    enabled:  !!user?.userId,
    refetchInterval: 15000,
  });

  const unreadCount = unreadData?.count || 0;

  // Mark all as read mutation
  const markAllMutation = useMutation({
    mutationFn: () =>
      notificationsApi.markAllAsRead(user?.userId),
    onSuccess: () => {
      queryClient.invalidateQueries(
        ['notifications', user?.userId]);
      queryClient.invalidateQueries(
        ['unread-count', user?.userId]);
    },
  });

  // Handle real-time WebSocket notification
  const handleNewNotification = useCallback((notification) => {
    queryClient.invalidateQueries(
      ['notifications', user?.userId]);
    queryClient.invalidateQueries(
      ['unread-count', user?.userId]);
  }, [queryClient, user?.userId]);

  // Connect to WebSocket
  useWebSocket(user?.userId, handleNewNotification);

  // Mark all as read when opening dropdown
  const handleOpen = () => {
    setOpen(!open);
    if (!open && unreadCount > 0) {
      markAllMutation.mutate();
    }
  };

  const getNotificationIcon = (type) => {
    const icons = {
      TASK_ASSIGNED:       '📋',
      TASK_STATUS_CHANGED: '🔄',
      PROJECT_INVITATION:  '📁',
      COMMENT_ADDED:       '💬',
      MENTION:             '@',
      SYSTEM:              '🔔',
    };
    return icons[type] || '🔔';
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now  = new Date();
    const diff = now - date;
    const mins = Math.floor(diff / 60000);
    const hrs  = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (mins < 1)  return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    if (hrs < 24)  return `${hrs}h ago`;
    return `${days}d ago`;
  };

  return (
    <div className="relative">

      {/* Bell button */}
      <button
        onClick={handleOpen}
        className="relative p-2 text-gray-500
                   hover:text-gray-700 hover:bg-gray-100
                   rounded-lg transition-colors"
      >
        <Bell size={20} />

        {/* Unread badge */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1
                           bg-red-500 text-white text-xs
                           font-bold rounded-full
                           min-w-[18px] h-[18px]
                           flex items-center justify-center
                           px-1">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
          />

          {/* Notification panel */}
          <div className="absolute right-0 top-12 w-96
                          bg-white rounded-2xl shadow-xl
                          border border-gray-200 z-50
                          overflow-hidden">

            {/* Header */}
            <div className="flex items-center justify-between
                            px-4 py-3 border-b border-gray-100">
              <h3 className="font-semibold text-gray-900">
                Notifications
              </h3>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={() => markAllMutation.mutate()}
                    className="text-xs text-primary-600
                               hover:text-primary-700
                               flex items-center gap-1"
                  >
                    <CheckCheck size={13} />
                    Mark all read
                  </button>
                )}
                <button
                  onClick={() => setOpen(false)}
                  className="p-1 hover:bg-gray-100 rounded-lg"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Notification list */}
            <div className="max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-8 text-center">
                  <Bell size={32}
                        className="text-gray-300 mx-auto mb-2" />
                  <p className="text-sm text-gray-400">
                    No notifications yet
                  </p>
                </div>
              ) : (
                notifications.map(notification => (
                  <div
                    key={notification.id}
                    className={`
                      px-4 py-3 border-b border-gray-50
                      hover:bg-gray-50 transition-colors
                      ${!notification.read
                        ? 'bg-blue-50 hover:bg-blue-50'
                        : ''}
                    `}
                  >
                    <div className="flex gap-3">
                      {/* Icon */}
                      <div className="w-9 h-9 rounded-full
                                      bg-gray-100 flex items-center
                                      justify-center flex-shrink-0
                                      text-base">
                        {getNotificationIcon(notification.type)}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium
                                      text-gray-900 mb-0.5">
                          {notification.title}
                        </p>
                        <p className="text-xs text-gray-500
                                      line-clamp-2">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {formatTime(notification.createdAt)}
                        </p>
                      </div>

                      {/* Unread dot */}
                      {!notification.read && (
                        <div className="w-2 h-2 bg-primary-500
                                        rounded-full flex-shrink-0
                                        mt-1.5" />
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="px-4 py-3 border-t border-gray-100
                              text-center">
                <p className="text-xs text-gray-400">
                  {notifications.length} total notifications
                </p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default NotificationBell;