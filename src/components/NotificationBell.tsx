
import { useState, useEffect } from 'react';
import { Bell, X } from 'lucide-react';
import { Notification } from '../types';

const NotificationBell = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const stored = localStorage.getItem('reelzone_notifications');
    if (stored) {
      const parsedNotifications = JSON.parse(stored);
      setNotifications(parsedNotifications);
      setUnreadCount(parsedNotifications.filter((n: Notification) => !n.read).length);
    }

    // Listener para novas notificações
    const handleNewNotification = () => {
      const stored = localStorage.getItem('reelzone_notifications');
      if (stored) {
        const parsedNotifications = JSON.parse(stored);
        setNotifications(parsedNotifications);
        setUnreadCount(parsedNotifications.filter((n: Notification) => !n.read).length);
      }
    };

    window.addEventListener('newNotification', handleNewNotification);
    return () => window.removeEventListener('newNotification', handleNewNotification);
  }, []);

  const markAsRead = (id: string) => {
    const updatedNotifications = notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    );
    setNotifications(updatedNotifications);
    localStorage.setItem('reelzone_notifications', JSON.stringify(updatedNotifications));
    setUnreadCount(updatedNotifications.filter(n => !n.read).length);
  };

  const markAllAsRead = () => {
    const updatedNotifications = notifications.map(n => ({ ...n, read: true }));
    setNotifications(updatedNotifications);
    localStorage.setItem('reelzone_notifications', JSON.stringify(updatedNotifications));
    setUnreadCount(0);
  };

  const clearNotification = (id: string) => {
    const updatedNotifications = notifications.filter(n => n.id !== id);
    setNotifications(updatedNotifications);
    localStorage.setItem('reelzone_notifications', JSON.stringify(updatedNotifications));
    setUnreadCount(updatedNotifications.filter(n => !n.read).length);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="glass-card p-3 smooth-transition hover-glow press-effect rounded-xl relative"
        aria-label="Notificações"
      >
        <Bell className="w-5 h-5 text-foreground" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute top-14 right-0 glass-modal p-4 rounded-2xl min-w-[320px] max-w-[400px] z-50 max-h-[400px] overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Notificações</h3>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-xs text-primary hover:text-primary/80"
              >
                Marcar todas como lidas
              </button>
            )}
          </div>

          <div className="space-y-2 max-h-[300px] overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="text-muted-foreground text-sm text-center py-4">
                Nenhuma notificação
              </p>
            ) : (
              notifications.slice(0, 10).map((notification) => (
                <div
                  key={notification.id}
                  className={`p-3 rounded-lg border ${
                    notification.read 
                      ? 'bg-muted/10 border-muted/20' 
                      : 'bg-primary/10 border-primary/20'
                  } smooth-transition`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <p className="text-sm">{notification.message}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(notification.timestamp).toLocaleString('pt-BR')}
                      </p>
                    </div>
                    <button
                      onClick={() => clearNotification(notification.id)}
                      className="text-muted-foreground hover:text-foreground smooth-transition"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  {!notification.read && (
                    <button
                      onClick={() => markAsRead(notification.id)}
                      className="text-xs text-primary hover:text-primary/80 mt-2"
                    >
                      Marcar como lida
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
