
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Layout } from "@/components/Layout";
import { useBluetoothContext } from '@/contexts/BluetoothContext';
import { Loader2, Bluetooth } from 'lucide-react';

const BluetoothPage = () => {
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
    <Layout>
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-6">Bluetooth Connection</h1>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Device Status</CardTitle>
            <CardDescription>
              {isBluetoothAvailable 
                ? "Bluetooth is available" 
                : "Bluetooth is not available on this device"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2">
              {connectedDevice ? (
                <>
                  <div className="flex items-center gap-2 mb-4">
                    <Bluetooth className="h-5 w-5 text-green-500" />
                    <span>Connected to: {connectedDevice.name || connectedDevice.deviceId}</span>
                  </div>
                  <Button onClick={disconnectDevice} variant="destructive">
                    Disconnect
                  </Button>
                </>
              ) : (
                <div className="flex flex-col gap-2">
                  {isScanning ? (
                    <div className="flex gap-2">
                      <Button onClick={stopScan} variant="destructive" className="flex-1">
                        Cancel Scanning
                      </Button>
                      <Button onClick={stopScan} variant="outline" className="flex-1">
                        Skip
                      </Button>
                    </div>
                  ) : (
                    <Button 
                      onClick={startScan} 
                      disabled={!isBluetoothAvailable}
                      className="mb-4"
                    >
                      Start Scanning
                    </Button>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        {discoveredDevices.length > 0 && !connectedDevice && (
          <Card>
            <CardHeader>
              <CardTitle>Available Devices</CardTitle>
              <CardDescription>
                Select a device to connect
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-2">
                {discoveredDevices.map((device) => (
                  <Button
                    key={device.deviceId}
                    variant="outline"
                    className="justify-start"
                    onClick={() => connectToDevice(device.deviceId)}
                  >
                    <Bluetooth className="mr-2 h-4 w-4" />
                    {device.name || `Unknown Device (${device.deviceId.slice(-6)})`}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default BluetoothPage;
