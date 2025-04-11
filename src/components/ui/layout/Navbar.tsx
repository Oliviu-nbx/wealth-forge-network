
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Bell, MessageSquare, Menu, User, BarChart2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const Navbar = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const isActive = (path: string) => location.pathname === path;

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
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          {/* Logo and desktop nav */}
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="flex items-center">
                <BarChart2 className="h-8 w-8 text-wf-gold" />
                <span className="ml-2 text-xl font-bold text-wf-navy">Wealth Forge</span>
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-2">
              <NavLink to="/dashboard" icon={BarChart2}>Dashboard</NavLink>
              <NavLink to="/projects" icon={BarChart2}>Projects</NavLink>
              <NavLink to="/messages" icon={MessageSquare}>Messages</NavLink>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-expanded={isMenuOpen}
            >
              <Menu className="h-6 w-6" />
            </Button>
          </div>

          {/* User navigation */}
          <div className="hidden sm:flex sm:items-center sm:ml-6 gap-1">
            <Button variant="ghost" size="icon" className="rounded-full">
              <Bell className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full">
              <MessageSquare className="h-5 w-5" />
            </Button>
            <Link to="/profile">
              <Button variant="ghost" size="icon" className="rounded-full">
                <User className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      {isMenuOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1 px-2">
            <NavLink to="/dashboard" icon={BarChart2}>Dashboard</NavLink>
            <NavLink to="/projects" icon={BarChart2}>Projects</NavLink>
            <NavLink to="/messages" icon={MessageSquare}>Messages</NavLink>
            <NavLink to="/profile" icon={User}>Profile</NavLink>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
