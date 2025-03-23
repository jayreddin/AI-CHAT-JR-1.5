
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface ToolbarButtonProps {
  icon: LucideIcon;
  label: string;
  count?: number;
  onClick: () => void;
}

const ToolbarButton: React.FC<ToolbarButtonProps> = ({ icon: Icon, label, count, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-1 p-2 rounded-md transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
      title={label}
    >
      <Icon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
      <span className="text-xs text-gray-600 dark:text-gray-400 whitespace-nowrap">
        {count !== undefined ? `${label} (${count})` : label}
      </span>
    </button>
  );
};

export default ToolbarButton;
