import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Shield, Users, Briefcase, AlertTriangle, 
  Check, X, Eye, Edit, Trash2, Search 
} from 'lucide-react';
import { 
  Card, CardContent, CardDescription,
  CardHeader, CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/contexts/UserContext';
import Navbar from '@/components/ui/layout/Navbar';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { supabase } from '@/integrations/supabase/client';

type ProjectWithCreator = {
  id: string;
  title: string;
  creator: {
    name: string;
  };
  category: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
};

type UserProfile = {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  status: 'active' | 'suspended';
  projects: number;
  dateJoined: string;
};

const AdminPanel = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useUser();
  const [projects, setProjects] = useState<ProjectWithCreator[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user?.isAdmin) {
      toast({
        title: "Access denied",
        description: "You do not have permission to access this page",
        variant: "destructive",
      });
      navigate('/dashboard');
    }
  }, [user, navigate, toast]);

  useEffect(() => {
    if (!user?.isAdmin) return;

    async function fetchData() {
      setIsLoading(true);
      
      try {
        const { data: projectsData, error: projectsError } = await supabase
          .from('projects')
          .select(`
            id,
            title,
            description,
            category,
            status,
            created_at,
            profiles:creator_id (
              id,
              full_name
            )
          `);
          
        if (projectsError) throw projectsError;

        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('*');
          
        if (profilesError) throw profilesError;
        
        const formattedProjects: ProjectWithCreator[] = projectsData.map(project => ({
          id: project.id,
          title: project.title,
          creator: {
            name: project.profiles?.full_name || 'Unknown User',
          },
          category: project.category || 'Other',
          status: project.status as 'pending' | 'approved' | 'rejected' || 'pending',
          createdAt: formatDate(project.created_at),
        }));
        
        setProjects(formattedProjects);
        
        const formattedUsers: UserProfile[] = profilesData.map(profile => ({
          id: profile.id,
          name: profile.full_name || 'Unknown User',
          email: profile.email || 'No email',
          isAdmin: Boolean(profile.is_admin),
          status: 'active', // Default status
          projects: 0, // Will calculate below
          dateJoined: formatDate(profile.created_at),
        }));
        
        formattedUsers.forEach(user => {
          user.projects = projectsData.filter(
            project => project.profiles?.id === user.id
          ).length;
        });
        
        setUsers(formattedUsers);
      } catch (error: any) {
        console.error('Error fetching admin data:', error);
        toast({
          title: "Failed to load data",
          description: error.message || "There was a problem loading the admin data",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchData();
  }, [user, toast]);

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const handleApproveProject = async (id: string) => {
    try {
      const { error } = await supabase
        .from('projects')
        .update({ status: 'approved' })
        .eq('id', id);
        
      if (error) throw error;
      
      setProjects(projects.map(project => 
        project.id === id ? { ...project, status: 'approved' as const } : project
      ));
      
      toast({
        title: "Project approved",
        description: "The project has been approved and is now visible to users",
      });
    } catch (error: any) {
      console.error('Error approving project:', error);
      toast({
        title: "Failed to approve project",
        description: error.message || "There was a problem approving the project",
        variant: "destructive",
      });
    }
  };

  const handleRejectProject = async (id: string) => {
    try {
      const { error } = await supabase
        .from('projects')
        .update({ status: 'rejected' })
        .eq('id', id);
        
      if (error) throw error;
      
      setProjects(projects.map(project => 
        project.id === id ? { ...project, status: 'rejected' as const } : project
      ));
      
      toast({
        title: "Project rejected",
        description: "The project has been rejected",
      });
    } catch (error: any) {
      console.error('Error rejecting project:', error);
      toast({
        title: "Failed to reject project",
        description: error.message || "There was a problem rejecting the project",
        variant: "destructive",
      });
    }
  };

  const handleDeleteProject = async (id: string) => {
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      setProjects(projects.filter(project => project.id !== id));
      
      toast({
        title: "Project deleted",
        description: "The project has been permanently deleted",
      });
    } catch (error: any) {
      console.error('Error deleting project:', error);
      toast({
        title: "Failed to delete project",
        description: error.message || "There was a problem deleting the project",
        variant: "destructive",
      });
    }
  };

  const handleToggleUserStatus = (userId: string) => {
    const updatedUsers = users.map(user => 
      user.id === userId 
        ? { ...user, status: user.status === 'active' ? 'suspended' as const : 'active' as const } 
        : user
    );
    setUsers(updatedUsers);
    toast({
      title: "User status updated",
      description: "The user's status has been updated",
    });
  };

  const handleToggleAdminStatus = async (userId: string, currentAdminStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ is_admin: !currentAdminStatus })
        .eq('id', userId);
        
      if (error) throw error;
      
      setUsers(users.map(user => 
        user.id === userId ? { ...user, isAdmin: !user.isAdmin } : user
      ));
      
      toast({
        title: "Admin status updated",
        description: "The user's admin status has been updated",
      });
    } catch (error: any) {
      console.error('Error updating admin status:', error);
      toast({
        title: "Failed to update admin status",
        description: error.message || "There was a problem updating the admin status",
        variant: "destructive",
      });
    }
  };

  const filteredProjects = projects.filter(project => 
    project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.creator.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center py-20">
            <div className="animate-pulse text-muted-foreground">Loading admin data...</div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="h-6 w-6 text-wf-gold" />
            <h1 className="text-2xl font-bold">Admin Panel</h1>
          </div>
          <p className="text-muted-foreground">
            Manage projects, users, and platform settings
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-indigo-500" />
                <span>Projects</span>
              </CardTitle>
              <CardDescription>Total projects on the platform</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{projects.length}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="h-5 w-5 text-green-500" />
                <span>Users</span>
              </CardTitle>
              <CardDescription>Registered platform users</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{users.length}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
                <span>Pending Review</span>
              </CardTitle>
              <CardDescription>Items needing your attention</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">
                {projects.filter(p => p.status === 'pending').length}
              </p>
            </CardContent>
          </Card>
        </div>
        
        <div className="bg-white rounded-lg border shadow-sm">
          <Tabs defaultValue="projects">
            <div className="border-b px-4">
              <TabsList className="px-0 py-3">
                <TabsTrigger value="projects">Projects</TabsTrigger>
                <TabsTrigger value="users">Users</TabsTrigger>
              </TabsList>
              
              <div className="mb-3 max-w-xs">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </div>
            
            <TabsContent value="projects" className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Project Name</TableHead>
                      <TableHead>Creator</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProjects.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                          No projects found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredProjects.map((project) => (
                        <TableRow key={project.id}>
                          <TableCell className="font-medium">{project.title}</TableCell>
                          <TableCell>{project.creator.name}</TableCell>
                          <TableCell>{project.category}</TableCell>
                          <TableCell>
                            <Badge variant={
                              project.status === 'approved' ? 'default' : 
                              project.status === 'pending' ? 'outline' : 'destructive'
                            }>
                              {project.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{project.createdAt}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button 
                                variant="outline" 
                                size="icon" 
                                onClick={() => navigate(`/projects/${project.id}`)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              {project.status === 'pending' && (
                                <>
                                  <Button 
                                    variant="outline" 
                                    size="icon" 
                                    className="text-green-600 border-green-600"
                                    onClick={() => handleApproveProject(project.id)}
                                  >
                                    <Check className="h-4 w-4" />
                                  </Button>
                                  <Button 
                                    variant="outline" 
                                    size="icon"
                                    className="text-red-600 border-red-600"
                                    onClick={() => handleRejectProject(project.id)}
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </>
                              )}
                              <Button 
                                variant="outline" 
                                size="icon"
                                className="text-red-600 border-red-600"
                                onClick={() => handleDeleteProject(project.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
            
            <TabsContent value="users" className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Projects</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                          No users found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredUsers.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">{user.name}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>
                            <Badge variant={user.isAdmin ? "default" : "secondary"}>
                              {user.isAdmin ? "Admin" : "User"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant={user.status === 'active' ? 'outline' : 'destructive'}>
                              {user.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{user.projects}</TableCell>
                          <TableCell>{user.dateJoined}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button 
                                variant="outline" 
                                size="icon"
                                onClick={() => handleToggleAdminStatus(user.id, user.isAdmin)}
                                className={user.isAdmin ? "text-amber-600 border-amber-600" : "text-blue-600 border-blue-600"}
                              >
                                <Shield className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="outline" 
                                size="icon"
                                className={user.status === 'active' ? "text-red-600 border-red-600" : "text-green-600 border-green-600"}
                                onClick={() => handleToggleUserStatus(user.id)}
                              >
                                {user.status === 'active' ? <X className="h-4 w-4" /> : <Check className="h-4 w-4" />}
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default AdminPanel;
