
import React, { createContext, useContext, useState, useEffect } from 'react';

export interface User {
  id: string;
  email: string;
  name: string;
  isAdmin: boolean;
  avatar?: string;
  initials: string;
}

interface UserContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => void;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for saved user on component mount
  useEffect(() => {
    const savedUser = localStorage.getItem('wealthforge_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = (email: string, password: string) => {
    // Since we're not using a real backend, we'll create a simple check for the admin
    if (email === 'oliviu@namebox.ro') {
      const adminUser: User = {
        id: 'admin-1',
        email: 'oliviu@namebox.ro',
        name: 'Oliviu Admin',
        isAdmin: true,
        initials: 'OA'
      };
      
      setUser(adminUser);
      localStorage.setItem('wealthforge_user', JSON.stringify(adminUser));
    } else {
      // For demo purposes, let any login succeed with a regular user account
      const regularUser: User = {
        id: `user-${Date.now()}`,
        email: email,
        name: email.split('@')[0], // Simple name from email
        isAdmin: false,
        initials: email.substring(0, 2).toUpperCase()
      };
      
      setUser(regularUser);
      localStorage.setItem('wealthforge_user', JSON.stringify(regularUser));
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('wealthforge_user');
  };

  return (
    <UserContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
