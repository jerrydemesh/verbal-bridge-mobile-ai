
import React from 'react';
import { Bell, Bluetooth } from 'lucide-react';
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useBluetoothContext } from '@/contexts/BluetoothContext';

const NotificationSettings = () => {
  const { isBackgroundModeEnabled, toggleBackgroundMode } = useBluetoothContext();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Bell className="h-5 w-5 text-muted-foreground" />
          <Label htmlFor="push-notifications">Push Notifications</Label>
        </div>
        <Switch id="push-notifications" defaultChecked />
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Bell className="h-5 w-5 text-muted-foreground" />
          <Label htmlFor="sound-notifications">Sound Notifications</Label>
        </div>
        <Switch id="sound-notifications" defaultChecked />
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Bluetooth className="h-5 w-5 text-muted-foreground" />
          <Label htmlFor="background-mode">
            Bluetooth Background Mode
          </Label>
        </div>
        <Switch 
          id="background-mode" 
          checked={isBackgroundModeEnabled}
          onCheckedChange={toggleBackgroundMode}
        />
      </div>
    </div>
  );
};

export default NotificationSettings;
