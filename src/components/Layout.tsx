
import React from 'react';
import { Headphones, User } from 'lucide-react';
import { Link } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col h-screen bg-background">
      <header className="bg-primary text-primary-foreground py-3 px-4 flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <div className="flex items-center">
          <div className="bg-primary-foreground rounded-full p-1.5 mr-2">
            <Headphones className="h-5 w-5 text-primary" />
          </div>
          <h1 className="text-xl font-bold">Hearit.AI</h1>
        </div>
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
