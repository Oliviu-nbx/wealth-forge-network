
export interface Creator {
  id: string;
  name: string;
  avatar?: string;
  initials: string;
  email?: string;
}

export interface ProjectData {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  budget: string;
  requiredSkills: string[];
  creator: Creator;
  createdAt: string;
  featured?: boolean;
  status: 'pending' | 'approved' | 'rejected';
}

export interface TeamMember {
  id: string;
  name: string;
  avatar?: string;
  initials: string;
  role: string;
  joinedAt: string;
}

export interface ProjectTask {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'completed';
  assignee?: TeamMember;
  dueDate?: string;
  createdAt: string;
}

export interface ProjectDocument {
  id: string;
  name: string;
  type: 'pdf' | 'doc' | 'spreadsheet' | 'image' | 'other';
  size: string;
  uploadedBy: TeamMember;
  uploadedAt: string;
  url: string;
}
