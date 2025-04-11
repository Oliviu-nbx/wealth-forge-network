
import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { X, Plus, Upload, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ProfileForm = () => {
  const { toast } = useToast();
  const [skills, setSkills] = useState<string[]>(['Finance', 'Real Estate']);
  const [interests, setInterests] = useState<string[]>(['Technology', 'Startups']);
  const [newSkill, setNewSkill] = useState('');
  const [newInterest, setNewInterest] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleAddSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const handleAddInterest = () => {
    if (newInterest.trim() && !interests.includes(newInterest.trim())) {
      setInterests([...interests, newInterest.trim()]);
      setNewInterest('');
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setSkills(skills.filter(s => s !== skill));
  };

  const handleRemoveInterest = (interest: string) => {
    setInterests(interests.filter(i => i !== interest));
  };

  const handleSaveProfile = () => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated",
      });
    }, 1500);
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Your Profile</CardTitle>
        <CardDescription>
          Build your presence on Wealth Forge Network
        </CardDescription>
      </CardHeader>
      
      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid grid-cols-3 mx-4">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="skills">Skills & Interests</TabsTrigger>
          <TabsTrigger value="financial">Financial Goals</TabsTrigger>
        </TabsList>
        
        <TabsContent value="basic">
          <CardContent className="space-y-6">
            <div className="flex flex-col items-center space-y-4">
              <Avatar className="h-24 w-24">
                <AvatarImage src="https://github.com/shadcn.png" alt="Profile" />
                <AvatarFallback>JS</AvatarFallback>
              </Avatar>
              <Button variant="outline" size="sm" className="flex gap-2">
                <Upload size={16} /> Change Photo
              </Button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input id="fullName" defaultValue="John Smith" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input id="location" defaultValue="New York, NY" />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" defaultValue="john@example.com" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" type="tel" defaultValue="+1 (555) 123-4567" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="bio">About Me</Label>
                <Textarea
                  id="bio"
                  placeholder="Tell others about yourself..."
                  defaultValue="Passionate entrepreneur with 10+ years of experience in technology and real estate investments."
                  rows={4}
                />
              </div>
            </div>
          </CardContent>
        </TabsContent>
        
        <TabsContent value="skills">
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="skills">Skills</Label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {skills.map((skill) => (
                    <Badge key={skill} variant="secondary" className="py-1.5 px-2.5 flex items-center gap-1.5">
                      {skill}
                      <button 
                        type="button" 
                        onClick={() => handleRemoveSkill(skill)}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <X size={14} />
                      </button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    id="newSkill"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    placeholder="Add a skill..."
                    onKeyDown={(e) => e.key === 'Enter' && handleAddSkill()}
                  />
                  <Button type="button" onClick={handleAddSkill} size="icon">
                    <Plus size={16} />
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="interests">Project Interests</Label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {interests.map((interest) => (
                    <Badge key={interest} variant="secondary" className="py-1.5 px-2.5 flex items-center gap-1.5">
                      {interest}
                      <button 
                        type="button" 
                        onClick={() => handleRemoveInterest(interest)}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <X size={14} />
                      </button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    id="newInterest"
                    value={newInterest}
                    onChange={(e) => setNewInterest(e.target.value)}
                    placeholder="Add an interest..."
                    onKeyDown={(e) => e.key === 'Enter' && handleAddInterest()}
                  />
                  <Button type="button" onClick={handleAddInterest} size="icon">
                    <Plus size={16} />
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="experience">Experience</Label>
                <Textarea
                  id="experience"
                  placeholder="Describe your professional experience..."
                  defaultValue="10+ years in technology sector, led 3 successful startups, and managed real estate investment portfolio of $5M."
                  rows={4}
                />
              </div>
            </div>
          </CardContent>
        </TabsContent>
        
        <TabsContent value="financial">
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="investmentGoals">Investment Goals</Label>
                <Textarea
                  id="investmentGoals"
                  placeholder="Describe your investment goals..."
                  defaultValue="Looking for high-growth tech startups and passive income real estate opportunities with 15-20% annual returns."
                  rows={4}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="investmentCapacity">Investment Capacity</Label>
                <div className="grid grid-cols-2 gap-4">
                  <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                    <option value="under50k">Under $50K</option>
                    <option value="50to100k">$50K - $100K</option>
                    <option value="100to250k" selected>$100K - $250K</option>
                    <option value="250to500k">$250K - $500K</option>
                    <option value="500kto1m">$500K - $1M</option>
                    <option value="over1m">Over $1M</option>
                  </select>
                  
                  <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                    <option value="passive">Passive Investor</option>
                    <option value="active" selected>Active Investor</option>
                    <option value="both">Both</option>
                  </select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Preferred Investment Types</Label>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="realEstate" className="rounded" defaultChecked />
                    <label htmlFor="realEstate">Real Estate</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="startups" className="rounded" defaultChecked />
                    <label htmlFor="startups">Startups</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="stocks" className="rounded" />
                    <label htmlFor="stocks">Stocks/ETFs</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="crypto" className="rounded" />
                    <label htmlFor="crypto">Cryptocurrency</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="business" className="rounded" defaultChecked />
                    <label htmlFor="business">Business Acquisitions</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="other" className="rounded" />
                    <label htmlFor="other">Other</label>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </TabsContent>
      </Tabs>
      
      <CardFooter className="flex justify-between border-t p-6">
        <Button variant="outline">Cancel</Button>
        <Button onClick={handleSaveProfile} disabled={isLoading} className="gap-2">
          {isLoading ? "Saving..." : (
            <>
              <CheckCircle2 size={16} />
              Save Profile
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProfileForm;
