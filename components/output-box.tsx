import React from 'react';
import { Button } from "@/components/ui/button";

interface OutputBoxProps {
  outputImage: string | null;
  asciiArt: string | null;
  isProcessing: boolean;
  outputType: 'pixel' | 'ascii';
}

export default function OutputBox({ outputImage, asciiArt, isProcessing, outputType }: OutputBoxProps) {
  const handleDownload = () => {
    if (outputType === 'pixel' && outputImage) {
      const link = document.createElement('a');
      link.href = outputImage;
      link.download = 'pixel_art.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else if (outputType === 'ascii' && asciiArt) {
      const link = document.createElement('a');
      link.href = asciiArt;
      link.download = 'ascii_art.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="rounded-lg bg-white p-6 shadow-md">
        <h2 className="mb-4 text-xl font-semibold text-gray-800">
          Your {outputType === 'pixel' ? 'Pixel' : 'ASCII'} Art
        </h2>
        <div className="aspect-square w-full bg-gray-200 mb-4 rounded-md overflow-hidden">
          {isProcessing ? (
            <div className="w-full h-full flex items-center justify-center">
              <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-purple-500"></div>
            </div>
          ) : outputType === 'pixel' && outputImage ? (
            <img src={outputImage} alt="Pixel Art" className="w-full h-full object-contain" />
          ) : outputType === 'ascii' && asciiArt ? (
            <img src={asciiArt} alt="ASCII Art" className="w-full h-full object-contain" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              No image processed yet
            </div>
          )}
        </div>
        <Button 
          className="w-full bg-pink-600 hover:bg-pink-700"
          onClick={handleDownload}
          disabled={isProcessing || (!outputImage && !asciiArt)}
        >
          {isProcessing ? 'Processing...' : `Download ${outputType === 'pixel' ? 'Pixel' : 'ASCII'} Art`}
        </Button>
      </div>
    </div>
  );
}