
import React from 'react';
import Navbar from '@/components/ui/layout/Navbar';
import ProjectList from '@/components/projects/ProjectList';

const Projects = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <ProjectList />
      </main>
    </div>
  );
};

export default Projects;
