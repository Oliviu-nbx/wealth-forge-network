
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
                
                if (insertError) {
                  console.error('Error creating profile:', insertError);
                  throw insertError;
                }
                
                // Fetch the newly created profile
                const { data: newProfile, error: fetchError } = await supabase
                  .from('profiles')
                  .select('*')
                  .eq('id', session.user.id)
                  .single();
                  
                if (fetchError) throw fetchError;
                
                // Created profile, now set up user data
                const userData: User = {
                  id: session.user.id,
                  email: session.user.email || '',
                  name: newProfile?.full_name || session.user.email?.split('@')[0] || 'User',
                  isAdmin: Boolean(newProfile?.is_admin),
                  initials: getInitials(newProfile?.full_name || session.user.email || 'User'),
                };
                
                setUser(userData);
              } else {
                console.error('Error fetching profile:', error);
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
            console.error('Error in user profile handling:', error);
            // Don't set user to null here, as they are authenticated but just missing a profile
            // Instead, create a basic user object from the session
            const basicUserData: User = {
              id: session.user.id,
              email: session.user.email || '',
              name: session.user.email?.split('@')[0] || 'User',
              isAdmin: false,
              initials: getInitials(session.user.email || 'User'),
            };
            setUser(basicUserData);
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
          // Handle missing profile for existing session
          if (error.code === 'PGRST116') {
            // Try to create a profile
            const { error: insertError } = await supabase
              .from('profiles')
              .insert({
                id: session.user.id,
                full_name: session.user.email?.split('@')[0] || 'User',
                is_admin: 0
              });
              
            if (insertError) {
              console.error('Error creating profile during initial session:', insertError);
              // Even if profile creation fails, set a basic user object
              const basicUserData: User = {
                id: session.user.id,
                email: session.user.email || '',
                name: session.user.email?.split('@')[0] || 'User',
                isAdmin: false,
                initials: getInitials(session.user.email || 'User'),
              };
              setUser(basicUserData);
            } else {
              // Profile created, set basic user data
              const userData: User = {
                id: session.user.id,
                email: session.user.email || '',
                name: session.user.email?.split('@')[0] || 'User',
                isAdmin: false,
                initials: getInitials(session.user.email || 'User'),
              };
              setUser(userData);
            }
          } else {
            console.error('Error fetching profile during initial session:', error);
            // Set basic user data from session even if profile fetch fails
            const basicUserData: User = {
              id: session.user.id,
              email: session.user.email || '',
              name: session.user.email?.split('@')[0] || 'User',
              isAdmin: false,
              initials: getInitials(session.user.email || 'User'),
            };
            setUser(basicUserData);
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
      toast({
        title: "Login successful!",
        description: "You are now logged in",
      });
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
      toast({
        title: "Logged out successfully",
        description: "You have been logged out",
      });
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
