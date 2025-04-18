
import React from 'react';
import { Volume2, Headphones } from 'lucide-react';
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const AudioSettings = () => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Volume2 className="h-5 w-5 text-muted-foreground" />
          <Label htmlFor="text-to-speech">Text-to-Speech</Label>
        </div>
        <Switch id="text-to-speech" defaultChecked />
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Headphones className="h-5 w-5 text-muted-foreground" />
          <Label htmlFor="audio-quality">Audio Quality</Label>
        </div>
        <Select defaultValue="high">
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="high">High</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default AudioSettings;
