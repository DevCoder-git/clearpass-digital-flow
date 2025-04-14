
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  ChevronLeft, ChevronRight, LayoutDashboard, FileText, 
  Users, Settings, LogOut, UserCircle, Building, 
  Graduation, ClipboardList
} from 'lucide-react';

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed, setCollapsed }) => {
  const { currentUser, role, logout } = useAuth();

  const getNavItems = () => {
    const commonItems = [
      { 
        title: 'Dashboard', 
        icon: <LayoutDashboard size={20} />, 
        path: '/dashboard' 
      },
    ];

    const roleSpecificItems = {
      student: [
        { 
          title: 'Apply for Clearance', 
          icon: <ClipboardList size={20} />, 
          path: '/dashboard/apply' 
        },
        { 
          title: 'My Requests', 
          icon: <FileText size={20} />, 
          path: '/dashboard/requests' 
        },
      ],
      department: [
        { 
          title: 'Pending Requests', 
          icon: <ClipboardList size={20} />, 
          path: '/dashboard/pending' 
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
          path: '/dashboard/all-requests' 
        },
        { 
          title: 'Departments', 
          icon: <Building size={20} />, 
          path: '/dashboard/departments' 
        },
        { 
          title: 'Students', 
          icon: <Graduation size={20} />, 
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
        className="absolute -right-3 top-10 z-10 h-6 w-6 rounded-full border bg-background text-foreground shadow-md"
        onClick={() => setCollapsed(!collapsed)}
      >
        {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </Button>
      
      {/* Logo and header */}
      <div className="flex h-16 items-center border-b px-4">
        <Link to="/" className="flex items-center gap-2 font-semibold text-sidebar-foreground">
          <FileText size={24} />
          {!collapsed && <span>ClearPass</span>}
        </Link>
      </div>
      
      {/* Navigation Menu */}
      <ScrollArea className="flex-1 py-2">
        <nav className="flex flex-col gap-1 px-2">
          {navItems.map((item, index) => (
            <Link
              key={index}
              to={item.path}
              className="flex items-center gap-3 rounded-md px-3 py-2 text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
            >
              {item.icon}
              {!collapsed && <span>{item.title}</span>}
            </Link>
          ))}
        </nav>
      </ScrollArea>
      
      {/* User area */}
      <div className="mt-auto border-t p-4">
        <div className="flex items-center gap-3">
          <UserCircle size={collapsed ? 32 : 24} className="text-sidebar-foreground" />
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
        
        <Separator className="my-3 bg-sidebar-accent" />
        
        <Button 
          variant="ghost" 
          size={collapsed ? "icon" : "default"}
          className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
          onClick={logout}
        >
          <LogOut size={collapsed ? 20 : 16} />
          {!collapsed && <span className="ml-2">Logout</span>}
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
