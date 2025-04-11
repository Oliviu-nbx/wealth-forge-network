
import React from 'react';
import Navbar from '@/components/ui/layout/Navbar';
import CreateProjectForm from '@/components/projects/CreateProjectForm';

const CreateProject = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-2">Create a New Project</h1>
          <p className="text-muted-foreground">
            Share your vision and find the right partners to make it happen
          </p>
        </div>
        
        <CreateProjectForm />
      </main>
    </div>
  );
};

export default CreateProject;
