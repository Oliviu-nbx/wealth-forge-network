
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '@/components/ui/layout/Navbar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ArrowLeft, 
  MapPin, 
  Banknote, 
  Users, 
  MessageSquare, 
  Calendar, 
  FileText,
  CheckSquare,
  FileUp,
  BarChart2,
  UserPlus
} from 'lucide-react';
import { ProjectCardProps } from '@/components/projects/ProjectCard';

// Sample project data (normally would be fetched based on ID)
const sampleProjects: ProjectCardProps[] = [
  {
    id: '1',
    title: 'Multi-Family Real Estate Investment Group',
    description: 'Looking for partners to invest in a multi-family property in Downtown Miami. Seeking investors with experience in property management and real estate finance. The target property is a 20-unit building with potential for renovation and increased rental income. Current cap rate is 5% with potential to increase to 8% after improvements.',
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
    description: 'Fintech SaaS startup looking for a technical co-founder with experience in React, Node.js, and financial systems integration. We have secured initial seed funding and have a working prototype. Our target market is small to medium businesses looking for affordable accounting and financial planning solutions.',
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

// Sample team members
const teamMembers = [
  {
    id: 'member1',
    name: 'Sarah Williams',
    role: 'Financial Advisor',
    initials: 'SW',
    joinedAt: '1 day ago',
  },
  {
    id: 'member2',
    name: 'James Lee',
    role: 'Property Manager',
    initials: 'JL',
    joinedAt: '2 days ago',
  },
];

// Sample tasks
const tasks = [
  {
    id: 'task1',
    title: 'Market research for property location',
    assignee: 'Sarah Williams',
    dueDate: '2023-08-15',
    status: 'completed',
  },
  {
    id: 'task2',
    title: 'Financial modeling for acquisition',
    assignee: 'Michael Johnson',
    dueDate: '2023-08-20',
    status: 'in-progress',
  },
  {
    id: 'task3',
    title: 'Property inspection scheduling',
    assignee: 'James Lee',
    dueDate: '2023-08-25',
    status: 'pending',
  },
];

// Sample documents
const documents = [
  {
    id: 'doc1',
    title: 'Investment Proposal.pdf',
    uploadedBy: 'Michael Johnson',
    uploadedAt: '2 days ago',
    size: '2.4 MB',
  },
  {
    id: 'doc2',
    title: 'Financial Projections.xlsx',
    uploadedBy: 'Sarah Williams',
    uploadedAt: '1 day ago',
    size: '1.8 MB',
  },
];

const ProjectDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState('overview');
  
  // Find the project by ID
  const project = sampleProjects.find(p => p.id === id) || sampleProjects[0];
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link to="/projects" className="flex items-center text-muted-foreground hover:text-foreground mb-4">
            <ArrowLeft size={16} className="mr-1" />
            Back to Projects
          </Link>
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant={project.featured ? "default" : "secondary"}>
                  {project.category}
                </Badge>
                {project.featured && (
                  <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                    Featured
                  </Badge>
                )}
              </div>
              <h1 className="text-2xl font-bold">{project.title}</h1>
              <div className="flex items-center mt-2 text-sm text-muted-foreground">
                <span>Posted {project.createdAt}</span>
                <span className="mx-2">•</span>
                <div className="flex items-center">
                  <MapPin size={14} className="mr-1" />
                  {project.location}
                </div>
                <span className="mx-2">•</span>
                <div className="flex items-center">
                  <Banknote size={14} className="mr-1" />
                  {project.budget}
                </div>
              </div>
            </div>
            
            <div className="flex gap-3">
              <Button variant="outline" className="gap-1">
                <UserPlus size={16} />
                <span>Request to Join</span>
              </Button>
              <Button className="gap-1">
                <MessageSquare size={16} />
                <span>Contact</span>
              </Button>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="w-full justify-start mb-4 bg-background">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="team">Team</TabsTrigger>
                <TabsTrigger value="tasks">Tasks</TabsTrigger>
                <TabsTrigger value="documents">Documents</TabsTrigger>
                <TabsTrigger value="finances">Finances</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Project Description</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground whitespace-pre-line">
                      {project.description}
                    </p>
                    
                    <div className="mt-6">
                      <h3 className="font-medium mb-2">Required Skills</h3>
                      <div className="flex flex-wrap gap-2">
                        {project.requiredSkills.map(skill => (
                          <Badge key={skill} variant="outline">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Project Timeline</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                          <Calendar size={20} className="text-primary" />
                        </div>
                        <div>
                          <h3 className="font-medium">Project Start</h3>
                          <p className="text-sm text-muted-foreground">August 15, 2023</p>
                          <p className="mt-1">Initial meeting and project kickoff.</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                          <FileText size={20} className="text-primary" />
                        </div>
                        <div>
                          <h3 className="font-medium">Planning Phase</h3>
                          <p className="text-sm text-muted-foreground">August 15 - September 1, 2023</p>
                          <p className="mt-1">Market research, financial modeling, and property scouting.</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                          <Banknote size={20} className="text-primary" />
                        </div>
                        <div>
                          <h3 className="font-medium">Acquisition Phase</h3>
                          <p className="text-sm text-muted-foreground">September 1 - October 15, 2023</p>
                          <p className="mt-1">Property selection, due diligence, and purchase.</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="team" className="space-y-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Team Members</CardTitle>
                    <Button size="sm">
                      <UserPlus size={16} className="mr-1" />
                      Invite Member
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Project creator */}
                      <div className="flex items-center justify-between p-3 rounded-md border">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarFallback>{project.creator.initials}</AvatarFallback>
                            <AvatarImage src={project.creator.avatar} />
                          </Avatar>
                          <div>
                            <h3 className="font-medium">{project.creator.name}</h3>
                            <p className="text-sm text-muted-foreground">Project Creator</p>
                          </div>
                        </div>
                        <Badge>Owner</Badge>
                      </div>
                      
                      {/* Team members */}
                      {teamMembers.map(member => (
                        <div key={member.id} className="flex items-center justify-between p-3 rounded-md border">
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarFallback>{member.initials}</AvatarFallback>
                            </Avatar>
                            <div>
                              <h3 className="font-medium">{member.name}</h3>
                              <p className="text-sm text-muted-foreground">{member.role}</p>
                            </div>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Joined {member.joinedAt}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="tasks" className="space-y-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Project Tasks</CardTitle>
                    <Button size="sm">
                      <CheckSquare size={16} className="mr-1" />
                      Add Task
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {tasks.map(task => (
                        <div 
                          key={task.id} 
                          className="flex items-center justify-between p-3 rounded-md border"
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-3 h-3 rounded-full ${
                              task.status === 'completed' ? 'bg-green-500' : 
                              task.status === 'in-progress' ? 'bg-blue-500' : 'bg-gray-300'
                            }`} />
                            <div>
                              <h3 className="font-medium">{task.title}</h3>
                              <p className="text-sm text-muted-foreground">
                                Assigned to: {task.assignee}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant={
                              task.status === 'completed' ? 'default' : 
                              task.status === 'in-progress' ? 'secondary' : 'outline'
                            }>
                              {task.status === 'completed' ? 'Completed' : 
                               task.status === 'in-progress' ? 'In Progress' : 'Pending'}
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                              Due: {new Date(task.dueDate).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="documents" className="space-y-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Shared Documents</CardTitle>
                    <Button size="sm">
                      <FileUp size={16} className="mr-1" />
                      Upload
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {documents.map(doc => (
                        <div 
                          key={doc.id} 
                          className="flex items-center justify-between p-3 rounded-md border"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center">
                              <FileText size={20} className="text-primary" />
                            </div>
                            <div>
                              <h3 className="font-medium">{doc.title}</h3>
                              <p className="text-sm text-muted-foreground">
                                Uploaded by {doc.uploadedBy} • {doc.uploadedAt}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">{doc.size}</span>
                            <Button variant="ghost" size="sm">Download</Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="finances" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Budget & Expenses</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div>
                        <h3 className="font-medium mb-2">Budget Overview</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <Card className="bg-muted/50">
                            <CardContent className="p-4">
                              <p className="text-sm text-muted-foreground">Total Budget</p>
                              <p className="text-2xl font-bold">$750,000</p>
                            </CardContent>
                          </Card>
                          <Card className="bg-muted/50">
                            <CardContent className="p-4">
                              <p className="text-sm text-muted-foreground">Spent</p>
                              <p className="text-2xl font-bold">$125,000</p>
                            </CardContent>
                          </Card>
                          <Card className="bg-muted/50">
                            <CardContent className="p-4">
                              <p className="text-sm text-muted-foreground">Remaining</p>
                              <p className="text-2xl font-bold">$625,000</p>
                            </CardContent>
                          </Card>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="font-medium mb-2">Recent Expenses</h3>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center p-3 border rounded-md">
                            <div>
                              <p className="font-medium">Property Inspection</p>
                              <p className="text-sm text-muted-foreground">August 10, 2023</p>
                            </div>
                            <p className="font-medium">$2,500</p>
                          </div>
                          <div className="flex justify-between items-center p-3 border rounded-md">
                            <div>
                              <p className="font-medium">Market Analysis Report</p>
                              <p className="text-sm text-muted-foreground">August 5, 2023</p>
                            </div>
                            <p className="font-medium">$1,800</p>
                          </div>
                          <div className="flex justify-between items-center p-3 border rounded-md">
                            <div>
                              <p className="font-medium">Legal Consultation</p>
                              <p className="text-sm text-muted-foreground">July 28, 2023</p>
                            </div>
                            <p className="font-medium">$3,200</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
          
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Project Creator</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center text-center">
                  <Avatar className="h-20 w-20 mb-4">
                    <AvatarFallback className="text-xl">{project.creator.initials}</AvatarFallback>
                    <AvatarImage src={project.creator.avatar} />
                  </Avatar>
                  <h3 className="font-bold text-lg">{project.creator.name}</h3>
                  <p className="text-muted-foreground mb-4">Project Creator</p>
                  <Button className="w-full" variant="outline">View Profile</Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Quick Access</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="outline" className="w-full justify-start gap-2">
                  <MessageSquare size={16} />
                  <span>Message Team</span>
                </Button>
                <Button variant="outline" className="w-full justify-start gap-2">
                  <FileText size={16} />
                  <span>Investment Proposal</span>
                </Button>
                <Button variant="outline" className="w-full justify-start gap-2">
                  <BarChart2 size={16} />
                  <span>Financial Projections</span>
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Financial Resources</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link to="#" className="block p-3 border rounded-md hover:bg-muted/50">
                  <h3 className="font-medium">Real Estate Investment Guide</h3>
                  <p className="text-sm text-muted-foreground">Learn the fundamentals of real estate investing.</p>
                </Link>
                <Link to="#" className="block p-3 border rounded-md hover:bg-muted/50">
                  <h3 className="font-medium">Cap Rate Calculator</h3>
                  <p className="text-sm text-muted-foreground">Tool to determine potential return on investment.</p>
                </Link>
                <Link to="#" className="block p-3 border rounded-md hover:bg-muted/50">
                  <h3 className="font-medium">Tax Benefits of Real Estate</h3>
                  <p className="text-sm text-muted-foreground">Understanding tax advantages for investors.</p>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProjectDetails;
