
import React from 'react';
import { FileAudio, ChevronDown, ChevronUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

export interface AudioRecording {
  id: string;
  name: string;
  date: string;
  duration: string;
  transcription: string;
  summary: string;
}

interface AudioCardProps {
  recording: AudioRecording;
}

const AudioCard: React.FC<AudioCardProps> = ({ recording }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <Card className="mb-4">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center">
            <FileAudio className="h-5 w-5 mr-2 text-primary" />
            <div>
              <CardTitle className="text-base">{recording.name}</CardTitle>
              <CardDescription>{recording.date} • {recording.duration}</CardDescription>
            </div>
          </div>
          <CollapsibleTrigger asChild onClick={() => setIsOpen(!isOpen)}>
            <Button variant="ghost" size="sm">
              {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </CollapsibleTrigger>
        </div>
      </CardHeader>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleContent>
          <CardContent className="pt-0">
            <div className="space-y-3">
              <div>
                <h4 className="text-sm font-medium mb-1">Transcription</h4>
                <p className="text-sm text-muted-foreground">{recording.transcription}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-1">AI Summary</h4>
                <p className="text-sm text-muted-foreground">{recording.summary}</p>
              </div>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};

export default AudioCard;
