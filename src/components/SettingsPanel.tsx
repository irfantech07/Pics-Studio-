import React from 'react';
import { Settings2, Maximize2, Palette, Sliders } from 'lucide-react';
import { ImageStyle, ProcessingConfig } from '../types';
import { cn } from '../lib/utils';

interface SettingsPanelProps {
  config: ProcessingConfig;
  onChange: (config: ProcessingConfig) => void;
}

const STYLES: { id: ImageStyle; label: string; icon: string }[] = [
  { id: 'minimal', label: 'Minimal', icon: '⚪' },
  { id: 'luxury', label: 'Luxury', icon: '💎' },
  { id: 'tech', label: 'Tech', icon: '💻' },
  { id: 'soft', label: 'Soft', icon: '🌸' },
  { id: 'premium', label: 'Premium', icon: '✨' },
  { id: 'outdoor', label: 'Outdoor', icon: '🌿' },
  { id: 'studio', label: 'Studio', icon: '📸' },
];

export const SettingsPanel: React.FC<SettingsPanelProps> = ({ config, onChange }) => {
  return (
    <div className="bg-white rounded-3xl border border-zinc-200 p-6 space-y-8 shadow-sm">
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-zinc-900">
          <Palette className="w-5 h-5 text-indigo-600" />
          <h3 className="font-semibold">Background Style</h3>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 gap-2">
          {STYLES.map((style) => (
            <button
              key={style.id}
              onClick={() => onChange({ ...config, style: style.id })}
              className={cn(
                "flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium transition-all border",
                config.style === style.id
                  ? "bg-indigo-50 border-indigo-200 text-indigo-700 shadow-sm"
                  : "bg-white border-zinc-100 text-zinc-600 hover:border-zinc-300"
              )}
            >
              <span>{style.icon}</span>
              {style.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2 text-zinc-900">
          <Maximize2 className="w-5 h-5 text-indigo-600" />
          <h3 className="font-semibold">Aspect Ratio</h3>
        </div>
        <div className="flex gap-2">
          {(['1:1', '4:5', '16:9'] as const).map((ratio) => (
            <button
              key={ratio}
              onClick={() => onChange({ ...config, aspectRatio: ratio })}
              className={cn(
                "flex-1 py-2 rounded-xl text-sm font-medium transition-all border",
                config.aspectRatio === ratio
                  ? "bg-indigo-50 border-indigo-200 text-indigo-700 shadow-sm"
                  : "bg-white border-zinc-100 text-zinc-600 hover:border-zinc-300"
              )}
            >
              {ratio}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex items-center gap-2 text-zinc-900">
          <Sliders className="w-5 h-5 text-indigo-600" />
          <h3 className="font-semibold">Enhancements</h3>
        </div>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-medium text-zinc-500">
              <span>Brightness</span>
              <span>{config.brightness}%</span>
            </div>
            <input
              type="range"
              min="50"
              max="150"
              value={config.brightness}
              onChange={(e) => onChange({ ...config, brightness: parseInt(e.target.value) })}
              className="w-full h-1.5 bg-zinc-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs font-medium text-zinc-500">
              <span>Contrast</span>
              <span>{config.contrast}%</span>
            </div>
            <input
              type="range"
              min="50"
              max="150"
              value={config.contrast}
              onChange={(e) => onChange({ ...config, contrast: parseInt(e.target.value) })}
              className="w-full h-1.5 bg-zinc-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
