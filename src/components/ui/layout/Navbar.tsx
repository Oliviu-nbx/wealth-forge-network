
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Bell, MessageSquare, Menu, User, BarChart2, Briefcase, LogOut, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/contexts/UserContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const { toast } = useToast();
  const { user, logout } = useUser();

  const isActive = (path: string) => location.pathname === path;

  const handleNotificationClick = () => {
    toast({
      title: "No new notifications",
      description: "You're all caught up!",
    });
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Logged out",
        description: "You have been successfully logged out",
      });
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const NavLink = ({ to, children, icon: Icon }: { to: string; children: React.ReactNode; icon: React.ComponentType<any> }) => (
    <Link
      to={to}
      className={cn(
        "flex items-center gap-2 py-2 px-3 rounded-md transition-colors",
        isActive(to) 
          ? "bg-wf-navy text-white font-medium" 
          : "text-gray-700 hover:bg-gray-100"
      )}
    >
      <Icon size={20} />
      <span>{children}</span>
    </Link>
  );

  return (
    <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          {/* Logo and desktop nav */}
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to={user ? "/dashboard" : "/"} className="flex items-center">
                <BarChart2 className="h-8 w-8 text-wf-gold" />
                <span className="ml-2 text-xl font-bold text-wf-navy">Wealth Forge</span>
              </Link>
            </div>
            {user && (
              <div className="hidden sm:ml-6 sm:flex sm:space-x-2">
                <NavLink to="/dashboard" icon={BarChart2}>Dashboard</NavLink>
                <NavLink to="/projects" icon={Briefcase}>Projects</NavLink>
                <NavLink to="/messages" icon={MessageSquare}>Messages</NavLink>
                {user.isAdmin && (
                  <NavLink to="/admin" icon={Shield}>Admin</NavLink>
                )}
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            {user && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-expanded={isMenuOpen}
              >
                <Menu className="h-6 w-6" />
              </Button>
            )}
          </div>

          {/* User navigation */}
          <div className="hidden sm:flex sm:items-center sm:ml-6 gap-1">
            {user ? (
              <>
                <Button variant="ghost" size="icon" className="rounded-full" onClick={handleNotificationClick}>
                  <Bell className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" className="rounded-full" asChild>
                  <Link to="/messages">
                    <MessageSquare className="h-5 w-5" />
                  </Link>
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-full">
                      <User className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuItem asChild>
                      <Link to="/profile">Profile</Link>
                    </DropdownMenuItem>
                    {user.isAdmin && (
                      <DropdownMenuItem asChild>
                        <Link to="/admin">Admin Panel</Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="h-4 w-4 mr-2" />
                      <span>Logout</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <Button asChild>
                <Link to="/login">Login</Link>
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      {isMenuOpen && user && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1 px-2">
            <NavLink to="/dashboard" icon={BarChart2}>Dashboard</NavLink>
            <NavLink to="/projects" icon={Briefcase}>Projects</NavLink>
            <NavLink to="/messages" icon={MessageSquare}>Messages</NavLink>
            <NavLink to="/profile" icon={User}>Profile</NavLink>
            {user.isAdmin && (
              <NavLink to="/admin" icon={Shield}>Admin Panel</NavLink>
            )}
            <div 
              className="flex items-center gap-2 py-2 px-3 rounded-md transition-colors text-red-600 hover:bg-gray-100 cursor-pointer"
              onClick={handleLogout}
            >
              <LogOut size={20} />
              <span>Logout</span>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
