
import React from 'react';
import ToolItem, { Tool } from './ToolItem';

interface ToolsListProps {
  tools: Tool[];
  expandedToolId: string | null;
  toggleToolExpanded: (id: string) => void;
  toggleToolInstalled: (id: string) => void;
  toggleToolActive: (id: string) => void;
  searchQuery: string;
  source: string;
}

const ToolsList: React.FC<ToolsListProps> = ({
  tools,
  expandedToolId,
  toggleToolExpanded,
  toggleToolInstalled,
  toggleToolActive,
  searchQuery,
  source
}) => {
  // Filter tools based on search query and source
  const filteredTools = tools.filter(tool => {
    const matchesQuery = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         tool.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSource = source === 'all' || tool.source === source;
    return matchesQuery && matchesSource;
  });

  if (filteredTools.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No tools found matching your search criteria
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {filteredTools.map((tool) => (
        <ToolItem
          key={tool.id}
          tool={tool}
          expandedToolId={expandedToolId}
          toggleToolExpanded={toggleToolExpanded}
          toggleToolInstalled={toggleToolInstalled}
          toggleToolActive={toggleToolActive}
        />
      ))}
    </div>
  );
};

export default ToolsList;
