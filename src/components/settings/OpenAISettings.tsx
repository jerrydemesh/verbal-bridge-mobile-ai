
import React, { useState, useEffect } from 'react';
import { Bot } from 'lucide-react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const OpenAISettings = () => {
  const [apiKey, setApiKey] = useState('');
  const [selectedModel, setSelectedModel] = useState('gpt-3.5-turbo');

  const handleSaveApiKey = () => {
    if (apiKey) {
      localStorage.setItem('openai_api_key', apiKey);
    }
  };

  useEffect(() => {
    const savedApiKey = localStorage.getItem('openai_api_key');
    if (savedApiKey) {
      setApiKey(savedApiKey);
    }
  }, []);

  return (
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
  );
};

export default OpenAISettings;
