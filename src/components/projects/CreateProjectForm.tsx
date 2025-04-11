
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
import { supabase } from '@/integrations/supabase/client';

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

  const handleSubmit = async (e: React.FormEvent) => {
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
    
    try {
      // Format budget as a number if possible
      let numericBudget = null;
      if (formData.budget) {
        // Extract numbers from the budget string (e.g., "$10K - $50K" -> 10000)
        const budgetMatches = formData.budget.match(/\d+/g);
        if (budgetMatches && budgetMatches.length > 0) {
          numericBudget = parseInt(budgetMatches[0], 10);
          // If it's indicated as K (thousands), multiply by 1000
          if (formData.budget.includes('K')) {
            numericBudget *= 1000;
          } else if (formData.budget.includes('M')) {
            numericBudget *= 1000000;
          }
        }
      }
      
      // Create new project in Supabase
      const { data: project, error } = await supabase
        .from('projects')
        .insert({
          title: formData.title,
          description: formData.description,
          category: formData.category || 'other',
          location: formData.location || 'Remote',
          budget: numericBudget,
          creator_id: user.id,
          status: user.isAdmin ? 'approved' : 'pending'
        })
        .select()
        .single();
      
      if (error) throw error;
      
      // If we have skills and the project was created successfully
      if (formData.skills && project) {
        const skills = formData.skills.split(',').map(s => s.trim());
        
        // For each skill, check if it exists or create it
        for (const skillName of skills) {
          // First check if the skill exists
          const { data: existingSkill } = await supabase
            .from('skills')
            .select('id')
            .eq('name', skillName)
            .maybeSingle();
          
          if (existingSkill) {
            // If skill exists, create the relationship with the project
            await supabase
              .from('project_required_skills')
              .insert({
                project_id: project.id,
                skill_id: existingSkill.id
              });
          } else {
            // If skill doesn't exist, create it first
            const { data: newSkill, error: skillError } = await supabase
              .from('skills')
              .insert({ name: skillName })
              .select()
              .single();
            
            if (skillError) {
              console.error('Error creating skill:', skillError);
              continue;
            }
            
            // Then create the relationship with the project
            if (newSkill) {
              await supabase
                .from('project_required_skills')
                .insert({
                  project_id: project.id,
                  skill_id: newSkill.id
                });
            }
          }
        }
      }
      
      // Show success message
      toast({
        title: user.isAdmin ? "Project Created" : "Project Submitted for Review",
        description: user.isAdmin 
          ? "Your project has been successfully created" 
          : "Your project has been submitted and is pending admin approval",
      });
      
      navigate('/projects');
    } catch (error: any) {
      console.error('Error creating project:', error);
      toast({
        title: "Failed to create project",
        description: error.message || "There was a problem creating your project",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
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
