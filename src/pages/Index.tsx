
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Bluetooth, MessageSquare, Headphones } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="flex justify-center mb-4">
          <div className="bg-primary rounded-full p-3">
            <Headphones className="h-10 w-10 text-primary-foreground" />
          </div>
        </div>
        <h1 className="text-4xl font-bold mb-4">HearIt.AI</h1>
        <p className="text-xl text-muted-foreground mb-8">Real-time translation and voice recording for meaningful conversations</p>
        
        <div className="space-y-4">
          <Link to="/bluetooth">
            <Button className="w-full flex items-center">
              <Bluetooth className="mr-2 h-4 w-4" />
              Connect Bluetooth Device
            </Button>
          </Link>
          
          <Link to="/translation">
            <Button variant="outline" className="w-full flex items-center">
              <MessageSquare className="mr-2 h-4 w-4" />
              Skip Setup & Continue to App
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Index;
