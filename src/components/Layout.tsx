
import React from 'react';
import { Headphones } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-background">
      <header className="bg-primary text-primary-foreground py-3 px-4 flex items-center">
        <div className="flex items-center">
          <div className="bg-primary-foreground rounded-full p-1.5 mr-2">
            <Headphones className="h-5 w-5 text-primary" />
          </div>
          <h1 className="text-xl font-bold">Hearit.AI</h1>
        </div>
      </header>
      <main className="min-h-screen pt-2">
        {children}
      </main>
    </div>
  );
};
