
import React, { useState, useEffect } from 'react';
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Mic, Send, MicOff, Volume2, VolumeX } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import SaveConversationDialog from "@/components/SaveConversationDialog";
import BottomMenuBar from "@/components/BottomMenuBar";

type Message = {
  id: string;
  text: string;
  translation: string;
  isUser: boolean;
};

type SavedConversation = {
  id: string;
  name: string;
  messages: Message[];
};

const TranslationPage = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello, how are you today?',
      translation: '¡Hola! ¿Cómo estás hoy?',
      isUser: true
    },
    {
      id: '2',
      text: 'I am doing well, thank you for asking.',
      translation: 'Estoy bien, gracias por preguntar.',
      isUser: false
    }
  ]);
  
  const [sourceLanguage, setSourceLanguage] = useState('english');
  const [targetLanguage, setTargetLanguage] = useState('spanish');
  const [isRecording, setIsRecording] = useState(false);
  const [textToVoiceEnabled, setTextToVoiceEnabled] = useState(false);
  const [savedConversations, setSavedConversations] = useState<SavedConversation[]>([]);

  const handleStartRecording = () => {
    setIsRecording(true);
    // In a real app, this would activate the microphone
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    // In a real app, this would stop recording and process the audio
    
    // Simulate adding a new message
    const newMessage = {
      id: Date.now().toString(),
      text: 'This is a simulated voice message',
      translation: 'Este es un mensaje de voz simulado',
      isUser: true
    };
    
    setMessages([...messages, newMessage]);
  };

  const handleSaveConversation = (name: string) => {
    const newConversation = {
      id: Date.now().toString(),
      name,
      messages: [...messages]
    };
    
    setSavedConversations([...savedConversations, newConversation]);
  };

  // Text-to-speech function
  const speakText = (text: string) => {
    if (textToVoiceEnabled && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(utterance);
    }
  };

  // Speak the last message whenever a new one is added
  useEffect(() => {
    if (messages.length > 0 && !messages[messages.length - 1].isUser) {
      speakText(messages[messages.length - 1].translation);
    }
  }, [messages, textToVoiceEnabled]);

  return (
    <Layout>
      <div className="container max-w-md mx-auto p-4 flex flex-col h-screen pb-16">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Translation</h1>
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              {textToVoiceEnabled ? <Volume2 className="h-4 w-4 mr-2" /> : <VolumeX className="h-4 w-4 mr-2" />}
              <Switch 
                checked={textToVoiceEnabled} 
                onCheckedChange={setTextToVoiceEnabled} 
                aria-label="Toggle text-to-speech"
              />
            </div>
            <SaveConversationDialog onSave={handleSaveConversation} />
          </div>
        </div>
        
        <div className="flex gap-4 mb-4">
          <div className="w-1/2">
            <Select value={sourceLanguage} onValueChange={setSourceLanguage}>
              <SelectTrigger>
                <SelectValue placeholder="Source" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="english">English</SelectItem>
                <SelectItem value="spanish">Spanish</SelectItem>
                <SelectItem value="french">French</SelectItem>
                <SelectItem value="german">German</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="w-1/2">
            <Select value={targetLanguage} onValueChange={setTargetLanguage}>
              <SelectTrigger>
                <SelectValue placeholder="Target" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="english">English</SelectItem>
                <SelectItem value="spanish">Spanish</SelectItem>
                <SelectItem value="french">French</SelectItem>
                <SelectItem value="german">German</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="flex-grow overflow-y-auto mb-4 space-y-4 border rounded-md p-4">
          {messages.map((message) => (
            <div 
              key={message.id} 
              className={`max-w-[80%] ${message.isUser ? 'ml-auto' : 'mr-auto'}`}
            >
              <Card>
                <CardContent className="p-3">
                  <p className="font-medium">{message.text}</p>
                  <p className="text-sm text-muted-foreground mt-1">{message.translation}</p>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant={isRecording ? "destructive" : "default"}
            size="icon" 
            onClick={isRecording ? handleStopRecording : handleStartRecording}
          >
            {isRecording ? <MicOff /> : <Mic />}
          </Button>
          
          <Button 
            variant="outline" 
            className="flex-grow"
            disabled={!isRecording}
          >
            {isRecording ? "Recording..." : "Press mic to start"}
          </Button>
          
          <Button size="icon" disabled={isRecording}>
            <Send />
          </Button>
        </div>
        
        <BottomMenuBar />
      </div>
    </Layout>
  );
};

export default TranslationPage;
