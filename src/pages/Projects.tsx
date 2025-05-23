
import React from 'react';
import Navbar from '@/components/ui/layout/Navbar';
import ProjectList from '@/components/projects/ProjectList';

const Projects = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-2">Projects</h1>
          <p className="text-muted-foreground">
            Discover opportunities and collaborate with like-minded entrepreneurs
          </p>
        </div>
        <ProjectList />
      </main>
    </div>
  );
};

export default Projects;
