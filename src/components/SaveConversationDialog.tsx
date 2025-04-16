
import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Save } from 'lucide-react';
import { toast } from 'sonner';

type ConversationDialogProps = {
  onSave: (name: string) => void;
};

const SaveConversationDialog = ({ onSave }: ConversationDialogProps) => {
  const [conversationName, setConversationName] = useState('');
  const [open, setOpen] = useState(false);

  const handleSave = () => {
    if (conversationName.trim() === '') {
      toast.error('Please enter a conversation name');
      return;
    }
    
    onSave(conversationName);
    setConversationName('');
    setOpen(false);
    toast.success('Conversation saved successfully');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <Save className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Save Conversation</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <Input
            placeholder="Enter conversation name"
            value={conversationName}
            onChange={(e) => setConversationName(e.target.value)}
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SaveConversationDialog;
