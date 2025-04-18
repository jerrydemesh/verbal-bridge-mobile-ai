
import React from 'react';
import { Layout } from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BottomMenuBar from "@/components/BottomMenuBar";
import BluetoothSettings from '@/components/settings/BluetoothSettings';
import OpenAISettings from '@/components/settings/OpenAISettings';
import GeneralSettings from '@/components/settings/GeneralSettings';
import AudioSettings from '@/components/settings/AudioSettings';
import NotificationSettings from '@/components/settings/NotificationSettings';

const SettingsPage = () => {
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
                  <BluetoothSettings />
                  <OpenAISettings />
                  <GeneralSettings />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="audio" className="space-y-4 mt-4">
            <Card>
              <CardContent className="pt-6">
                <AudioSettings />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="notifications" className="space-y-4 mt-4">
            <Card>
              <CardContent className="pt-6">
                <NotificationSettings />
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
