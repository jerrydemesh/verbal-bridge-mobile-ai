
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <div className="max-w-md w-full text-center space-y-6">
        <h1 className="text-4xl font-bold mb-4">Voice Bridge</h1>
        <p className="text-xl text-muted-foreground mb-8">Real-time translation and voice recording for meaningful conversations</p>
        
        <div className="space-y-4">
          <Link to="/bluetooth">
            <Button className="w-full">Connect Bluetooth Device</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Index;
