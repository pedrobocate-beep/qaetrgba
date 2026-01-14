import React from 'react';

interface GameFrameProps {
  isPlaying: boolean;
  iframeRef: React.RefObject<HTMLIFrameElement>;
}

export const GameFrame: React.FC<GameFrameProps> = ({ isPlaying, iframeRef }) => {
  return (
    <div className="w-full h-full relative bg-gray-900">
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900 text-gray-500 z-10">
          <p className="text-2xl font-medium">O seu jogo vai aparecer aqui</p>
        </div>
      )}
      
      <iframe 
        ref={iframeRef}
        className={`w-full h-full border-0 bg-white ${isPlaying ? 'block' : 'hidden'}`}
        sandbox="allow-scripts allow-same-origin allow-pointer-lock allow-forms allow-modals"
        title="Game Preview"
      />
    </div>
  );
};