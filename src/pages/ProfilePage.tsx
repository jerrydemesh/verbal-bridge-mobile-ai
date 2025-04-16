
import React from 'react';
import { Layout } from "@/components/Layout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import BottomMenuBar from "@/components/BottomMenuBar";

const profileFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Invalid email address" }),
  currentPassword: z.string().optional(),
  newPassword: z.string().min(8, { message: "Password must be at least 8 characters" }).optional(),
  confirmPassword: z.string().optional(),
}).refine(data => !data.newPassword || data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

const ProfilePage = () => {
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: "John Doe",
      email: "john.doe@example.com",
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (data: z.infer<typeof profileFormSchema>) => {
    console.log("Form submitted:", data);
    toast({
      title: "Profile updated",
      description: "Your profile information has been updated.",
    });
  };

  return (
    <Layout>
      <div className="container max-w-md mx-auto p-4 flex flex-col h-screen pb-16">
        <h1 className="text-2xl font-bold mb-4">User Profile</h1>
        
        <div className="flex items-center mb-6">
          <Avatar className="h-16 w-16 mr-4">
            <AvatarFallback className="bg-primary text-primary-foreground text-lg">JD</AvatarFallback>
          </Avatar>
          
          <div>
            <h2 className="text-xl font-semibold">{form.getValues().name}</h2>
            <p className="text-muted-foreground">{form.getValues().email}</p>
          </div>
        </div>
        
        <div className="mb-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input {...field} type="email" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="pt-2">
                <h3 className="text-lg font-medium mb-2">Change Password</h3>
                
                <FormField
                  control={form.control}
                  name="currentPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Password</FormLabel>
                      <FormControl>
                        <Input {...field} type="password" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Password</FormLabel>
                      <FormControl>
                        <Input {...field} type="password" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm New Password</FormLabel>
                      <FormControl>
                        <Input {...field} type="password" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="flex gap-2 pt-2">
                <Button type="submit">Save Changes</Button>
              </div>
            </form>
          </Form>
        </div>
        
        <BottomMenuBar />
      </div>
    </Layout>
  );
};

export default ProfilePage;
