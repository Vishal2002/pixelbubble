import React, { useRef, ChangeEvent } from 'react';
import { Button } from "@/components/ui/button";

interface InputBoxProps {
  onImageUpload: (file: File) => void;
  onPixelSizeChange: (size: number) => void;
  pixelSize: number;
}

export default function InputBox({ onImageUpload, onPixelSizeChange, pixelSize }: InputBoxProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImageUpload(file);
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="rounded-lg bg-white p-6 shadow-md">
        <h2 className="mb-4 text-xl font-semibold text-gray-800">Upload Your Photo</h2>
        <div className="mb-4">
          <label htmlFor="photo-upload" className="block text-sm font-medium text-gray-700">
            Choose a file
          </label>
          <input
            ref={fileInputRef}
            type="file"
            id="photo-upload"
            name="photo-upload"
            accept="image/*"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-300 focus:ring focus:ring-purple-200 focus:ring-opacity-50"
            onChange={handleFileChange}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="pixel-size" className="block text-sm font-medium text-gray-700">
            Pixel Size
          </label>
          <input
            type="number"
            id="pixel-size"
            name="pixel-size"
            min="1"
            max="50"
            value={pixelSize}
            onChange={(e) => onPixelSizeChange(Number(e.target.value))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-300 focus:ring focus:ring-purple-200 focus:ring-opacity-50"
          />
        </div>
        <Button 
          className="w-full bg-purple-600 hover:bg-purple-700"
          onClick={() => fileInputRef.current?.click()}
        >
          Convert to Pixel Art
        </Button>
      </div>
    </div>
  );
}