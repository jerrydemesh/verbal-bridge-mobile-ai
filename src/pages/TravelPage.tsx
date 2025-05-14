
import React, { useState } from 'react';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Plane, MapPin, Compass } from 'lucide-react';
import BottomMenuBar from '@/components/BottomMenuBar';
import { toast } from 'sonner';

const TravelPage = () => {
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [purpose, setPurpose] = useState('leisure');
  const [showAssistant, setShowAssistant] = useState(false);
  const [assistant, setAssistant] = useState<{
    name: string;
    specialty: string;
    description: string;
    avatar: string;
  } | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!city || !country) {
      toast.error('Please enter both city and country');
      return;
    }

    // Simulate AI assistant recommendation based on location and purpose
    const assistants = {
      leisure: [
        {
          name: 'Emma',
          specialty: 'Cultural Experiences',
          description: `Emma specializes in local cultural attractions in ${city}, ${country}. She can recommend museums, art galleries, historical sites, and cultural activities.`,
          avatar: '👩‍🦰',
        },
        {
          name: 'Marco',
          specialty: 'Outdoor Adventures',
          description: `Marco is an expert on outdoor activities in ${city}, ${country}. He can guide you to hiking spots, parks, and nature experiences.`,
          avatar: '👨‍🦱',
        },
      ],
      business: [
        {
          name: 'Alex',
          specialty: 'Business Networking',
          description: `Alex can help you navigate the business landscape in ${city}, ${country}, including networking events and local business etiquette.`,
          avatar: '👨‍💼',
        },
        {
          name: 'Sophia',
          specialty: 'Productivity & Logistics',
          description: `Sophia specializes in business logistics in ${city}, ${country}, including transportation, workspaces, and scheduling.`,
          avatar: '👩‍💼',
        },
      ],
    };

    // Select a random assistant from the appropriate category
    const categoryAssistants = assistants[purpose as 'leisure' | 'business'];
    const selectedAssistant = categoryAssistants[Math.floor(Math.random() * categoryAssistants.length)];
    
    setAssistant(selectedAssistant);
    setShowAssistant(true);
    toast.success('AI travel companion found!');
  };

  const handleReset = () => {
    setShowAssistant(false);
    setCity('');
    setCountry('');
    setPurpose('leisure');
  };

  return (
    <Layout>
      <div className="container px-4 py-8 pb-20">
        <div className="flex items-center gap-2 mb-6">
          <Plane className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold">Travel Companion</h1>
        </div>
        
        {!showAssistant ? (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Where are you traveling?</CardTitle>
              <CardDescription>
                Tell us about your trip and we'll assign the perfect AI assistant for your journey
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <div className="flex items-center space-x-2">
                    <MapPin className="text-muted-foreground h-4 w-4" />
                    <Input 
                      id="city" 
                      placeholder="Enter city" 
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <div className="flex items-center space-x-2">
                    <Compass className="text-muted-foreground h-4 w-4" />
                    <Input 
                      id="country" 
                      placeholder="Enter country" 
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Trip Purpose</Label>
                  <RadioGroup 
                    defaultValue="leisure" 
                    value={purpose}
                    onValueChange={setPurpose}
                    className="flex flex-col space-y-1"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="leisure" id="leisure" />
                      <Label htmlFor="leisure">Leisure/Vacation</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="business" id="business" />
                      <Label htmlFor="business">Business</Label>
                    </div>
                  </RadioGroup>
                </div>
              </CardContent>

              <CardFooter>
                <Button type="submit">Find AI Travel Companion</Button>
              </CardFooter>
            </form>
          </Card>
        ) : (
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Your AI Travel Companion</CardTitle>
                <span className="text-4xl">{assistant?.avatar}</span>
              </div>
              <CardDescription>
                For your trip to {city}, {country}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg">{assistant?.name}</h3>
                <p className="text-sm text-muted-foreground">Specialty: {assistant?.specialty}</p>
              </div>
              
              <div className="bg-muted p-4 rounded-md">
                <p>{assistant?.description}</p>
              </div>
              
              <div className="bg-primary/10 p-4 rounded-md">
                <h4 className="font-medium mb-2">How I can help you:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  {purpose === 'leisure' ? (
                    <>
                      <li>Find local attractions and hidden gems</li>
                      <li>Recommend restaurants and local cuisine</li>
                      <li>Suggest cultural experiences and events</li>
                      <li>Help with transportation options</li>
                    </>
                  ) : (
                    <>
                      <li>Find suitable meeting venues and workspaces</li>
                      <li>Navigate local business customs and etiquette</li>
                      <li>Recommend business dining options</li>
                      <li>Help with travel logistics and scheduling</li>
                    </>
                  )}
                </ul>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleReset} variant="outline">Start Over</Button>
            </CardFooter>
          </Card>
        )}
      </div>
      <BottomMenuBar />
    </Layout>
  );
};

export default TravelPage;
