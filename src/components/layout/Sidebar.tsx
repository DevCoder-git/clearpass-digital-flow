
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  ChevronLeft, ChevronRight, LayoutDashboard, FileText, 
  Users, Settings, LogOut, UserCircle, Building, 
  GraduationCap, ClipboardList, AlertTriangle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

interface NavItem {
  title: string;
  icon: React.ReactNode;
  path: string;
  count?: number;
  alert?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed, setCollapsed }) => {
  const { currentUser, role, logout } = useAuth();
  const location = useLocation();
  const [mounted, setMounted] = useState(false);
  
  // Set mounted to true after first render to prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const getNavItems = (): NavItem[] => {
    const commonItems: NavItem[] = [
      { 
        title: 'Dashboard', 
        icon: <LayoutDashboard size={20} />, 
        path: '/dashboard' 
      },
    ];

    const roleSpecificItems: Record<string, NavItem[]> = {
      student: [
        { 
          title: 'Apply for Clearance', 
          icon: <ClipboardList size={20} />, 
          path: '/dashboard/apply' 
        },
        { 
          title: 'My Requests', 
          icon: <FileText size={20} />, 
          path: '/dashboard/requests',
          count: 3,
        },
      ],
      department: [
        { 
          title: 'Pending Requests', 
          icon: <ClipboardList size={20} />, 
          path: '/dashboard/pending',
          count: 15,
          alert: true,
        },
        { 
          title: 'Processed Requests', 
          icon: <FileText size={20} />, 
          path: '/dashboard/processed' 
        },
      ],
      admin: [
        { 
          title: 'All Requests', 
          icon: <ClipboardList size={20} />, 
          path: '/dashboard/all-requests',
          count: 30,
        },
        { 
          title: 'Departments', 
          icon: <Building size={20} />, 
          path: '/dashboard/departments' 
        },
        { 
          title: 'Students', 
          icon: <GraduationCap size={20} />, 
          path: '/dashboard/students' 
        },
        { 
          title: 'Users', 
          icon: <Users size={20} />, 
          path: '/dashboard/users' 
        },
      ],
    };

    return [
      ...commonItems,
      ...(role ? roleSpecificItems[role] || [] : []),
      { 
        title: 'Settings', 
        icon: <Settings size={20} />, 
        path: '/dashboard/settings' 
      },
    ];
  };

  const navItems = getNavItems();

  return (
    <div 
      className={`flex flex-col border-r bg-sidebar transition-all duration-300 h-screen relative ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Toggle button */}
      <Button 
        variant="ghost" 
        size="icon" 
        className="absolute -right-3 top-10 z-10 h-6 w-6 rounded-full border bg-background text-foreground shadow-md hover:bg-muted"
        onClick={() => setCollapsed(!collapsed)}
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </Button>
      
      {/* Logo and header */}
      <div className="flex h-16 items-center border-b px-4">
        <Link to="/" className="flex items-center gap-2 font-semibold text-sidebar-foreground">
          <FileText size={24} className="text-primary" />
          {!collapsed && <span className="text-lg tracking-tight">ClearPass</span>}
        </Link>
      </div>
      
      {/* Navigation Menu */}
      <ScrollArea className="flex-1 py-2">
        <nav className="flex flex-col gap-1 px-2">
          {mounted && navItems.map((item, index) => {
            const isActive = location.pathname === item.path || 
                           (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
            
            return (
              <TooltipProvider key={index} delayDuration={300}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      to={item.path}
                      className={cn(
                        "flex items-center gap-3 rounded-md px-3 py-2 text-sidebar-foreground relative group",
                        isActive 
                          ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium" 
                          : "hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground/90 transition-colors",
                      )}
                    >
                      <span className={cn(
                        "flex h-5 w-5 items-center justify-center",
                        isActive && "text-primary"
                      )}>
                        {item.icon}
                      </span>
                      
                      {!collapsed && (
                        <>
                          <span className="flex-grow truncate">{item.title}</span>
                          
                          {item.count && (
                            <span className={cn(
                              "text-xs rounded-full px-2 py-0.5 text-sidebar-foreground",
                              item.alert ? "bg-destructive text-destructive-foreground" : "bg-muted",
                              "min-w-[1.5rem] text-center"
                            )}>
                              {item.count}
                            </span>
                          )}
                          
                          {item.alert && !item.count && (
                            <AlertTriangle size={14} className="text-destructive" />
                          )}
                        </>
                      )}
                      
                      {collapsed && item.count && (
                        <span className={cn(
                          "absolute -top-1 -right-1 text-xs rounded-full px-1.5 text-sidebar-foreground",
                          item.alert ? "bg-destructive text-destructive-foreground" : "bg-muted",
                          "min-w-[1.25rem] h-5 flex items-center justify-center"
                        )}>
                          {item.count}
                        </span>
                      )}
                    </Link>
                  </TooltipTrigger>
                  {collapsed && (
                    <TooltipContent side="right">
                      {item.title}
                      {item.count ? ` (${item.count})` : ''}
                    </TooltipContent>
                  )}
                </Tooltip>
              </TooltipProvider>
            );
          })}
        </nav>
      </ScrollArea>
      
      {/* User area */}
      <div className="mt-auto border-t p-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <UserCircle size={collapsed ? 32 : 28} className="text-sidebar-foreground" />
            <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-green-500 ring-1 ring-white"></span>
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="text-sm font-medium text-sidebar-foreground">
                {currentUser?.name || 'User'}
              </span>
              <span className="text-xs text-sidebar-foreground/80">
                {role && role.charAt(0).toUpperCase() + role.slice(1)}
              </span>
            </div>
          )}
        </div>
        
        <Separator className="my-3 bg-sidebar-accent/50" />
        
        <TooltipProvider delayDuration={300}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size={collapsed ? "icon" : "default"}
                className={cn(
                  "w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent transition-colors",
                  collapsed && "h-9 w-9 p-0"
                )}
                onClick={logout}
              >
                <LogOut size={collapsed ? 20 : 16} />
                {!collapsed && <span className="ml-2">Logout</span>}
              </Button>
            </TooltipTrigger>
            {collapsed && (
              <TooltipContent side="right">
                Logout
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};

export default Sidebar;
