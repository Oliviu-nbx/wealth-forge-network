
import React from 'react';
import Navbar from '@/components/ui/layout/Navbar';
import ChatList from '@/components/messaging/ChatList';

const Messages = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-2">Messages</h1>
          <p className="text-muted-foreground">
            Connect and collaborate with your network
          </p>
        </div>
        
        <ChatList />
      </main>
    </div>
  );
};

export default Messages;
