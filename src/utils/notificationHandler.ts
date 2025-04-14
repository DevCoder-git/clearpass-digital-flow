
import { toast } from "sonner";

export enum NotificationType {
  REQUEST_APPROVED = "request_approved",
  REQUEST_REJECTED = "request_rejected",
  REQUEST_SUBMITTED = "request_submitted",
  REMINDER = "reminder",
  SYSTEM = "system"
}

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
}

class NotificationHandler {
  private static instance: NotificationHandler;
  private notifications: Notification[] = [];
  private listeners: Array<(notifications: Notification[]) => void> = [];
  private socket: WebSocket | null = null;

  private constructor() {
    // Load saved notifications from localStorage
    const savedNotifications = localStorage.getItem('clearpass_notifications');
    if (savedNotifications) {
      this.notifications = JSON.parse(savedNotifications);
    }
  }

  public static getInstance(): NotificationHandler {
    if (!NotificationHandler.instance) {
      NotificationHandler.instance = new NotificationHandler();
    }
    return NotificationHandler.instance;
  }

  public connectWebSocket(userId: string): void {
    try {
      // In a real implementation, this would connect to a WebSocket server
      // For now, we'll simulate notifications with a timeout
      console.log(`WebSocket would connect for user ${userId}`);
      
      // Simulate periodic notifications for demo purposes
      setInterval(() => {
        const randomTypes = [
          NotificationType.REQUEST_APPROVED,
          NotificationType.REQUEST_REJECTED,
          NotificationType.REMINDER,
        ];
        const randomType = randomTypes[Math.floor(Math.random() * randomTypes.length)];
        
        if (Math.random() > 0.7) { // Only show notifications sometimes
          this.addNotification({
            id: Date.now().toString(),
            type: randomType,
            title: this.getDefaultTitleForType(randomType),
            message: this.getDefaultMessageForType(randomType),
            timestamp: new Date().toISOString(),
            read: false
          });
        }
      }, 60000); // Every minute
    } catch (error) {
      console.error("Error connecting to WebSocket:", error);
    }
  }

  public disconnectWebSocket(): void {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }

  private getDefaultTitleForType(type: NotificationType): string {
    switch (type) {
      case NotificationType.REQUEST_APPROVED:
        return "Clearance Approved";
      case NotificationType.REQUEST_REJECTED:
        return "Clearance Rejected";
      case NotificationType.REQUEST_SUBMITTED:
        return "Clearance Submitted";
      case NotificationType.REMINDER:
        return "Clearance Reminder";
      case NotificationType.SYSTEM:
        return "System Notification";
      default:
        return "Notification";
    }
  }

  private getDefaultMessageForType(type: NotificationType): string {
    switch (type) {
      case NotificationType.REQUEST_APPROVED:
        return "Your clearance request has been approved by a department.";
      case NotificationType.REQUEST_REJECTED:
        return "Your clearance request has been rejected. Please review the comments.";
      case NotificationType.REQUEST_SUBMITTED:
        return "Your clearance request has been successfully submitted.";
      case NotificationType.REMINDER:
        return "You have pending clearance requests that require your attention.";
      case NotificationType.SYSTEM:
        return "System update: The clearance system has been updated.";
      default:
        return "You have a new notification.";
    }
  }

  public addNotification(notification: Notification): void {
    this.notifications.unshift(notification);
    
    // Limit to 50 notifications
    if (this.notifications.length > 50) {
      this.notifications = this.notifications.slice(0, 50);
    }
    
    // Save to localStorage
    localStorage.setItem('clearpass_notifications', JSON.stringify(this.notifications));
    
    // Notify listeners
    this.notifyListeners();
    
    // Show toast notification
    toast(notification.title, {
      description: notification.message,
      action: notification.actionUrl ? {
        label: "View",
        onClick: () => {
          window.location.href = notification.actionUrl || "#";
        },
      } : undefined,
    });
  }

  public getNotifications(): Notification[] {
    return [...this.notifications];
  }

  public getUnreadCount(): number {
    return this.notifications.filter(n => !n.read).length;
  }

  public markAsRead(id: string): void {
    const index = this.notifications.findIndex(n => n.id === id);
    if (index !== -1) {
      this.notifications[index].read = true;
      localStorage.setItem('clearpass_notifications', JSON.stringify(this.notifications));
      this.notifyListeners();
    }
  }

  public markAllAsRead(): void {
    this.notifications = this.notifications.map(n => ({ ...n, read: true }));
    localStorage.setItem('clearpass_notifications', JSON.stringify(this.notifications));
    this.notifyListeners();
  }

  public subscribe(listener: (notifications: Notification[]) => void): () => void {
    this.listeners.push(listener);
    
    // Return unsubscribe function
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => {
      listener([...this.notifications]);
    });
  }
}

export default NotificationHandler;
