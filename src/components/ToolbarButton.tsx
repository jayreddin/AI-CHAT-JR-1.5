
import React from 'react';
import { LucideIcon } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface ToolbarButtonProps {
  icon: LucideIcon;
  label: string;
  count?: number;
  onClick: () => void;
}

const ToolbarButton: React.FC<ToolbarButtonProps> = ({ icon: Icon, label, count, onClick }) => {
  const isMobile = useIsMobile();
  const buttonSize = isMobile ? 16 : 20;
  
  return (
    <button
      onClick={onClick}
      className="relative flex flex-col items-center gap-1 p-2 rounded-md transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
      title={label}
    >
      <Icon className="w-5 h-5 text-gray-700 dark:text-gray-300" size={buttonSize} />
      <span className="text-xs text-gray-600 dark:text-gray-400 whitespace-nowrap">
        {count !== undefined ? `${label} (${count})` : label}
      </span>
      
      {count && count > 0 && (
        <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
          {count > 9 ? '9+' : count}
        </span>
      )}
    </button>
  );
};

export default ToolbarButton;
