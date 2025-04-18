
import React from 'react';
import { Globe, Sun, Phone } from 'lucide-react';
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const GeneralSettings = () => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Globe className="h-5 w-5 text-muted-foreground" />
          <Label htmlFor="default-language">Default Language</Label>
        </div>
        <Select defaultValue="english">
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="english">English</SelectItem>
            <SelectItem value="spanish">Spanish</SelectItem>
            <SelectItem value="french">French</SelectItem>
            <SelectItem value="german">German</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Sun className="h-5 w-5 text-muted-foreground" />
          <Label htmlFor="theme">Theme</Label>
        </div>
        <Select defaultValue="system">
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="light">Light</SelectItem>
            <SelectItem value="dark">Dark</SelectItem>
            <SelectItem value="system">System</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Phone className="h-5 w-5 text-muted-foreground" />
          <Label htmlFor="save-data">Save Data Mode</Label>
        </div>
        <Switch id="save-data" />
      </div>
    </div>
  );
};

export default GeneralSettings;
