import React from 'react';
import { Loader2, CheckCircle2, AlertCircle, Download, Trash2, RefreshCw, FileText } from 'lucide-react';
import { ProcessedImage } from '../types';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

interface ImageCardProps {
  image: ProcessedImage;
  onRemove: (id: string) => void;
  onRetry: (id: string) => void;
}

export const ImageCard: React.FC<ImageCardProps> = ({ image, onRemove, onRetry }) => {
  const handleDownload = () => {
    if (!image.processedUrl) return;
    const link = document.createElement('a');
    link.href = image.processedUrl;
    link.download = `lumina-processed-${image.id}.jpg`;
    link.click();
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="group relative bg-white rounded-3xl border border-zinc-200 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col"
    >
      <div className="aspect-square relative bg-zinc-50 shrink-0">
        <img
          src={image.processedUrl || image.originalUrl}
          alt="Product"
          className={cn(
            "w-full h-full object-cover transition-all duration-700",
            image.status === 'processing' && "opacity-50 blur-sm scale-110"
          )}
        />
        
        <AnimatePresence>
          {image.status === 'processing' && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center bg-white/40 backdrop-blur-[2px]"
            >
              <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mb-2" />
              <span className="text-xs font-bold text-indigo-700 tracking-widest uppercase">Processing</span>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onRemove(image.id)}
            className="p-2 bg-white/90 backdrop-blur rounded-full text-zinc-600 hover:text-red-600 shadow-sm transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        {image.status === 'completed' && (
          <div className="absolute bottom-3 right-3">
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-indigo-700 shadow-lg transition-all"
            >
              <Download className="w-4 h-4" />
              Download
            </button>
          </div>
        )}

        {image.status === 'failed' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-red-50/80 backdrop-blur-sm p-4 text-center">
            <AlertCircle className="w-8 h-8 text-red-600 mb-2" />
            <p className="text-xs font-medium text-red-800 mb-3">{image.error || 'Processing failed'}</p>
            <button
              onClick={() => onRetry(image.id)}
              className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-red-700 shadow-sm transition-all"
            >
              <RefreshCw className="w-4 h-4" />
              Retry
            </button>
          </div>
        )}
      </div>

      {image.status === 'completed' && image.description && (
        <div className="p-4 bg-zinc-50/50 border-t border-zinc-100">
          <div className="flex items-center gap-2 mb-2 text-zinc-900">
            <FileText className="w-3.5 h-3.5 text-indigo-600" />
            <span className="text-[10px] font-bold uppercase tracking-wider">AI Description</span>
          </div>
          <p className="text-xs text-zinc-600 leading-relaxed italic">
            "{image.description}"
          </p>
        </div>
      )}

      <div className="p-4 border-t border-zinc-100 flex items-center justify-between mt-auto">
        <div className="flex items-center gap-2">
          {image.status === 'completed' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          ) : image.status === 'processing' ? (
            <Loader2 className="w-4 h-4 text-indigo-500 animate-spin" />
          ) : (
            <div className="w-4 h-4 rounded-full border-2 border-zinc-200" />
          )}
          <span className="text-xs font-medium text-zinc-600 capitalize">{image.status}</span>
        </div>
        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">{image.config.style} • {image.config.aspectRatio}</span>
      </div>
    </motion.div>
  );
};
