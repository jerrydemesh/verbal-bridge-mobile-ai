
import React from 'react';
import { User } from 'lucide-react';
import { Link } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col h-screen bg-background">
      <header className="bg-primary text-primary-foreground py-3 px-4 flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <Link to="/" className="flex items-center hover:opacity-90">
          <img 
            src="/lovable-uploads/4518a586-be59-48d0-800b-929c5dda2dae.png" 
            alt="HearIt.AI Logo" 
            className="h-8"
          />
        </Link>
        <Link to="/profile" className="text-primary-foreground hover:bg-primary-foreground/20 rounded-full p-2">
          <User className="h-6 w-6" />
        </Link>
      </header>
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
};
