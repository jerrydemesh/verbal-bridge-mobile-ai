
import React, { useState } from 'react';
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Mic, Upload, StopCircle, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import BottomMenuBar from "@/components/BottomMenuBar";

const RecordPage = () => {
  const { toast } = useToast();
  const [isRecording, setIsRecording] = useState(false);
  const [recordingName, setRecordingName] = useState("");
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [recordingInterval, setRecordingIntervalId] = useState<number | null>(null);

  const handleStartRecording = () => {
    setIsRecording(true);
    setRecordingDuration(0);
    
    const intervalId = window.setInterval(() => {
      setRecordingDuration(prev => prev + 1);
    }, 1000);
    
    setRecordingIntervalId(intervalId as unknown as number);
    
    toast({
      title: "Recording started",
      description: "Your audio is now being recorded.",
    });
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    
    if (recordingInterval) {
      clearInterval(recordingInterval);
      setRecordingIntervalId(null);
    }
    
    toast({
      title: "Recording stopped",
      description: "Your recording has been stopped.",
    });
  };

  const handleSaveRecording = () => {
    if (!recordingName.trim()) {
      toast({
        title: "Name required",
        description: "Please provide a name for your recording.",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Recording saved",
      description: `Your recording "${recordingName}" has been saved.`,
    });
    
    setRecordingName("");
    setRecordingDuration(0);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    
    if (file) {
      toast({
        title: "File imported",
        description: `"${file.name}" has been imported.`,
      });
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Layout>
      <div className="container max-w-md mx-auto p-4 flex flex-col h-screen pb-16">
        <h1 className="text-2xl font-bold mb-4">Record</h1>
        
        <div className="grid gap-4 mb-4">
          <Card>
            <CardHeader>
              <CardTitle>Record Audio</CardTitle>
              <CardDescription>Start recording a new audio or upload an existing file</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {isRecording ? (
                <div className="text-center">
                  <div className="text-3xl font-bold mb-2">{formatTime(recordingDuration)}</div>
                  <div className="animate-pulse flex justify-center">
                    <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  <Button 
                    className="flex flex-col h-24 w-full" 
                    onClick={handleStartRecording}
                  >
                    <Mic className="h-8 w-8 mb-2" />
                    <span>Start Recording</span>
                  </Button>
                  
                  <Button
                    className="flex flex-col h-24 w-full"
                    variant="outline"
                    onClick={() => document.getElementById('file-upload')?.click()}
                  >
                    <Upload className="h-8 w-8 mb-2" />
                    <span>Import Audio</span>
                    <Input
                      id="file-upload"
                      type="file"
                      className="hidden"
                      accept="audio/*"
                      onChange={handleFileUpload}
                    />
                  </Button>
                </div>
              )}
              
              {isRecording && (
                <div className="flex flex-col space-y-2">
                  <Button 
                    variant="destructive" 
                    onClick={handleStopRecording}
                    className="w-full"
                  >
                    <StopCircle className="mr-2 h-4 w-4" />
                    Stop Recording
                  </Button>
                </div>
              )}
              
              {!isRecording && recordingDuration > 0 && (
                <div className="space-y-2">
                  <Input
                    placeholder="Recording name"
                    value={recordingName}
                    onChange={(e) => setRecordingName(e.target.value)}
                  />
                  <Button 
                    className="w-full" 
                    onClick={handleSaveRecording}
                  >
                    <Save className="mr-2 h-4 w-4" />
                    Save Recording
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        <BottomMenuBar />
      </div>
    </Layout>
  );
};

export default RecordPage;
