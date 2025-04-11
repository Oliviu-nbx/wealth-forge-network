
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import ProjectCard from './ProjectCard';
import { ProjectData } from '@/lib/types';
import { useUser } from '@/contexts/UserContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const ProjectList = () => {
  const { user } = useUser();
  const { toast } = useToast();
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<ProjectData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchProjects() {
      try {
        setIsLoading(true);
        
        let query = supabase
          .from('projects')
          .select(`
            id,
            title,
            description,
            category,
            location,
            budget,
            status,
            created_at,
            profiles:creator_id (
              id,
              full_name,
              avatar_url
            )
          `);
        
        const { data, error } = await query;
        
        if (error) throw error;
        
        const formattedProjects: ProjectData[] = data.map(project => {
          // Extract creator info from the profiles object
          const creator = project.profiles;
          
          return {
            id: project.id,
            title: project.title,
            description: project.description || '',
            category: project.category || 'Other',
            location: project.location || 'Remote',
            budget: project.budget ? `$${project.budget}` : 'Not specified',
            requiredSkills: [], // To be implemented with joining from project_required_skills table
            creator: {
              id: creator?.id || 'unknown',
              name: creator?.full_name || 'Unknown User',
              avatar: creator?.avatar_url,
              initials: getInitials(creator?.full_name || 'Unknown User'),
            },
            createdAt: formatDate(project.created_at),
            status: project.status as 'pending' | 'approved' | 'rejected'
          };
        });
        
        setProjects(formattedProjects);
        setFilteredProjects(formattedProjects);
      } catch (error: any) {
        console.error('Error fetching projects:', error);
        toast({
          title: 'Error loading projects',
          description: error.message || 'Failed to load projects',
          variant: 'destructive',
        });
        setProjects([]);
        setFilteredProjects([]);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchProjects();
  }, [toast]);

  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    // Return date in format like "Apr 11, 2025"
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    
    if (!term.trim()) {
      setFilteredProjects(projects);
      return;
    }
    
    const filtered = projects.filter(project => 
      project.title.toLowerCase().includes(term.toLowerCase()) ||
      project.description.toLowerCase().includes(term.toLowerCase()) ||
      project.requiredSkills.some(skill => 
        skill.toLowerCase().includes(term.toLowerCase())
      )
    );
    
    setFilteredProjects(filtered);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-pulse text-muted-foreground">Loading projects...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search projects..."
            value={searchTerm}
            onChange={handleSearch}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            <span>Filter</span>
          </Button>
          <Button asChild className="gap-2">
            <Link to="/projects/create">
              <Plus className="h-4 w-4" />
              <span>New Project</span>
            </Link>
          </Button>
        </div>
      </div>
      
      {filteredProjects.length === 0 ? (
        <div className="text-center py-16 bg-muted/20 rounded-lg">
          <h3 className="text-lg font-medium mb-2">No projects found</h3>
          <p className="text-muted-foreground mb-6">
            {searchTerm 
              ? "No projects match your search criteria" 
              : "There are no projects available at the moment"}
          </p>
          <Button asChild>
            <Link to="/projects/create">Create a project</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <ProjectCard 
              key={project.id}
              {...project}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectList;
