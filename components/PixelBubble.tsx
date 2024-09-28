"use client"

import React, { useState, useCallback } from 'react';
import { ArrowRightCircle } from "lucide-react";
import Navbar from "./Navbar";
import Hero from "./hero";
import InputBox from "./input-box";
import OutputBox from "./output-box";

export default function PixelBubble() {
  const [inputImage, setInputImage] = useState<HTMLImageElement | null>(null);
  const [outputImage, setOutputImage] = useState<string | null>(null);
  const [pixelSize, setPixelSize] = useState<number>(10);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const handleImageUpload = useCallback((file: File) => {
    setIsProcessing(true);
    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      const img = new Image();
      img.onload = () => {
        setInputImage(img);
        processImage(img);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }, []);

  const processImage = useCallback((image: HTMLImageElement) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = image.width;
    canvas.height = image.height;

    // Draw the original image
    ctx.drawImage(image, 0, 0);

    // Pixelate the image
    for (let y = 0; y < image.height; y += pixelSize) {
      for (let x = 0; x < image.width; x += pixelSize) {
        //@ts-ignore
        const [r, g, b] = ctx.getImageData(x, y, 1, 1).data;
        ctx.fillStyle = `rgb(${r},${g},${b})`;
        ctx.fillRect(x, y, pixelSize, pixelSize);
      }
    }

    setOutputImage(canvas.toDataURL());
    setIsProcessing(false);
  }, [pixelSize]);

  const handlePixelSizeChange = useCallback((newSize: number) => {
    setPixelSize(newSize);
    if (inputImage) {
      setIsProcessing(true);
      processImage(inputImage);
    }
  }, [inputImage, processImage]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-100 to-pink-100">
      <Navbar />
      <div className="container mx-auto px-4 py-24">
        <Hero />
        <div className="mt-16 flex flex-col items-center justify-center space-y-8 md:flex-row md:space-x-8 md:space-y-0">
          <InputBox onImageUpload={handleImageUpload} onPixelSizeChange={handlePixelSizeChange} pixelSize={pixelSize} />
          <ArrowRightCircle className="h-16 w-16 text-purple-500 rotate-90 md:rotate-0" />
          <OutputBox outputImage={outputImage} isProcessing={isProcessing} />
        </div>
      </div>
    </div>
  );
}