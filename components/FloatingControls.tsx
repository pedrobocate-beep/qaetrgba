import React from 'react';
import { FileCode } from 'lucide-react';

interface FloatingControlsProps {
  onClick: () => void;
}

export const FloatingControls: React.FC<FloatingControlsProps> = ({ onClick }) => {
  return (
    <div className="fixed top-4 left-4 z-40 flex gap-2">
      <button 
        onClick={onClick} 
        className="bg-purple-600 hover:bg-purple-700 text-white font-bold p-3 rounded-xl transition-all shadow-lg flex items-center gap-2 cursor-pointer hover:scale-105"
        title="Abrir Editor"
      >
        <FileCode className="w-6 h-6" />
      </button>
    </div>
  );
};