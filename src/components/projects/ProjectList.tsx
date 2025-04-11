
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import ProjectCard from './ProjectCard';
import { ProjectData } from '@/lib/types';
import { useUser } from '@/contexts/UserContext';

const ProjectList = () => {
  const { user } = useUser();
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<ProjectData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Load projects from localStorage
    const storedProjects = localStorage.getItem('wealthforge_projects');
    if (storedProjects) {
      const parsedProjects = JSON.parse(storedProjects);
      
      // Only show approved projects to regular users, admins can see all
      const visibleProjects = user?.isAdmin 
        ? parsedProjects 
        : parsedProjects.filter((p: ProjectData) => p.status === 'approved');
        
      setProjects(visibleProjects);
      setFilteredProjects(visibleProjects);
    }
  }, [user]);

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
