import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { UploadZone } from './components/UploadZone';
import { SettingsPanel } from './components/SettingsPanel';
import { ImageCard } from './components/ImageCard';
import { ProcessedImage, ProcessingConfig } from './types';
import { fileToBase64, resizeAndCropImage } from './lib/utils';
import { processProductImage, generateProductDescription } from './services/geminiService';
import { Sparkles, Layers, Wand2, Zap, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const DEFAULT_CONFIG: ProcessingConfig = {
  style: 'minimal',
  aspectRatio: '1:1',
  resolution: 1080,
  brightness: 100,
  contrast: 100,
  sharpness: 100,
};

export default function App() {
  const [images, setImages] = useState<ProcessedImage[]>([]);
  const [config, setConfig] = useState<ProcessingConfig>(DEFAULT_CONFIG);
  const [isProcessingAll, setIsProcessingAll] = useState(false);
  
  const isApiKeyMissing = !process.env.GEMINI_API_KEY || 
                          process.env.GEMINI_API_KEY === "undefined" || 
                          process.env.GEMINI_API_KEY === "MY_GEMINI_API_KEY";

  const handleFilesAdded = useCallback(async (files: File[]) => {
    const newImages: ProcessedImage[] = await Promise.all(
      files.map(async (file) => ({
        id: Math.random().toString(36).substring(7),
        originalUrl: await fileToBase64(file),
        status: 'pending',
        config: { ...config },
      }))
    );
    setImages((prev) => [...prev, ...newImages]);
  }, [config]);

  const processImage = async (image: ProcessedImage) => {
    setImages((prev) =>
      prev.map((img) =>
        img.id === image.id ? { ...img, status: 'processing', error: undefined } : img
      )
    );

    try {
      // 1. AI Background Removal & Generation
      const aiProcessedPromise = processProductImage(
        image.originalUrl,
        'image/png',
        image.config.style
      );

      // 2. AI Description Generation (Parallel)
      const descriptionPromise = generateProductDescription(
        image.originalUrl,
        'image/png'
      );

      const [aiProcessed, description] = await Promise.all([
        aiProcessedPromise,
        descriptionPromise
      ]);

      if (!aiProcessed) throw new Error('AI failed to process image');

      // 3. Resizing & Enhancements
      const [widthRatio, heightRatio] = image.config.aspectRatio.split(':').map(Number);
      const targetWidth = image.config.resolution;
      const targetHeight = Math.round((targetWidth / widthRatio) * heightRatio);

      const finalUrl = await resizeAndCropImage(
        aiProcessed,
        targetWidth,
        targetHeight,
        image.config.brightness,
        image.config.contrast
      );

      setImages((prev) =>
        prev.map((img) =>
          img.id === image.id
            ? { ...img, status: 'completed', processedUrl: finalUrl, description: description || undefined }
            : img
        )
      );
    } catch (error) {
      setImages((prev) =>
        prev.map((img) =>
          img.id === image.id
            ? { ...img, status: 'failed', error: error instanceof Error ? error.message : 'Unknown error' }
            : img
        )
      );
    }
  };

  const handleProcessAll = async () => {
    setIsProcessingAll(true);
    const pendingImages = images.filter((img) => img.status === 'pending' || img.status === 'failed');
    
    // Process in sequence to avoid overwhelming the API
    for (const img of pendingImages) {
      await processImage(img);
    }
    setIsProcessingAll(false);
  };

  const handleRemove = (id: string) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
  };

  const handleRetry = (id: string) => {
    const img = images.find((i) => i.id === id);
    if (img) processImage(img);
  };

  return (
    <div className="min-h-screen bg-zinc-50 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      <Header />

      {isApiKeyMissing && (
        <div className="bg-amber-50 border-b border-amber-200 py-3 px-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-amber-800 text-sm font-medium">
              <Zap className="w-4 h-4 fill-amber-500 text-amber-500" />
              <span>
                <strong>API Key Missing:</strong> Please add your <code>GEMINI_API_KEY</code> to your environment variables or Netlify settings to enable AI processing.
              </span>
            </div>
            <a 
              href="https://ai.google.dev/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-xs font-bold text-amber-900 underline hover:no-underline"
            >
              Get API Key →
            </a>
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Controls */}
          <div className="lg:col-span-4 space-y-6">
            <div className="space-y-2 mb-8">
              <h1 className="text-4xl font-bold tracking-tight text-zinc-900">
                Product <span className="text-indigo-600">Perfect</span>
              </h1>
              <p className="text-zinc-500">
                Transform your product photos into professional e-commerce assets in seconds.
              </p>
            </div>

            <SettingsPanel config={config} onChange={setConfig} />

            <div className="bg-white rounded-3xl border border-zinc-200 p-6 space-y-4 shadow-sm">
              <h3 className="font-semibold flex items-center gap-2">
                <Wand2 className="w-4 h-4 text-indigo-600" />
                Pro Tips
              </h3>
              <ul className="text-sm text-zinc-500 space-y-3">
                <li className="flex gap-2">
                  <span className="text-indigo-600 font-bold">•</span>
                  Use high-resolution original photos for best results.
                </li>
                <li className="flex gap-2">
                  <span className="text-indigo-600 font-bold">•</span>
                  Ensure the product is well-lit and not obstructed.
                </li>
                <li className="flex gap-2">
                  <span className="text-indigo-600 font-bold">•</span>
                  Try different styles to see which matches your brand best.
                </li>
              </ul>
            </div>

            <div className="bg-indigo-600 rounded-3xl p-6 text-white shadow-lg shadow-indigo-200 relative overflow-hidden group">
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4">
                  <Zap className="w-5 h-5 fill-white" />
                  <span className="text-sm font-bold uppercase tracking-wider">AI Engine</span>
                </div>
                <h3 className="text-xl font-bold mb-2">Ready to process?</h3>
                <p className="text-indigo-100 text-sm mb-6">
                  Our AI will automatically detect your product, remove the background, and generate a matching scene.
                </p>
                <button
                  onClick={handleProcessAll}
                  disabled={isProcessingAll || images.length === 0 || isApiKeyMissing}
                  className="w-full bg-white text-indigo-600 py-3 rounded-2xl font-bold hover:bg-indigo-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isProcessingAll ? (
                    <>
                      <Wand2 className="w-5 h-5 animate-pulse" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      Generate Assets
                    </>
                  )}
                </button>
              </div>
              <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-indigo-500 rounded-full blur-3xl opacity-50 group-hover:scale-150 transition-transform duration-700" />
            </div>
          </div>

          {/* Right Column: Workspace */}
          <div className="lg:col-span-8 space-y-8">
            {images.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <UploadZone onFilesAdded={handleFilesAdded} className="h-[500px]" />
              </motion.div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <h2 className="text-xl font-bold text-zinc-900">Workspace</h2>
                    <span className="bg-zinc-200 text-zinc-600 px-2.5 py-0.5 rounded-full text-xs font-bold">
                      {images.length} {images.length === 1 ? 'Image' : 'Images'}
                    </span>
                  </div>
                  <button 
                    onClick={() => setImages([])}
                    className="text-sm font-medium text-zinc-400 hover:text-red-600 transition-colors"
                  >
                    Clear All
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <AnimatePresence mode="popLayout">
                    {images.map((img) => (
                      <ImageCard
                        key={img.id}
                        image={img}
                        onRemove={handleRemove}
                        onRetry={handleRetry}
                      />
                    ))}
                    <motion.div
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <button
                        onClick={() => document.querySelector<HTMLInputElement>('input[type="file"]')?.click()}
                        className="w-full aspect-square border-2 border-dashed border-zinc-200 rounded-3xl flex flex-col items-center justify-center gap-3 text-zinc-400 hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50/30 transition-all group"
                      >
                        <div className="w-12 h-12 rounded-2xl bg-zinc-100 flex items-center justify-center group-hover:bg-indigo-100 transition-colors">
                          <Layers className="w-6 h-6" />
                        </div>
                        <span className="text-sm font-semibold">Add more images</span>
                      </button>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            )}
          </div>

        </div>
      </main>

      <footer className="border-t border-zinc-200 bg-white py-12 mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-4 opacity-50">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span className="text-sm font-bold tracking-tight text-zinc-900">PICS STUDiO</span>
          </div>
          <p className="text-zinc-400 text-xs">
            Powered by Gemini AI • Professional E-commerce Tools • © 2026 PICS STUDiO by MD. Irfan
          </p>
        </div>
      </footer>
    </div>
  );
}
