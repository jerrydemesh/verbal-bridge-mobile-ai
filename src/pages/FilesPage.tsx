import React, { useState } from 'react';
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileAudio, FileText, Calendar, ChevronDown, ChevronUp } from "lucide-react";
import BottomMenuBar from "@/components/BottomMenuBar";

const mockFiles = [
  { id: 1, name: "Meeting with Team", type: "recording", date: "2023-04-15", size: "5.2 MB" },
  { id: 2, name: "Interview Notes", type: "recording", date: "2023-04-14", size: "3.7 MB" },
  { id: 3, name: "English to Spanish", type: "conversation", date: "2023-04-14", size: "12 KB" },
  { id: 4, name: "Voice Memo", type: "recording", date: "2023-04-13", size: "1.8 MB" },
  { id: 5, name: "French Translation", type: "conversation", date: "2023-04-12", size: "8 KB" },
  { id: 6, name: "Project Discussion", type: "recording", date: "2023-04-10", size: "7.3 MB" },
  { id: 7, name: "German Learning", type: "conversation", date: "2023-04-08", size: "15 KB" },
  { id: 8, name: "Quick Note", type: "recording", date: "2023-04-05", size: "0.9 MB" },
];

type SortDirection = "asc" | "desc";
type SortField = "name" | "date" | "size";

const FilesPage = () => {
  const [sortField, setSortField] = useState<SortField>("date");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [groupByType, setGroupByType] = useState(false);
  const [fileTypeFilter, setFileTypeFilter] = useState<string | null>(null);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const getFilteredAndSortedFiles = () => {
    let filteredFiles = [...mockFiles];
    
    if (fileTypeFilter) {
      filteredFiles = filteredFiles.filter(file => file.type === fileTypeFilter);
    }
    
    const sortedFiles = filteredFiles.sort((a, b) => {
      let comparison = 0;
      
      if (sortField === "name") {
        comparison = a.name.localeCompare(b.name);
      } else if (sortField === "date") {
        comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
      } else if (sortField === "size") {
        const sizeA = parseFloat(a.size.split(" ")[0]);
        const sizeB = parseFloat(b.size.split(" ")[0]);
        comparison = sizeA - sizeB;
      }
      
      return sortDirection === "asc" ? comparison : -comparison;
    });
    
    return sortedFiles;
  };

  const getGroupedFiles = () => {
    const files = getFilteredAndSortedFiles();
    const grouped: Record<string, typeof mockFiles> = {};
    
    files.forEach(file => {
      if (!grouped[file.type]) {
        grouped[file.type] = [];
      }
      grouped[file.type].push(file);
    });
    
    return grouped;
  };

  const renderFileIcon = (fileType: string) => {
    switch (fileType) {
      case "recording":
        return <FileAudio className="h-4 w-4 text-blue-500" />;
      case "conversation":
        return <FileText className="h-4 w-4 text-green-500" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const renderSortIcon = (field: SortField) => {
    if (sortField !== field) return null;
    
    return sortDirection === "asc" ? 
      <ChevronUp className="h-4 w-4 inline ml-1" /> : 
      <ChevronDown className="h-4 w-4 inline ml-1" />;
  };

  const renderFilesList = () => {
    const files = getFilteredAndSortedFiles();
    
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12"></TableHead>
            <TableHead className="cursor-pointer" onClick={() => handleSort("name")}>
              Name {renderSortIcon("name")}
            </TableHead>
            <TableHead className="cursor-pointer" onClick={() => handleSort("date")}>
              Date & Time {renderSortIcon("date")}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {files.map(file => (
            <TableRow key={file.id}>
              <TableCell>{renderFileIcon(file.type)}</TableCell>
              <TableCell>{file.name}</TableCell>
              <TableCell>
                {new Date(file.date).toLocaleString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  };

  const renderGroupedFilesList = () => {
    const groupedFiles = getGroupedFiles();
    
    return Object.entries(groupedFiles).map(([type, files]) => (
      <div key={type} className="mb-6">
        <h3 className="text-lg font-semibold capitalize mb-2">{type}s</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12"></TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Date & Time</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {files.map(file => (
              <TableRow key={file.id}>
                <TableCell>{renderFileIcon(file.type)}</TableCell>
                <TableCell>{file.name}</TableCell>
                <TableCell>
                  {new Date(file.date).toLocaleString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    ));
  };

  return (
    <Layout>
      <div className="container max-w-md mx-auto p-4 flex flex-col h-screen pb-16">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Files</h1>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setGroupByType(!groupByType)}
            >
              {groupByType ? "Ungroup" : "Group by Type"}
            </Button>
          </div>
        </div>
        
        <div className="mb-4">
          <Tabs defaultValue="all" onValueChange={(value) => setFileTypeFilter(value === "all" ? null : value)}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="recording">Recordings</TabsTrigger>
              <TabsTrigger value="conversation">Conversations</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        <div className="flex-grow overflow-auto">
          <Card>
            <CardContent className="p-4">
              {groupByType ? renderGroupedFilesList() : renderFilesList()}
            </CardContent>
          </Card>
        </div>
        
        <BottomMenuBar />
      </div>
    </Layout>
  );
};

export default FilesPage;
