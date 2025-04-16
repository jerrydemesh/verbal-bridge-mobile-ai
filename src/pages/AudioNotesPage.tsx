
import React from 'react';
import { Layout } from "@/components/Layout";
import BottomMenuBar from "@/components/BottomMenuBar";

const AudioNotesPage = () => {
  return (
    <Layout>
      <div className="container max-w-md mx-auto p-4 flex flex-col h-screen pb-16">
        <h1 className="text-2xl font-bold mb-4">Short Audio Notes</h1>
        <p className="text-muted-foreground">Audio notes functionality will be displayed here.</p>
        <BottomMenuBar />
      </div>
    </Layout>
  );
};

export default AudioNotesPage;
