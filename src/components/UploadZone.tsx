import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Image as ImageIcon, Plus } from 'lucide-react';
import { cn } from '../lib/utils';

interface UploadZoneProps {
  onFilesAdded: (files: File[]) => void;
  className?: string;
}

export const UploadZone: React.FC<UploadZoneProps> = ({ onFilesAdded, className }) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    onFilesAdded(acceptedFiles);
  }, [onFilesAdded]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    multiple: true
  } as any);

  return (
    <div
      {...getRootProps()}
      className={cn(
        "relative group cursor-pointer transition-all duration-300",
        "border-2 border-dashed rounded-3xl p-12 text-center",
        isDragActive 
          ? "border-indigo-500 bg-indigo-50/50" 
          : "border-zinc-200 hover:border-indigo-400 hover:bg-zinc-50/50",
        className
      )}
    >
      <input {...getInputProps()} />
      
      <div className="flex flex-col items-center gap-4">
        <div className={cn(
          "w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300",
          isDragActive ? "bg-indigo-600 text-white scale-110" : "bg-zinc-100 text-zinc-400 group-hover:bg-indigo-100 group-hover:text-indigo-600"
        )}>
          <Upload className="w-8 h-8" />
        </div>
        
        <div className="space-y-1">
          <h3 className="text-lg font-semibold text-zinc-900">
            {isDragActive ? "Drop your images here" : "Upload product photos"}
          </h3>
          <p className="text-sm text-zinc-500 max-w-xs mx-auto">
            Drag and drop your images, or click to browse. Supports PNG, JPG, WebP.
          </p>
        </div>

        <div className="flex items-center gap-2 mt-4">
          <div className="flex -space-x-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-zinc-200 flex items-center justify-center">
                <ImageIcon className="w-4 h-4 text-zinc-400" />
              </div>
            ))}
          </div>
          <span className="text-xs font-medium text-zinc-400">+ Batch upload supported</span>
        </div>
      </div>
    </div>
  );
};
