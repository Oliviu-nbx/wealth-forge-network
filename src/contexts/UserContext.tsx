
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

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
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
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

  // Check for user session and fetch profile on mount and auth state changes
  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setIsLoading(true);
        
        if (session?.user) {
          try {
            // Fetch user profile
            const { data: profile, error } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();

            if (error) {
              // If profile doesn't exist yet (first login), create it
              if (error.code === 'PGRST116') {
                // Try to create a profile
                const { error: insertError } = await supabase
                  .from('profiles')
                  .insert({
                    id: session.user.id,
                    full_name: session.user.email?.split('@')[0] || 'User',
                    is_admin: 0
                  });
                
                if (insertError) throw insertError;
                
                // Created profile, now set up basic user data
                const userData: User = {
                  id: session.user.id,
                  email: session.user.email || '',
                  name: session.user.email?.split('@')[0] || 'User',
                  isAdmin: false,
                  initials: getInitials(session.user.email || 'User'),
                };
                
                setUser(userData);
              } else {
                throw error;
              }
            } else {
              // Profile exists, create user object with data
              const userData: User = {
                id: session.user.id,
                email: session.user.email || '',
                name: profile?.full_name || session.user.email?.split('@')[0] || 'User',
                isAdmin: Boolean(profile?.is_admin),
                avatar: profile?.avatar_url || undefined,
                initials: getInitials(profile?.full_name || session.user.email || 'User'),
              };
              
              setUser(userData);
            }
          } catch (error) {
            console.error('Error fetching user profile:', error);
            setUser(null);
          }
        } else {
          setUser(null);
        }
        
        setIsLoading(false);
      }
    );

    // Initial session check
    getInitialSession();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const getInitialSession = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        // Fetch user profile
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (error) {
          // If profile doesn't exist (first login after signup), create a basic one
          if (error.code === 'PGRST116') {
            // Try to create a profile
            const { error: insertError } = await supabase
              .from('profiles')
              .insert({
                id: session.user.id,
                full_name: session.user.email?.split('@')[0] || 'User',
                is_admin: 0
              });
              
            if (insertError) throw insertError;
            
            // Set basic user data
            const userData: User = {
              id: session.user.id,
              email: session.user.email || '',
              name: session.user.email?.split('@')[0] || 'User',
              isAdmin: false,
              initials: getInitials(session.user.email || 'User'),
            };
            
            setUser(userData);
          } else {
            throw error;
          }
        } else {
          // Create user object with data from auth and profile
          const userData: User = {
            id: session.user.id,
            email: session.user.email || '',
            name: profile?.full_name || session.user.email?.split('@')[0] || 'User',
            isAdmin: Boolean(profile?.is_admin),
            avatar: profile?.avatar_url || undefined,
            initials: getInitials(profile?.full_name || session.user.email || 'User'),
          };
          
          setUser(userData);
        }
      }
    } catch (error) {
      console.error('Error fetching initial session:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;
      
      // We don't need to set the user here because the onAuthStateChange listener will handle it
    } catch (error: any) {
      toast({
        title: "Login Failed",
        description: error.message || "There was a problem logging in",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      // We don't need to clear the user here because the onAuthStateChange listener will handle it
    } catch (error: any) {
      toast({
        title: "Logout Failed",
        description: error.message || "There was a problem logging out",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <UserContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
