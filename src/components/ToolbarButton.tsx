
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface ToolbarButtonProps {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
  isActive?: boolean;
}

const ToolbarButton: React.FC<ToolbarButtonProps> = ({ icon: Icon, label, onClick, isActive }) => {
  return (
    <button
      onClick={onClick}
      className={`relative group flex flex-col items-center justify-center p-2 rounded-full transition-all duration-200 ${
        isActive
          ? 'bg-primary/20 text-primary'
          : 'bg-white/80 text-gray-700 hover:bg-gray-100'
      }`}
      title={label}
    >
      <Icon size={18} />
      <div className="absolute bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-800 text-white text-xs rounded py-1 px-2 pointer-events-none whitespace-nowrap">
        {label}
      </div>
    </button>
  );
};

export default ToolbarButton;
