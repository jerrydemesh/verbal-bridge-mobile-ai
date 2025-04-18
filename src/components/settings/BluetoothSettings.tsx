
import React from 'react';
import { Bluetooth, Loader2 } from 'lucide-react';
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useBluetoothContext } from '@/contexts/BluetoothContext';

const BluetoothSettings = () => {
  const { 
    isBluetoothAvailable, 
    isScanning, 
    connectedDevice, 
    discoveredDevices, 
    startScan, 
    stopScan, 
    connectToDevice,
    disconnectDevice 
  } = useBluetoothContext();

  return (
    <div className="space-y-4 pb-4 border-b">
      <div className="flex items-center space-x-2">
        <Bluetooth className="h-5 w-5 text-muted-foreground" />
        <Label className="text-base font-medium">Bluetooth Device</Label>
      </div>
      <div className="space-y-4">
        {connectedDevice ? (
          <>
            <div className="flex items-center gap-2">
              <Bluetooth className="h-5 w-5 text-green-500" />
              <span>Connected to: {connectedDevice.name || connectedDevice.deviceId}</span>
            </div>
            <Button 
              onClick={disconnectDevice} 
              variant="destructive"
              className="w-full"
            >
              Disconnect
            </Button>
          </>
        ) : (
          <>
            <Button 
              onClick={isScanning ? stopScan : startScan} 
              disabled={!isBluetoothAvailable}
              className="w-full"
            >
              {isScanning ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Stop Scanning
                </>
              ) : (
                <>
                  <Bluetooth className="mr-2 h-4 w-4" />
                  Scan for Devices
                </>
              )}
            </Button>
            
            {discoveredDevices.length > 0 && (
              <div className="space-y-2">
                {discoveredDevices.map((device) => (
                  <Button
                    key={device.deviceId}
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => connectToDevice(device.deviceId)}
                  >
                    <Bluetooth className="mr-2 h-4 w-4" />
                    {device.name || `Unknown Device (${device.deviceId.slice(-6)})`}
                  </Button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default BluetoothSettings;
