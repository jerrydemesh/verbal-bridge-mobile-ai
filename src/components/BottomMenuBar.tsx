
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { User, Settings, Mic, Folder } from 'lucide-react';
import { cn } from '@/lib/utils';

const BottomMenuBar = () => {
  const location = useLocation();
  
  const menuItems = [
    { icon: User, label: 'Profile', path: '/profile' },
    { icon: Settings, label: 'Settings', path: '/settings' },
    { icon: Mic, label: 'Record', path: '/record' },
    { icon: Folder, label: 'Files', path: '/files' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t p-2 flex justify-around items-center">
      {menuItems.map((item, index) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.path;
        
        return (
          <Link 
            key={index} 
            to={item.path} 
            className={cn(
              "flex flex-col items-center p-2 rounded-md",
              isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Icon className="h-5 w-5 mb-1" />
            <span className="text-xs">{item.label}</span>
          </Link>
        );
      })}
    </div>
  );
};

export default BottomMenuBar;
