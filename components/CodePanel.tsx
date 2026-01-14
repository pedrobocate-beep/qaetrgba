import React, { useState, useEffect, useRef } from 'react';
import { Play, Square, Trash2, X, Code2, Sparkles, Send, Loader2, Download, Image as ImageIcon, Plus } from 'lucide-react';

interface CodePanelProps {
  isOpen: boolean;
  onClose: () => void;
  code: string;
  setCode: (code: string) => void;
  onRun: () => void;
  onStop: () => void;
  onClear: () => void;
  onGenerate: (prompt: string, image?: File) => void;
  isGenerating: boolean;
}

export const CodePanel: React.FC<CodePanelProps> = ({ 
  isOpen, 
  onClose, 
  code, 
  setCode, 
  onRun, 
  onStop, 
  onClear, 
  onGenerate,
  isGenerating
}) => {
  const [showAiInput, setShowAiInput] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Reseta o estado da IA quando o painel fecha
  useEffect(() => {
    if (!isOpen) {
      setPrompt('');
      setSelectedImage(null);
      setShowAiInput(false); 
    }
  }, [isOpen]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const target = e.target as HTMLTextAreaElement;
      const start = target.selectionStart;
      const end = target.selectionEnd;
      const newValue = code.substring(0, start) + '    ' + code.substring(end);
      setCode(newValue);
      // Need to defer selection update to after render
      setTimeout(() => {
        target.selectionStart = target.selectionEnd = start + 4;
      }, 0);
    }
  };

  const handleGenerateClick = () => {
    if (prompt.trim() || selectedImage) {
        onGenerate(prompt, selectedImage || undefined);
    }
  };

  const handleDownload = () => {
    if (!code) return;
    const blob = new Blob([code], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'meu-jogo-bytez.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
        setSelectedImage(e.target.files[0]);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    if (fileInputRef.current) {
        fileInputRef.current.value = '';
    }
  };

  return (
    <div className={`fixed left-0 top-0 h-full w-full md:w-[600px] bg-gray-900 z-50 flex flex-col shadow-2xl transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      {/* Header */}
      <div className="bg-gray-800 px-4 py-3 border-b border-gray-700">
        <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            <span className="text-white font-medium flex items-center gap-2 uppercase tracking-wide">
                <Code2 className="w-4 h-4 text-gray-400" />
                BYTEZ CODE TEST
            </span>
            </div>
            <div className="flex items-center gap-2">
                <button 
                    onClick={() => setShowAiInput(!showAiInput)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${showAiInput ? 'bg-purple-600 text-white' : 'bg-gray-700 text-purple-300 hover:bg-gray-600'}`}
                >
                    <Sparkles className="w-4 h-4" />
                    <span>Criar com IA</span>
                </button>
                <button 
                    onClick={onClose} 
                    className="text-gray-400 hover:text-white transition-colors p-1 rounded-md hover:bg-gray-700 cursor-pointer"
                >
                <X className="w-5 h-5" />
                </button>
            </div>
        </div>
        
        {/* AI Input Area */}
        <div className={`overflow-hidden transition-all duration-300 ease-in-out ${showAiInput ? 'max-h-40 opacity-100 mt-2' : 'max-h-0 opacity-0'}`}>
            <div className="bg-gray-900/50 p-3 rounded-xl border border-purple-500/30 flex items-center gap-3">
                <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleImageSelect} 
                    className="hidden" 
                    accept="image/*"
                />
                
                {selectedImage ? (
                    <div className="relative group shrink-0">
                        <img 
                            src={URL.createObjectURL(selectedImage)} 
                            alt="Selected" 
                            className="w-8 h-8 rounded object-cover border border-purple-500 cursor-pointer"
                            onClick={() => fileInputRef.current?.click()}
                        />
                        <button 
                            onClick={(e) => { e.stopPropagation(); removeImage(); }}
                            className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 w-4 h-4 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <X className="w-3 h-3" />
                        </button>
                    </div>
                ) : (
                    <button 
                        onClick={() => fileInputRef.current?.click()}
                        className="text-gray-500 hover:text-purple-400 transition-colors pl-1 shrink-0"
                        title="Adicionar imagem"
                    >
                        <ImageIcon className="w-5 h-5" />
                    </button>
                )}

                <input 
                    type="text" 
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleGenerateClick()}
                    placeholder={selectedImage ? "Descreva o que fazer com a imagem..." : "Insira comando ou lógica... (Imagens funcionam!)"}
                    className="flex-1 bg-transparent text-white placeholder-gray-500 focus:outline-none text-sm py-1 min-w-0"
                    disabled={isGenerating}
                />
                <button 
                    onClick={handleGenerateClick}
                    disabled={isGenerating || (!prompt.trim() && !selectedImage)}
                    className="text-purple-400 hover:text-purple-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors p-1 shrink-0"
                >
                    {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                </button>
            </div>
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 relative">
        <textarea 
          value={code}
          onChange={(e) => setCode(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full h-full bg-[#1e1e1e] text-green-400 p-4 text-sm font-mono leading-relaxed resize-none focus:outline-none"
          placeholder="Cole seu código HTML aqui ou use a IA para criar..."
          spellCheck={false}
        />
        
        {isGenerating && (
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center z-10">
                <Loader2 className="w-10 h-10 text-purple-500 animate-spin mb-3" />
                <p className="text-purple-200 font-medium animate-pulse">Criando seu código...</p>
            </div>
        )}
      </div>
      
      {/* Buttons */}
      <div className="bg-gray-800 p-4 flex flex-col sm:flex-row gap-3 border-t border-gray-700">
        <button 
          onClick={onRun} 
          className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-3 px-6 rounded-xl transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2 shadow-lg cursor-pointer"
        >
          <Play className="w-5 h-5 fill-current" />
          <span>Executar</span>
        </button>
        
        <div className="flex gap-3">
            <button 
              onClick={handleDownload} 
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md"
              title="Baixar Código"
            >
              <Download className="w-5 h-5" />
            </button>

            <button 
            onClick={onStop} 
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md"
            title="Parar"
            >
            <Square className="w-5 h-5 fill-current" />
            </button>
            
            <button 
            onClick={onClear} 
            className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md"
            title="Limpar"
            >
            <Trash2 className="w-5 h-5" />
            </button>
        </div>
      </div>
    </div>
  );
};