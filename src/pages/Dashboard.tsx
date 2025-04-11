import React from 'react';
import Navbar from '@/components/ui/layout/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ProjectCard, { ProjectCardProps } from '@/components/projects/ProjectCard';
import { TrendingUp, Users, UserPlus, MessageSquare, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

const featuredProjects: ProjectCardProps[] = [
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
];

const connectionSuggestions = [
  {
    id: 'user5',
    name: 'James Wilson',
    title: 'Angel Investor & Entrepreneur',
    avatar: undefined,
    initials: 'JW',
    mutualConnections: 12,
  },
  {
    id: 'user6',
    name: 'Thomas Lee',
    title: 'Real Estate Developer',
    avatar: undefined,
    initials: 'TL',
    mutualConnections: 8,
  },
  {
    id: 'user7',
    name: 'Marcus Brown',
    title: 'Tech Startup Founder',
    avatar: undefined,
    initials: 'MB',
    mutualConnections: 5,
  },
];

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-2">Welcome back, John</h1>
          <p className="text-muted-foreground">
            Connect with potential partners and explore opportunities to build wealth together.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  Network
                </p>
                <h2 className="text-3xl font-bold">24</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Connections
                </p>
              </div>
              <div className="bg-primary/10 p-3 rounded-full">
                <Users size={24} className="text-primary" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  Projects
                </p>
                <h2 className="text-3xl font-bold">3</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Active Collaborations
                </p>
              </div>
              <div className="bg-primary/10 p-3 rounded-full">
                <TrendingUp size={24} className="text-primary" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  Messages
                </p>
                <h2 className="text-3xl font-bold">5</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Unread Messages
                </p>
              </div>
              <div className="bg-primary/10 p-3 rounded-full">
                <MessageSquare size={24} className="text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">Featured Projects</h2>
              <Button asChild variant="outline" size="sm">
                <Link to="/projects">View All</Link>
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {featuredProjects.map((project) => (
                <ProjectCard key={project.id} {...project} />
              ))}
            </div>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Your Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex gap-4 items-start">
                    <div className="bg-muted rounded-full p-2 mt-0.5">
                      <UserPlus size={16} className="text-primary" />
                    </div>
                    <div>
                      <p className="text-sm">
                        <span className="font-medium">David Rodriguez</span> accepted your connection request
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">2 hours ago</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-4 items-start">
                    <div className="bg-muted rounded-full p-2 mt-0.5">
                      <MessageSquare size={16} className="text-primary" />
                    </div>
                    <div>
                      <p className="text-sm">
                        <span className="font-medium">Michael Johnson</span> sent you a message about the Real Estate project
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">Yesterday</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-4 items-start">
                    <div className="bg-muted rounded-full p-2 mt-0.5">
                      <TrendingUp size={16} className="text-primary" />
                    </div>
                    <div>
                      <p className="text-sm">
                        Your SaaS project proposal was viewed by 12 potential investors
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">2 days ago</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="space-y-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <Avatar className="h-20 w-20 mb-4">
                    <AvatarImage src="https://github.com/shadcn.png" alt="John Smith" />
                    <AvatarFallback>JS</AvatarFallback>
                  </Avatar>
                  <h3 className="font-bold text-xl">John Smith</h3>
                  <p className="text-muted-foreground mb-3">Entrepreneur & Investor</p>
                  
                  <div className="flex flex-wrap justify-center gap-2 mb-4">
                    <Badge variant="secondary">Finance</Badge>
                    <Badge variant="secondary">Real Estate</Badge>
                    <Badge variant="secondary">Technology</Badge>
                  </div>
                  
                  <Button asChild className="w-full" variant="outline">
                    <Link to="/profile">Edit Profile</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Suggested Connections</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {connectionSuggestions.map((connection) => (
                    <div key={connection.id} className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={connection.avatar} alt={connection.name} />
                          <AvatarFallback>{connection.initials}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-sm">{connection.name}</p>
                          <p className="text-xs text-muted-foreground">{connection.title}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {connection.mutualConnections} mutual connections
                          </p>
                        </div>
                      </div>
                      <Button size="sm" variant="ghost" className="rounded-full h-8 w-8 p-0">
                        <Plus size={16} />
                      </Button>
                    </div>
                  ))}
                </div>
                
                <Button variant="link" className="w-full mt-2" size="sm">
                  View More
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Quick Links</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link to="/projects">Browse All Projects</Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link to="/projects/create">Post a New Project</Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    Find Investors
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    Financial Resources
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
