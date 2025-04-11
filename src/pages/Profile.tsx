
import React from 'react';
import Navbar from '@/components/ui/layout/Navbar';
import ProfileForm from '@/components/profile/ProfileForm';

const Profile = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-2">Profile Settings</h1>
          <p className="text-muted-foreground">
            Update your profile information and preferences
          </p>
        </div>
        
        <ProfileForm />
      </main>
    </div>
  );
};

export default Profile;
