import React from 'react';
import { Sparkles, Image as ImageIcon, Layers, Download } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="border-b border-zinc-200 bg-white/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-1.5 rounded-lg">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-zinc-900">PICS <span className="text-indigo-600">STUDiO</span></span>
          </div>
          
          <nav className="hidden md:flex items-center gap-8">
            <a href="#" className="text-sm font-medium text-zinc-600 hover:text-indigo-600 transition-colors">Dashboard</a>
            <a href="#" className="text-sm font-medium text-zinc-600 hover:text-indigo-600 transition-colors">History</a>
            <a href="#" className="text-sm font-medium text-zinc-600 hover:text-indigo-600 transition-colors">Presets</a>
          </nav>

          <div className="flex items-center gap-4">
          </div>
        </div>
      </div>
    </header>
  );
};
