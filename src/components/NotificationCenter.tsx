/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { 
  Bell, 
  BellRing, 
  X, 
  TrendingUp, 
  AlertTriangle, 
  DollarSign,
  Calendar,
  Settings 
} from "lucide-react";

interface Notification {
  id: string;
  type: "budget" | "reminder" | "alert" | "tip";
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  priority: "low" | "medium" | "high";
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "alert",
    title: "Budget Overspend Alert",
    message: "You've exceeded your grocery budget by $45 this month.",
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    read: false,
    priority: "high"
  },
  {
    id: "2",
    type: "reminder",
    title: "Monthly Budget Review",
    message: "Time to review and plan your budget for next month.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    read: false,
    priority: "medium"
  },
  {
    id: "3",
    type: "tip",
    title: "Savings Tip",
    message: "Consider switching to generic brands to save 15-20% on groceries.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    read: true,
    priority: "low"
  },
  {
    id: "4",
    type: "budget",
    title: "Great Job!",
    message: "You're $120 under budget this month. Keep it up!",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48), // 2 days ago
    read: true,
    priority: "medium"
  }
];

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NotificationCenter({ isOpen, onClose }: NotificationCenterProps) {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [notificationSettings, setNotificationSettings] = useState({
    budgetAlerts: true,
    monthlyReminders: true,
    savingsTips: true,
    overspendWarnings: true,
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const dismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "alert": return <AlertTriangle className="h-5 w-5 text-warning" />;
      case "budget": return <DollarSign className="h-5 w-5 text-success" />;
      case "reminder": return <Calendar className="h-5 w-5 text-primary" />;
      case "tip": return <TrendingUp className="h-5 w-5 text-accent-foreground" />;
      default: return <Bell className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "border-l-4 border-l-destructive";
      case "medium": return "border-l-4 border-l-warning";
      case "low": return "border-l-4 border-l-success";
      default: return "";
    }
  };

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:relative lg:inset-auto">
      {/* Mobile overlay */}
      <div 
        className="fixed inset-0 bg-black/50 lg:hidden" 
        onClick={onClose}
      />
      
      {/* Notification panel */}
      <Card className="fixed right-0 top-0 h-full w-full max-w-md lg:relative lg:h-auto lg:max-h-[600px] overflow-hidden bg-card border-border shadow-card">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <div className="flex items-center gap-2">
              <BellRing className="h-6 w-6 text-primary" />
              <h3 className="text-senior-lg font-semibold text-foreground">
                Notifications
              </h3>
              {unreadCount > 0 && (
                <Badge className="bg-destructive text-destructive-foreground">
                  {unreadCount}
                </Badge>
              )}
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onClose}
              className="lg:hidden"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Actions */}
          <div className="p-4 border-b border-border">
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={markAllAsRead}
                disabled={unreadCount === 0}
                className="text-senior-sm"
              >
                Mark All Read
              </Button>
            </div>
          </div>

          {/* Notifications List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {notifications.length === 0 ? (
              <div className="text-center py-8">
                <Bell className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                <p className="text-senior-base text-muted-foreground">
                  No notifications yet
                </p>
              </div>
            ) : (
              notifications.map((notification) => (
                <Card 
                  key={notification.id} 
                  className={`p-4 cursor-pointer transition-all duration-200 hover:shadow-gentle ${
                    !notification.read ? "bg-accent/50" : ""
                  } ${getPriorityColor(notification.priority)}`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex items-start gap-3">
                    {getNotificationIcon(notification.type)}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className={`text-senior-base font-medium text-foreground ${
                          !notification.read ? "font-semibold" : ""
                        }`}>
                          {notification.title}
                        </h4>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            dismissNotification(notification.id);
                          }}
                          className="p-1 h-auto"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                      <p className="text-senior-sm text-muted-foreground mt-1">
                        {notification.message}
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        {formatTimestamp(notification.timestamp)}
                      </p>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>

          {/* Settings */}
          <div className="border-t border-border p-4">
            <div className="flex items-center gap-2 mb-3">
              <Settings className="h-5 w-5 text-primary" />
              <h4 className="text-senior-base font-medium text-foreground">
                Notification Settings
              </h4>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-senior-sm text-foreground">Budget Alerts</span>
                <Switch 
                  checked={notificationSettings.budgetAlerts}
                  onCheckedChange={(checked) => 
                    setNotificationSettings(prev => ({ ...prev, budgetAlerts: checked }))
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-senior-sm text-foreground">Monthly Reminders</span>
                <Switch 
                  checked={notificationSettings.monthlyReminders}
                  onCheckedChange={(checked) => 
                    setNotificationSettings(prev => ({ ...prev, monthlyReminders: checked }))
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-senior-sm text-foreground">Savings Tips</span>
                <Switch 
                  checked={notificationSettings.savingsTips}
                  onCheckedChange={(checked) => 
                    setNotificationSettings(prev => ({ ...prev, savingsTips: checked }))
                  }
                />
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}