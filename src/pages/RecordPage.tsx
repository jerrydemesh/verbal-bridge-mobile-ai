
import React, { useState } from 'react';
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mic, Upload, StopCircle, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import BottomMenuBar from "@/components/BottomMenuBar";
import AudioCard, { AudioRecording } from '@/components/AudioCard';
import { ScrollArea } from "@/components/ui/scroll-area";

const SAMPLE_RECORDINGS: AudioRecording[] = [
  {
    id: '1',
    name: 'Team Meeting',
    date: 'Apr 16, 2025',
    duration: '13:45',
    transcription: 'We discussed the new project timeline and assigned tasks. The design team will provide mockups by Friday, and development will start next Monday.',
    summary: '• Project timeline discussed\n• Tasks assigned\n• Design mockups due Friday\n• Development starts Monday'
  },
  {
    id: '2',
    name: 'Interview with Dr. Smith',
    date: 'Apr 14, 2025',
    duration: '24:30',
    transcription: 'Dr. Smith shared insights about the recent medical research and its applications in everyday healthcare. He emphasized the importance of preventive measures.',
    summary: '• New medical research discussed\n• Applications in healthcare\n• Importance of prevention\n• Follow-up meeting scheduled'
  },
  {
    id: '3',
    name: 'Language Practice - Spanish',
    date: 'Apr 10, 2025',
    duration: '08:20',
    transcription: 'Practice session for basic Spanish conversation including greetings, introductions, and ordering food at a restaurant.',
    summary: '• Basic greeting phrases\n• Self-introduction practice\n• Restaurant vocabulary\n• Common expressions'
  }
];

const RecordPage = () => {
  const { toast } = useToast();
  const [isRecording, setIsRecording] = useState(false);
  const [recordingName, setRecordingName] = useState("");
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [recordingInterval, setRecordingIntervalId] = useState<number | null>(null);
  const [recordings, setRecordings] = useState<AudioRecording[]>(SAMPLE_RECORDINGS);

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
    
    const newRecording: AudioRecording = {
      id: Date.now().toString(),
      name: recordingName,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      duration: formatTime(recordingDuration),
      transcription: "This is an automatically generated transcription of your recording.",
      summary: "• Key point 1\n• Key point 2\n• Key point 3"
    };
    
    setRecordings([newRecording, ...recordings]);
    
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
      const newRecording: AudioRecording = {
        id: Date.now().toString(),
        name: file.name.replace(/\.[^/.]+$/, ""),
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        duration: "00:00", // Duration would be determined from the actual file
        transcription: "This is an automatically generated transcription of your imported audio.",
        summary: "• Key point 1\n• Key point 2\n• Key point 3"
      };
      
      setRecordings([newRecording, ...recordings]);
      
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
      <div className="container max-w-md mx-auto p-4 flex flex-col h-full pb-16">
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
        
        <h2 className="text-xl font-semibold mb-3">Recent Recordings</h2>
        
        <ScrollArea className="flex-1 pr-2">
          {recordings.map((recording) => (
            <AudioCard key={recording.id} recording={recording} />
          ))}
        </ScrollArea>
        
        <BottomMenuBar />
      </div>
    </Layout>
  );
};

export default RecordPage;
