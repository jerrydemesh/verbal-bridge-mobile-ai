import React, { useState } from 'react';
import { Layout } from "@/components/Layout";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Volume2, Headphones, Bell, Globe, Sun, Moon, Phone, Bot, Bluetooth } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import BottomMenuBar from "@/components/BottomMenuBar";
import { useBluetoothContext } from '@/contexts/BluetoothContext';
import { Loader2 } from 'lucide-react';

const SettingsPage = () => {
  const [apiKey, setApiKey] = useState('');
  const [selectedModel, setSelectedModel] = useState('gpt-3.5-turbo');
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

  const handleSaveApiKey = () => {
    if (apiKey) {
      localStorage.setItem('openai_api_key', apiKey);
    }
  };

  React.useEffect(() => {
    const savedApiKey = localStorage.getItem('openai_api_key');
    if (savedApiKey) {
      setApiKey(savedApiKey);
    }
  }, []);

  return (
    <Layout>
      <div className="container max-w-md mx-auto p-4 flex flex-col h-screen pb-16">
        <h1 className="text-2xl font-bold mb-4">Settings</h1>
        
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="audio">Audio</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>
          
          <TabsContent value="general" className="space-y-4 mt-4">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-6">
                  {/* Bluetooth Section */}
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

                  {/* OpenAI Settings Section */}
                  <div className="space-y-4 pb-4 border-b">
                    <div className="flex items-center space-x-2">
                      <Bot className="h-5 w-5 text-muted-foreground" />
                      <Label className="text-base font-medium">OpenAI Settings</Label>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="api-key">API Key</Label>
                      <div className="space-y-1">
                        <Input
                          id="api-key"
                          type="password"
                          value={apiKey}
                          onChange={(e) => setApiKey(e.target.value)}
                          placeholder="Enter your OpenAI API key"
                        />
                        <p className="text-xs text-muted-foreground">
                          Don't have an API key? <a href="https://platform.openai.com/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Sign up at OpenAI</a>
                        </p>
                      </div>
                      <Button onClick={handleSaveApiKey} className="w-full">
                        Save API Key
                      </Button>
                    </div>
                    {apiKey && (
                      <div className="space-y-2">
                        <Label htmlFor="model">Model</Label>
                        <Select value={selectedModel} onValueChange={setSelectedModel}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select model" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                            <SelectItem value="gpt-4">GPT-4</SelectItem>
                            <SelectItem value="gpt-4-turbo">GPT-4 Turbo</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>

                  {/* Other Settings */}
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
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="audio" className="space-y-4 mt-4">
            <Card>
              <CardContent className="pt-6">
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
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="notifications" className="space-y-4 mt-4">
            <Card>
              <CardContent className="pt-6">
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
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <BottomMenuBar />
      </div>
    </Layout>
  );
};

export default SettingsPage;
