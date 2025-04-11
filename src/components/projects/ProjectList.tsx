
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProjectCard, { ProjectCardProps } from './ProjectCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Search, 
  SlidersHorizontal, 
  TrendingUp, 
  Plus,
  MapPin,
  Briefcase,
  Tags
} from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

// Sample project data
const sampleProjects: ProjectCardProps[] = [
  {
    id: '1',
    title: 'Multi-Family Real Estate Investment Group',
    description: 'Looking for partners to invest in a multi-family property in Downtown Miami. Seeking investors with experience in property management and real estate finance.',
    category: 'Real Estate',
    location: 'Miami, FL',
    budget: '$500K - $1M',
    requiredSkills: ['Real Estate', 'Property Management', 'Finance'],
    creator: {
      id: 'user1',
      name: 'Michael Johnson',
      initials: 'MJ',
    },
    createdAt: '2 days ago',
    featured: true,
  },
  {
    id: '2',
    title: 'SaaS Startup Seeking Technical Co-Founder',
    description: 'Fintech SaaS startup looking for a technical co-founder with experience in React, Node.js, and financial systems integration.',
    category: 'Technology',
    location: 'Remote',
    budget: '$100K - $250K',
    requiredSkills: ['React', 'Node.js', 'Financial Systems', 'SaaS'],
    creator: {
      id: 'user2',
      name: 'David Rodriguez',
      initials: 'DR',
    },
    createdAt: '5 days ago',
  },
  {
    id: '3',
    title: 'E-commerce Business Acquisition Opportunity',
    description: 'Seeking partner to acquire an established e-commerce business in the fitness niche with $500K annual revenue and 30% profit margins.',
    category: 'E-commerce',
    location: 'Austin, TX',
    budget: '$250K - $500K',
    requiredSkills: ['E-commerce', 'Business Acquisition', 'Marketing'],
    creator: {
      id: 'user3',
      name: 'Robert Chen',
      initials: 'RC',
    },
    createdAt: '1 week ago',
  },
  {
    id: '4',
    title: 'Cryptocurrency Trading Algorithm Development',
    description: 'Forming a team to develop advanced trading algorithms for cryptocurrency markets. Seeking individuals with expertise in algorithmic trading and machine learning.',
    category: 'Cryptocurrency',
    location: 'Remote',
    budget: '$50K - $100K',
    requiredSkills: ['Algorithmic Trading', 'Cryptocurrency', 'Machine Learning'],
    creator: {
      id: 'user4',
      name: 'Alex Thompson',
      initials: 'AT',
    },
    createdAt: '2 weeks ago',
  },
];

const categories = [
  { value: 'all', label: 'All Categories' },
  { value: 'real-estate', label: 'Real Estate' },
  { value: 'technology', label: 'Technology' },
  { value: 'e-commerce', label: 'E-commerce' },
  { value: 'cryptocurrency', label: 'Cryptocurrency' },
  { value: 'finance', label: 'Finance' },
];

const locations = [
  { value: 'all', label: 'All Locations' },
  { value: 'remote', label: 'Remote' },
  { value: 'miami', label: 'Miami, FL' },
  { value: 'austin', label: 'Austin, TX' },
  { value: 'new-york', label: 'New York, NY' },
  { value: 'san-francisco', label: 'San Francisco, CA' },
];

const skillOptions = [
  'Real Estate', 'Property Management', 'Finance', 'React', 'Node.js', 
  'Financial Systems', 'SaaS', 'E-commerce', 'Business Acquisition', 
  'Marketing', 'Algorithmic Trading', 'Cryptocurrency', 'Machine Learning'
];

const budgetRanges = [
  { value: 'all', label: 'All Budgets' },
  { value: '0-50k', label: 'Under $50K' },
  { value: '50k-100k', label: '$50K - $100K' },
  { value: '100k-250k', label: '$100K - $250K' },
  { value: '250k-500k', label: '$250K - $500K' },
  { value: '500k-1m', label: '$500K - $1M' },
  { value: '1m+', label: 'Over $1M' },
];

const sortOptions = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'budget-high', label: 'Budget: High to Low' },
  { value: 'budget-low', label: 'Budget: Low to High' },
];

const ProjectList = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [selectedBudget, setSelectedBudget] = useState('all');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('newest');
  const [filteredProjects, setFilteredProjects] = useState<ProjectCardProps[]>(sampleProjects);
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Handle skill selection toggle
  const toggleSkill = (skill: string) => {
    setSelectedSkills(prev => 
      prev.includes(skill) 
        ? prev.filter(s => s !== skill) 
        : [...prev, skill]
    );
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedLocation('all');
    setSelectedBudget('all');
    setSelectedSkills([]);
    setSortBy('newest');
  };

  // Apply filters and sorting to projects
  useEffect(() => {
    // First, filter the projects
    let filtered = sampleProjects.filter(project => {
      // Filter by search query
      const matchesSearch = 
        searchQuery === '' || 
        project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.requiredSkills.some(skill => 
          skill.toLowerCase().includes(searchQuery.toLowerCase())
        );
      
      // Filter by category
      const matchesCategory = 
        selectedCategory === 'all' || 
        project.category.toLowerCase() === selectedCategory.replace('-', ' ');
      
      // Filter by location
      const matchesLocation = 
        selectedLocation === 'all' || 
        project.location.toLowerCase().includes(selectedLocation.replace('-', ' '));
      
      // Filter by skills
      const matchesSkills = 
        selectedSkills.length === 0 || 
        selectedSkills.some(skill => 
          project.requiredSkills.includes(skill)
        );
      
      // Filter by budget (would need more logic for real implementation)
      const matchesBudget = selectedBudget === 'all';
      
      return matchesSearch && matchesCategory && matchesLocation && matchesSkills && matchesBudget;
    });
    
    // Then, sort the filtered projects
    switch (sortBy) {
      case 'newest':
        // Assume createdAt is already sorted newest first in our sample data
        break;
      case 'oldest':
        filtered = [...filtered].reverse();
        break;
      case 'budget-high':
      case 'budget-low':
        // Would need more logic for real budget sorting
        break;
      default:
        break;
    }
    
    setFilteredProjects(filtered);
    
    // Count active filters for the badge
    let count = 0;
    if (searchQuery) count++;
    if (selectedCategory !== 'all') count++;
    if (selectedLocation !== 'all') count++;
    if (selectedBudget !== 'all') count++;
    if (selectedSkills.length > 0) count++;
    setActiveFiltersCount(count);
    
  }, [searchQuery, selectedCategory, selectedLocation, selectedBudget, selectedSkills, sortBy]);

  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold">Discover Projects</h1>
        <Button className="shrink-0 gap-2" asChild>
          <Link to="/projects/create">
            <Plus size={16} />
            <span>Post a Project</span>
          </Link>
        </Button>
      </div>
      
      <div className="flex flex-col md:flex-row items-center gap-4 mb-8">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search projects by keyword, skill, or location..."
            className="pl-10"
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <Button 
            variant="outline" 
            className="gap-2 relative"
            onClick={() => setShowFilters(true)}
          >
            <SlidersHorizontal size={16} />
            <span className="hidden md:inline">Filters</span>
            {activeFiltersCount > 0 && (
              <Badge 
                variant="secondary" 
                className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
              >
                {activeFiltersCount}
              </Badge>
            )}
          </Button>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="gap-2 w-[160px]">
              <TrendingUp size={16} />
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {/* Filter tags/chips */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {searchQuery && (
            <Badge variant="secondary" className="flex items-center gap-1">
              <span>Search: {searchQuery}</span>
              <button 
                className="ml-1 hover:bg-muted rounded-full" 
                onClick={() => setSearchQuery('')}
              >
                ×
              </button>
            </Badge>
          )}
          
          {selectedCategory !== 'all' && (
            <Badge variant="secondary" className="flex items-center gap-1">
              <Briefcase size={12} />
              <span>{categories.find(c => c.value === selectedCategory)?.label}</span>
              <button 
                className="ml-1 hover:bg-muted rounded-full" 
                onClick={() => setSelectedCategory('all')}
              >
                ×
              </button>
            </Badge>
          )}
          
          {selectedLocation !== 'all' && (
            <Badge variant="secondary" className="flex items-center gap-1">
              <MapPin size={12} />
              <span>{locations.find(l => l.value === selectedLocation)?.label}</span>
              <button 
                className="ml-1 hover:bg-muted rounded-full" 
                onClick={() => setSelectedLocation('all')}
              >
                ×
              </button>
            </Badge>
          )}
          
          {selectedSkills.map(skill => (
            <Badge key={skill} variant="secondary" className="flex items-center gap-1">
              <Tags size={12} />
              <span>{skill}</span>
              <button 
                className="ml-1 hover:bg-muted rounded-full" 
                onClick={() => toggleSkill(skill)}
              >
                ×
              </button>
            </Badge>
          ))}
          
          {activeFiltersCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-xs h-7"
              onClick={clearFilters}
            >
              Clear all
            </Button>
          )}
        </div>
      )}
      
      {filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} {...project} />
          ))}
        </div>
      ) : (
        <div className="text-center py-10 bg-muted/20 rounded-lg">
          <h3 className="text-lg font-medium mb-2">No projects found</h3>
          <p className="text-muted-foreground mb-4">Try adjusting your search filters</p>
          <Button onClick={clearFilters}>Clear Filters</Button>
        </div>
      )}
      
      {/* Filters Dialog */}
      <Dialog open={showFilters} onOpenChange={setShowFilters}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Filter Projects</DialogTitle>
            <DialogDescription>
              Narrow down projects based on your preferences.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            {/* Category filter */}
            <div className="space-y-2">
              <Label>Category</Label>
              <Select 
                value={selectedCategory} 
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger>
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-muted-foreground" />
                    <SelectValue placeholder="Select category" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* Location filter */}
            <div className="space-y-2">
              <Label>Location</Label>
              <Select 
                value={selectedLocation} 
                onValueChange={setSelectedLocation}
              >
                <SelectTrigger>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <SelectValue placeholder="Select location" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {locations.map((location) => (
                    <SelectItem key={location.value} value={location.value}>
                      {location.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* Budget filter */}
            <div className="space-y-2">
              <Label>Budget Range</Label>
              <Select 
                value={selectedBudget} 
                onValueChange={setSelectedBudget}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select budget range" />
                </SelectTrigger>
                <SelectContent>
                  {budgetRanges.map((range) => (
                    <SelectItem key={range.value} value={range.value}>
                      {range.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* Skills filter */}
            <div className="space-y-2">
              <Label>Skills</Label>
              <div className="grid grid-cols-2 gap-2 max-h-[200px] overflow-y-auto p-1">
                {skillOptions.map((skill) => (
                  <div key={skill} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`skill-${skill}`} 
                      checked={selectedSkills.includes(skill)}
                      onCheckedChange={() => toggleSkill(skill)}
                    />
                    <Label 
                      htmlFor={`skill-${skill}`}
                      className="text-sm cursor-pointer"
                    >
                      {skill}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <DialogFooter className="flex justify-between">
            <Button 
              variant="outline" 
              className="mt-2"
              onClick={clearFilters}
            >
              Clear All
            </Button>
            <Button 
              className="mt-2"
              onClick={() => setShowFilters(false)}
            >
              Apply Filters
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProjectList;
