
import React, { useEffect, useState } from 'react';
import { Bell, Check, CircleDot } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import NotificationHandler, { Notification } from '@/utils/notificationHandler';
import { format } from 'date-fns';

const NotificationCenter: React.FC = () => {
  const { currentUser } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);
  
  useEffect(() => {
    if (!currentUser) return;
    
    const notificationHandler = NotificationHandler.getInstance();
    
    // Connect to WebSocket for real-time notifications
    notificationHandler.connectWebSocket(currentUser.id);
    
    // Subscribe to notifications
    const unsubscribe = notificationHandler.subscribe((updatedNotifications) => {
      setNotifications(updatedNotifications);
      setUnreadCount(notificationHandler.getUnreadCount());
    });
    
    // Initialize notifications
    setNotifications(notificationHandler.getNotifications());
    setUnreadCount(notificationHandler.getUnreadCount());
    
    return () => {
      unsubscribe();
      notificationHandler.disconnectWebSocket();
    };
  }, [currentUser]);
  
  const handleMarkAsRead = (id: string) => {
    const notificationHandler = NotificationHandler.getInstance();
    notificationHandler.markAsRead(id);
  };
  
  const handleMarkAllAsRead = () => {
    const notificationHandler = NotificationHandler.getInstance();
    notificationHandler.markAllAsRead();
    setOpen(false);
  };

  const formatTime = (timestamp: string) => {
    try {
      return format(new Date(timestamp), 'MMM d, h:mm a');
    } catch (e) {
      return 'Invalid date';
    }
  };
  
  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read) {
      handleMarkAsRead(notification.id);
    }
    
    if (notification.actionUrl) {
      window.location.href = notification.actionUrl;
    }
    
    setOpen(false);
  };
  
  return (
    <div>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <Badge 
                className="absolute -top-1 -right-1 px-1.5 py-0.5 text-xs min-w-4 h-4 bg-red-500 text-white"
              >
                {unreadCount > 99 ? '99+' : unreadCount}
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-0" align="end">
          <div className="flex items-center justify-between p-4 border-b">
            <h4 className="font-medium">Notifications</h4>
            {unreadCount > 0 && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleMarkAllAsRead}
                className="text-xs h-8"
              >
                <Check className="mr-1 h-3 w-3" />
                Mark all as read
              </Button>
            )}
          </div>
          
          <ScrollArea className="h-[300px]">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full p-4 text-center text-muted-foreground">
                <p>No notifications yet</p>
                <p className="text-sm">You'll see updates here when you receive notifications</p>
              </div>
            ) : (
              <div>
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 cursor-pointer ${notification.read ? '' : 'bg-secondary/20'}`}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <h5 className="font-medium text-sm flex items-center">
                        {!notification.read && (
                          <CircleDot className="h-3 w-3 mr-1 text-primary" />
                        )}
                        {notification.title}
                      </h5>
                      <span className="text-xs text-muted-foreground">
                        {formatTime(notification.timestamp)}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {notification.message}
                    </p>
                    <Separator className="mt-3" />
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default NotificationCenter;
