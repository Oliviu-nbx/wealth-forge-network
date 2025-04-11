
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { MapPin, DollarSign, Briefcase, Tags } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';
import { ProjectData } from '@/lib/types';

const projectCategories = [
  { value: 'real-estate', label: 'Real Estate' },
  { value: 'technology', label: 'Technology' },
  { value: 'e-commerce', label: 'E-commerce' },
  { value: 'cryptocurrency', label: 'Cryptocurrency' },
  { value: 'finance', label: 'Finance' },
  { value: 'other', label: 'Other' }
];

const CreateProjectForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useUser();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    location: '',
    budget: '',
    skills: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to create a project",
        variant: "destructive",
      });
      navigate('/login');
      return;
    }
    
    setIsSubmitting(true);
    
    // Create new project object
    const newProject: ProjectData = {
      id: `project-${Date.now()}`,
      title: formData.title,
      description: formData.description,
      category: formData.category || 'other',
      location: formData.location || 'Remote',
      budget: formData.budget || 'Not specified',
      requiredSkills: formData.skills ? formData.skills.split(',').map(s => s.trim()) : [],
      creator: {
        id: user.id,
        name: user.name,
        initials: user.initials,
        avatar: user.avatar
      },
      createdAt: new Date().toISOString().split('T')[0],
      status: user.isAdmin ? 'approved' : 'pending'
    };
    
    // Save to localStorage
    const existingProjects = localStorage.getItem('wealthforge_projects');
    const projects = existingProjects ? JSON.parse(existingProjects) : [];
    projects.push(newProject);
    localStorage.setItem('wealthforge_projects', JSON.stringify(projects));
    
    // Show success message
    toast({
      title: user.isAdmin ? "Project Created" : "Project Submitted for Review",
      description: user.isAdmin 
        ? "Your project has been successfully created" 
        : "Your project has been submitted and is pending admin approval",
    });
    
    setIsSubmitting(false);
    navigate('/projects');
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Create New Project</CardTitle>
        <CardDescription>
          Share your project idea and find the right collaborators
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Project Title</Label>
            <Input 
              id="title" 
              name="title" 
              required 
              placeholder="Enter a clear, concise title for your project"
              value={formData.title}
              onChange={handleChange}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Project Description</Label>
            <Textarea 
              id="description" 
              name="description" 
              required 
              rows={5}
              placeholder="Describe your project, goals, and the type of partners you're looking for"
              value={formData.description}
              onChange={handleChange}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select 
                value={formData.category} 
                onValueChange={(value) => handleSelectChange('category', value)}
              >
                <SelectTrigger id="category" className="w-full">
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-muted-foreground" />
                    <SelectValue placeholder="Select category" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {projectCategories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  id="location" 
                  name="location" 
                  className="pl-10" 
                  placeholder="City, State or Remote"
                  value={formData.location}
                  onChange={handleChange}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="budget">Budget / Investment Range</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  id="budget" 
                  name="budget" 
                  className="pl-10" 
                  placeholder="e.g. $10K - $50K"
                  value={formData.budget}
                  onChange={handleChange}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="skills">Required Skills</Label>
              <div className="relative">
                <Tags className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  id="skills" 
                  name="skills" 
                  className="pl-10" 
                  placeholder="e.g. React, Finance, Real Estate (comma separated)"
                  value={formData.skills}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => navigate('/projects')}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating Project..." : "Create Project"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default CreateProjectForm;
