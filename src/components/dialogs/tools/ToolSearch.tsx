
import React from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ToolSearchProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  source: string;
  setSource: (source: string) => void;
}

const ToolSearch: React.FC<ToolSearchProps> = ({
  searchQuery,
  setSearchQuery,
  source,
  setSource
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search for tools..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      <Tabs value={source} onValueChange={setSource}>
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="github">GitHub</TabsTrigger>
          <TabsTrigger value="reddit">Reddit</TabsTrigger>
          <TabsTrigger value="google">Google</TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
};

export default ToolSearch;
