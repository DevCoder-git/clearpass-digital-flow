
import { ClearanceStatus } from '@/components/shared/StatusBadge';
import NotificationHandler, { NotificationType } from './notificationHandler';

export interface ReminderConfig {
  enabled: boolean;
  studentReminders: boolean;
  departmentReminders: boolean;
  reminderInterval: number; // in days
}

export interface PendingRequest {
  id: string;
  studentId: string;
  studentName: string;
  departmentId: string;
  departmentName: string;
  requestDate: string;
  status: ClearanceStatus;
}

class ReminderService {
  private static instance: ReminderService;
  private config: ReminderConfig = {
    enabled: true,
    studentReminders: true,
    departmentReminders: true,
    reminderInterval: 3 // days
  };
  private notificationHandler = NotificationHandler.getInstance();
  private checkInterval: number | null = null;

  private constructor() {
    // Load config from localStorage
    const savedConfig = localStorage.getItem('clearpass_reminder_config');
    if (savedConfig) {
      this.config = { ...this.config, ...JSON.parse(savedConfig) };
    }
  }

  public static getInstance(): ReminderService {
    if (!ReminderService.instance) {
      ReminderService.instance = new ReminderService();
    }
    return ReminderService.instance;
  }

  public startReminderService(): void {
    if (!this.config.enabled) return;
    
    // Clear any existing interval
    if (this.checkInterval) {
      window.clearInterval(this.checkInterval);
    }
    
    // Check for pending requests that need reminders
    this.checkForPendingRequests();
    
    // Set interval to check periodically (every 12 hours in a real implementation)
    // For demo purposes, we'll use a shorter interval
    this.checkInterval = window.setInterval(() => {
      this.checkForPendingRequests();
    }, 60000 * 10); // Every 10 minutes for demo
  }

  public stopReminderService(): void {
    if (this.checkInterval) {
      window.clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
  }

  public updateConfig(newConfig: Partial<ReminderConfig>): void {
    this.config = { ...this.config, ...newConfig };
    localStorage.setItem('clearpass_reminder_config', JSON.stringify(this.config));
    
    // Restart the service if necessary
    if (this.config.enabled) {
      this.startReminderService();
    } else {
      this.stopReminderService();
    }
  }

  public getConfig(): ReminderConfig {
    return { ...this.config };
  }

  private checkForPendingRequests(): void {
    // In a real implementation, this would fetch pending requests from the backend
    // For demo purposes, we'll simulate it
    
    // Simulate fetching pending requests
    const now = new Date();
    const threeDaysAgo = new Date(now.getTime() - (this.config.reminderInterval * 24 * 60 * 60 * 1000));
    
    // Only send reminders for requests older than the reminder interval
    // In a real implementation, this would be checked against the database
    
    // Simulate sending reminders
    if (Math.random() > 0.7) {
      // Simulate a student reminder
      if (this.config.studentReminders) {
        this.notificationHandler.addNotification({
          id: `reminder-student-${Date.now()}`,
          type: NotificationType.REMINDER,
          title: "Clearance Status Reminder",
          message: "You have pending clearance requests. Please check their status.",
          timestamp: new Date().toISOString(),
          read: false,
          actionUrl: "/dashboard/requests"
        });
      }
      
      // Simulate a department reminder
      if (this.config.departmentReminders) {
        this.notificationHandler.addNotification({
          id: `reminder-department-${Date.now()}`,
          type: NotificationType.REMINDER,
          title: "Pending Approvals Reminder",
          message: "You have clearance requests awaiting your approval.",
          timestamp: new Date().toISOString(),
          read: false,
          actionUrl: "/dashboard/requests"
        });
      }
    }
  }
}

export default ReminderService;
