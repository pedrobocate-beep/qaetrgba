import React from 'react';
import { Gamepad2, PenTool } from 'lucide-react';

interface StartOverlayProps {
  onStart: () => void;
  isVisible: boolean;
}

export const StartOverlay: React.FC<StartOverlayProps> = ({ onStart, isVisible }) => {
  return (
    <div 
      className={`fixed inset-0 bg-gradient-to-br from-purple-600 via-purple-700 to-purple-900 z-[60] flex flex-col items-center justify-center transition-opacity duration-500 ${!isVisible ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
    >
      <div className="text-center p-4">
        <div className="mb-6 animate-bounce flex justify-center">
             <Gamepad2 className="w-24 h-24 text-white" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg tracking-wider">
          BYTEZ CODE TEST
        </h1>
        <p className="text-xl text-purple-200 mb-10">
          Cole seu código HTML e execute!
        </p>
        <button 
          onClick={onStart}
          className="bg-white hover:bg-purple-100 text-purple-700 font-bold py-4 px-10 rounded-2xl text-xl transition-all transform hover:scale-105 shadow-2xl flex items-center gap-3 mx-auto cursor-pointer"
        >
          <PenTool className="w-6 h-6" />
          <span>Começar</span>
        </button>
      </div>
    </div>
  );
};