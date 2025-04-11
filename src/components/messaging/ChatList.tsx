
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search, Send, Paperclip } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatMessage {
  id: string;
  content: string;
  sender: 'me' | 'other';
  timestamp: string;
  read: boolean;
}

interface ChatContact {
  id: string;
  name: string;
  avatar?: string;
  initials: string;
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount?: number;
  online?: boolean;
}

const sampleContacts: ChatContact[] = [
  {
    id: 'contact1',
    name: 'David Rodriguez',
    initials: 'DR',
    lastMessage: "I'm interested in discussing the SaaS project further.",
    lastMessageTime: '10:45 AM',
    unreadCount: 2,
    online: true,
  },
  {
    id: 'contact2',
    name: 'Michael Johnson',
    initials: 'MJ',
    lastMessage: 'When can we schedule a call to discuss the investment details?',
    lastMessageTime: 'Yesterday',
    unreadCount: 0,
    online: false,
  },
  {
    id: 'contact3',
    name: 'Robert Chen',
    initials: 'RC',
    lastMessage: 'Thanks for your interest in the e-commerce opportunity.',
    lastMessageTime: '2 days ago',
    unreadCount: 0,
    online: true,
  },
];

const sampleMessages: Record<string, ChatMessage[]> = {
  contact1: [
    {
      id: 'msg1',
      content: "Hello, I saw your project post and I'm interested in learning more.",
      sender: 'other',
      timestamp: 'Yesterday, 2:30 PM',
      read: true,
    },
    {
      id: 'msg2',
      content: 'Hi David! Thanks for reaching out. What aspects of the project are you most interested in?',
      sender: 'me',
      timestamp: 'Yesterday, 3:15 PM',
      read: true,
    },
    {
      id: 'msg3',
      content: "I'm particularly interested in the technical architecture and how you're planning to approach the market.",
      sender: 'other',
      timestamp: 'Yesterday, 3:45 PM',
      read: true,
    },
    {
      id: 'msg4',
      content: 'I have experience building similar solutions and I think I could bring a lot of value to the team.',
      sender: 'other',
      timestamp: 'Yesterday, 3:47 PM',
      read: true,
    },
    {
      id: 'msg5',
      content: "That sounds great! I'd love to discuss the architecture with you. Do you have any specific ideas based on your past experience?",
      sender: 'me',
      timestamp: 'Yesterday, 4:30 PM',
      read: true,
    },
    {
      id: 'msg6',
      content: "I'm interested in discussing the SaaS project further. When would be a good time to schedule a call?",
      sender: 'other',
      timestamp: 'Today, 10:45 AM',
      read: false,
    },
  ],
  contact2: [
    {
      id: 'msg1',
      content: "Hi there, I'm interested in your real estate investment opportunity.",
      sender: 'me',
      timestamp: '3 days ago',
      read: true,
    },
    {
      id: 'msg2',
      content: 'Great to hear from you! Are you looking to be an active or passive investor?',
      sender: 'other',
      timestamp: '3 days ago',
      read: true,
    },
    {
      id: 'msg3',
      content: "I'd prefer to be an active investor. I have experience managing properties in the Miami area.",
      sender: 'me',
      timestamp: '2 days ago',
      read: true,
    },
    {
      id: 'msg4',
      content: 'When can we schedule a call to discuss the investment details?',
      sender: 'other',
      timestamp: 'Yesterday',
      read: true,
    },
  ],
};

const ChatList = () => {
  const [selectedContact, setSelectedContact] = useState<string | null>('contact1');
  const [messageInput, setMessageInput] = useState('');

  const handleContactSelect = (contactId: string) => {
    setSelectedContact(contactId);
  };

  const handleSendMessage = () => {
    if (messageInput.trim() === '') return;
    
    // In a real app, you would send the message to your backend here
    console.log('Sending message:', messageInput);
    
    // Clear the input
    setMessageInput('');
  };

  const activeContact = selectedContact 
    ? sampleContacts.find(contact => contact.id === selectedContact) 
    : null;
    
  const activeMessages = selectedContact 
    ? sampleMessages[selectedContact] || []
    : [];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 h-[calc(100vh-8rem)] overflow-hidden rounded-lg border">
      {/* Contact list */}
      <div className="border-r md:col-span-1 flex flex-col overflow-hidden">
        <div className="p-4 border-b">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search messages..."
              className="pl-10"
            />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {sampleContacts.map((contact) => (
            <div
              key={contact.id}
              className={cn(
                "flex items-center gap-3 p-4 cursor-pointer hover:bg-muted/50 transition-colors",
                selectedContact === contact.id && "bg-muted"
              )}
              onClick={() => handleContactSelect(contact.id)}
            >
              <div className="relative">
                <Avatar>
                  <AvatarImage src={contact.avatar} alt={contact.name} />
                  <AvatarFallback>{contact.initials}</AvatarFallback>
                </Avatar>
                {contact.online && (
                  <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-background" />
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium truncate">{contact.name}</h3>
                  <span className="text-xs text-muted-foreground">{contact.lastMessageTime}</span>
                </div>
                <p className="text-sm text-muted-foreground truncate">
                  {contact.lastMessage}
                </p>
              </div>
              
              {contact.unreadCount ? (
                <div className="w-5 h-5 rounded-full bg-wf-navy text-white flex items-center justify-center text-xs">
                  {contact.unreadCount}
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </div>
      
      {/* Chat window */}
      <div className="md:col-span-2 flex flex-col overflow-hidden">
        {selectedContact ? (
          <>
            {/* Chat header */}
            <div className="p-4 border-b flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={activeContact?.avatar} alt={activeContact?.name} />
                  <AvatarFallback>{activeContact?.initials}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium">{activeContact?.name}</h3>
                  <p className="text-xs text-muted-foreground">
                    {activeContact?.online ? 'Online' : 'Offline'}
                  </p>
                </div>
              </div>
              
              <div>
                <Button variant="ghost" size="icon">
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {activeMessages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex",
                    message.sender === 'me' ? "justify-end" : "justify-start"
                  )}
                >
                  <div
                    className={cn(
                      "max-w-[80%] rounded-lg p-3",
                      message.sender === 'me'
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    )}
                  >
                    <p className="text-sm">{message.content}</p>
                    <span className="text-xs opacity-70 block text-right mt-1">
                      {message.timestamp}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Message input */}
            <div className="p-4 border-t">
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon">
                  <Paperclip className="h-4 w-4" />
                </Button>
                <Input
                  placeholder="Type a message..."
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="flex-1"
                />
                <Button size="icon" onClick={handleSendMessage} disabled={!messageInput.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center p-4">
              <h3 className="font-medium text-lg mb-2">Select a conversation</h3>
              <p className="text-muted-foreground">
                Choose a contact to start messaging
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatList;
