
import React from 'react';
import { Building2, Users, MapPin, Banknote, ArrowUpRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

export interface ProjectCardProps {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  budget: string;
  requiredSkills: string[];
  creator: {
    id: string;
    name: string;
    avatar?: string;
    initials: string;
  };
  createdAt: string;
  featured?: boolean;
}

const ProjectCard = ({
  id,
  title,
  description,
  category,
  location,
  budget,
  requiredSkills,
  creator,
  createdAt,
  featured = false,
}: ProjectCardProps) => {
  return (
    <Card className={cn(
      "overflow-hidden card-hover",
      featured && "border-wf-gold bg-wf-offwhite/50"
    )}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-1 mb-2">
              <Badge variant={featured ? "default" : "secondary"} className="rounded-sm">
                {category}
              </Badge>
              {featured && (
                <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                  Featured
                </Badge>
              )}
            </div>
            <CardTitle className="text-xl">{title}</CardTitle>
          </div>
          <Avatar className="h-10 w-10">
            <AvatarImage src={creator.avatar} alt={creator.name} />
            <AvatarFallback>{creator.initials}</AvatarFallback>
          </Avatar>
        </div>
        <CardDescription className="flex items-center text-xs gap-1">
          <span>Posted by {creator.name}</span> • <span>{createdAt}</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-4">
        <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
          {description}
        </p>
        
        <div className="grid grid-cols-2 gap-3 text-sm mb-4">
          <div className="flex items-center gap-1.5">
            <MapPin size={14} className="text-muted-foreground" />
            <span>{location}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Banknote size={14} className="text-muted-foreground" />
            <span>{budget}</span>
          </div>
        </div>
        
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground">Required skills:</p>
          <div className="flex flex-wrap gap-1.5">
            {requiredSkills.map((skill) => (
              <Badge key={skill} variant="outline" className="text-xs font-normal">
                {skill}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-4 pb-4 bg-muted/20">
        <div className="flex items-center gap-2">
          <Users size={16} className="text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Looking for partners</span>
        </div>
        <Button size="sm" className="gap-1">
          <span>View</span>
          <ArrowUpRight size={14} />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProjectCard;
