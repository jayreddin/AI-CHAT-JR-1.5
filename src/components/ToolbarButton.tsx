
import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface ToolbarButtonProps {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
  isActive?: boolean;
}

const ToolbarButton: React.FC<ToolbarButtonProps> = ({ icon: Icon, label, onClick, isActive }) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          onClick={onClick}
          className={`relative flex flex-col items-center justify-center p-2 rounded-full transition-all duration-200 ${
            isActive
              ? 'bg-primary/20 text-primary'
              : 'bg-white/80 text-gray-700 hover:bg-gray-100'
          }`}
          aria-label={label}
        >
          <Icon size={18} />
        </button>
      </TooltipTrigger>
      <TooltipContent side="top" className="z-[100] bg-gray-800 text-white border-gray-800">
        {label}
      </TooltipContent>
    </Tooltip>
  );
};

export default ToolbarButton;
