
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  ChevronLeft, 
  ChevronRight, 
  Gauge, 
  FileCheck, 
  ClipboardList, 
  CogIcon,
  LogOut, 
  LucideIcon, 
  Home,
  BarChart2,
  QrCode,
  FileText,
  User,
  Users,
  Building,
  Shield,
  BookOpen,
  Settings
} from 'lucide-react';

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

interface NavItemProps {
  to: string;
  icon: LucideIcon;
  label: string;
  collapsed: boolean;
  end?: boolean;
}

interface NavItemData {
  to: string;
  icon: LucideIcon;
  label: string;
  end?: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ 
  to, 
  icon: Icon, 
  label, 
  collapsed,
  end = false
}) => {
  const location = useLocation();
  const isActive = end 
    ? location.pathname === to 
    : location.pathname.startsWith(to);
  
  return (
    <NavLink 
      to={to} 
      end={end}
      className={({ isActive }) => 
        `flex items-center py-2 px-3 rounded-md transition-colors ${
          isActive 
            ? 'bg-primary text-primary-foreground hover:bg-primary/90' 
            : 'hover:bg-muted text-muted-foreground hover:text-foreground'
        } ${collapsed ? 'justify-center' : 'justify-start'}`
      }
    >
      <Icon className={`h-5 w-5 ${collapsed ? '' : 'mr-2'}`} />
      {!collapsed && <span>{label}</span>}
    </NavLink>
  );
};

const Sidebar: React.FC<SidebarProps> = ({ collapsed, setCollapsed }) => {
  const { currentUser, role, logout } = useAuth();
  
  // Determine the appropriate home path based on user role
  const getHomePath = () => {
    switch (role) {
      case 'admin':
        return '/dashboard/admin';
      case 'student':
        return '/dashboard/student';
      case 'department':
        return '/dashboard/department';
      default:
        return '/dashboard';
    }
  };
  
  const getNavItems = () => {
    const homePath = getHomePath();
    
    const baseItems: NavItemData[] = [
      { to: homePath, icon: Home, label: 'Home', end: true },
    ];
    
    const adminItems: NavItemData[] = [
      { to: '/dashboard/overview', icon: BarChart2, label: 'Overview' },
      { to: '/dashboard/users', icon: Users, label: 'Users' },
      { to: '/dashboard/departments', icon: Building, label: 'Departments' },
    ];
    
    const studentItems: NavItemData[] = [
      { to: '/dashboard/overview', icon: BarChart2, label: 'Overview' },
      { to: '/dashboard/apply', icon: FileCheck, label: 'Apply' },
    ];
    
    const departmentItems: NavItemData[] = [
      // Department heads don't need Overview to avoid conflicts
    ];
    
    const sharedItems: NavItemData[] = [
      { to: '/dashboard/requests', icon: ClipboardList, label: 'Requests' },
      { to: '/dashboard/documents', icon: FileText, label: 'Documents' },
      { to: '/dashboard/verification', icon: QrCode, label: 'Verification' },
      { to: '/dashboard/documentation', icon: BookOpen, label: 'Documentation' },
      { to: '/dashboard/settings', icon: Settings, label: 'Settings' },
    ];
    
    switch (role) {
      case 'admin':
        return [...baseItems, ...adminItems, ...sharedItems];
      case 'department':
        return [...baseItems, ...departmentItems, ...sharedItems];
      case 'student':
        return [...baseItems, ...studentItems, ...sharedItems];
      default:
        return [...baseItems, ...sharedItems];
    }
  };

  const handleLogout = () => {
    logout();
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  return (
    <div 
      className={`border-r bg-background relative flex flex-col transition-all duration-300 ease-in-out ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      <button
        className="absolute -right-3 top-5 p-1 rounded-full border bg-background text-foreground"
        onClick={() => setCollapsed(!collapsed)}
        aria-label={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
      >
        {collapsed ? (
          <ChevronRight className="h-4 w-4" />
        ) : (
          <ChevronLeft className="h-4 w-4" />
        )}
      </button>
      
      <div className={`flex items-center p-4 ${collapsed ? 'justify-center' : 'justify-start'}`}>
        <div className="flex items-center">
          <Shield className={`text-primary transition-all duration-300 ${collapsed ? 'h-6 w-6' : 'h-8 w-8'}`} />
          {!collapsed && <span className="ml-2 text-xl font-bold">ClearPass</span>}
        </div>
      </div>
      
      <ScrollArea className="flex-1 py-2 px-4">
        <nav className="space-y-1">
          {getNavItems().map((item) => (
            <NavItem
              key={item.to}
              to={item.to}
              icon={item.icon}
              label={item.label}
              collapsed={collapsed}
              end={item.end}
            />
          ))}
        </nav>
      </ScrollArea>
      
      <div className="border-t p-4">
        <div className={`flex ${collapsed ? 'flex-col justify-center items-center' : 'space-x-3 items-center'}`}>
          <Avatar className={`transition-all duration-300 ${collapsed ? 'h-6 w-6' : 'h-8 w-8'}`}>
            <AvatarImage src={`https://ui-avatars.com/api/?name=${currentUser?.name}`} alt={currentUser?.name} />
            <AvatarFallback>{currentUser ? getInitials(currentUser.name) : 'U'}</AvatarFallback>
          </Avatar>
          
          {!collapsed && (
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium truncate">{currentUser?.name}</p>
              <p className="text-xs text-muted-foreground truncate capitalize">{currentUser?.role}</p>
            </div>
          )}
          
          <Button
            variant="ghost"
            size="icon"
            onClick={handleLogout}
            className={collapsed ? 'mt-4' : ''}
            title="Logout"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
