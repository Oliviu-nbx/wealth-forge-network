
import React from 'react';
import ProjectCard, { ProjectCardProps } from './ProjectCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, SlidersHorizontal, TrendingUp, Plus } from 'lucide-react';

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

const ProjectList = () => {
  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold">Discover Projects</h1>
        <Button className="shrink-0 gap-2">
          <Plus size={16} />
          <span>Post a Project</span>
        </Button>
      </div>
      
      <div className="flex flex-col md:flex-row items-center gap-4 mb-8">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search projects by keyword, skill, or location..."
            className="pl-10"
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <Button variant="outline" className="gap-2">
            <SlidersHorizontal size={16} />
            <span className="hidden md:inline">Filters</span>
          </Button>
          <Button variant="outline" className="gap-2">
            <TrendingUp size={16} />
            <span className="hidden md:inline">Sort by</span>
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sampleProjects.map((project) => (
          <ProjectCard key={project.id} {...project} />
        ))}
      </div>
    </div>
  );
};

export default ProjectList;
