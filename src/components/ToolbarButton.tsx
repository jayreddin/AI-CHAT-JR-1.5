
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface ToolbarButtonProps {
  icon: LucideIcon;
  label: string;
  count?: number;
  size?: number;
  onClick: () => void;
}

const ToolbarButton: React.FC<ToolbarButtonProps> = ({ icon: Icon, label, count, size = 20, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-0.5 p-1.5 rounded-md transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 shrink-0"
      title={label}
    >
      <Icon className="text-gray-700 dark:text-gray-300" size={size} />
      <span className="text-[10px] text-gray-600 dark:text-gray-400 whitespace-nowrap">
        {count !== undefined ? `${label} (${count})` : label}
      </span>
    </button>
  );
};

export default ToolbarButton;
