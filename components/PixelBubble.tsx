"use client"

import React, { useState, useCallback } from 'react';
import { ArrowRightCircle } from "lucide-react";
import Navbar from "./navbar";
import Hero from "./hero";
import InputBox from "./input-box";
import OutputBox from "./output-box";

export default function PixelBubble() {
  const [inputImage, setInputImage] = useState<HTMLImageElement | null>(null);
  const [outputImage, setOutputImage] = useState<string | null>(null);
  const [asciiArt, setAsciiArt] = useState<string | null>(null);
  const [pixelSize, setPixelSize] = useState<number>(10);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [outputType, setOutputType] = useState<'pixel' | 'ascii'>('pixel');

  const handleImageUpload = useCallback((file: File) => {
    setIsProcessing(true);
    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      const img = new Image();
      img.onload = () => {
        setInputImage(img);
        if (outputType === 'pixel') {
          processPixelArt(img);
        } else {
          processAsciiArt(img);
        }
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }, [outputType]);

  const processPixelArt = useCallback((image: HTMLImageElement) => {
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
    setAsciiArt(null);
    setIsProcessing(false);
  }, [pixelSize]);

  const processAsciiArt = useCallback((image: HTMLImageElement) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const asciiChars = ['@', '#', 'S', '%', '?', '*', '+', ';', ':', ',', '.'];
    const width = Math.floor(image.width);
    const height = Math.floor(image.height);

    canvas.width = width;
    canvas.height = height;
    ctx.fillStyle = 'green';
    ctx.fillRect(0, 0, width, height);
    ctx.drawImage(image, 0, 0, width, height);

    let result = '';
    for (let y = 0; y < height; y += 2) {
      for (let x = 0; x < width; x++) {
        //@ts-ignore
        const [r, g, b] = ctx.getImageData(x, y, 1, 1).data;
        const brightness = (r + g + b) / 3;
        const charIndex = Math.floor(brightness / 255 * (asciiChars.length - 1));
        ctx.fillStyle = `rgb(${brightness}, ${brightness}, ${brightness})`;
        ctx.fillText(asciiChars[charIndex], x, y);
        result += asciiChars[charIndex];
      }
      result += '\n';
    }

    setAsciiArt(canvas.toDataURL());
    setOutputImage(null);
    setIsProcessing(false);
  }, []);

  const handlePixelSizeChange = useCallback((newSize: number) => {
    setPixelSize(newSize);
    if (inputImage && outputType === 'pixel') {
      setIsProcessing(true);
      processPixelArt(inputImage);
    }
  }, [inputImage, outputType, processPixelArt]);

  const handleOutputTypeChange = useCallback((type: 'pixel' | 'ascii') => {
    setOutputType(type);
    if (inputImage) {
      setIsProcessing(true);
      if (type === 'pixel') {
        processPixelArt(inputImage);
      } else {
        processAsciiArt(inputImage);
      }
    }
  }, [inputImage, processPixelArt, processAsciiArt]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-100 to-pink-100">
      <Navbar />
      <div className="container mx-auto px-4 py-24">
        <Hero />
        <div className="mt-16 flex flex-col items-center justify-center space-y-8 md:flex-row md:space-x-8 md:space-y-0">
          <InputBox 
            onImageUpload={handleImageUpload} 
            onPixelSizeChange={handlePixelSizeChange} 
            pixelSize={10}
            outputType={outputType}
            onOutputTypeChange={handleOutputTypeChange}
          />
          <ArrowRightCircle className="h-16 w-16 text-purple-500 rotate-90 md:rotate-0" />
          <OutputBox 
            outputImage={outputImage} 
            asciiArt={asciiArt}
            isProcessing={isProcessing} 
            outputType={outputType}
          />
        </div>
      </div>
    </div>
  );
}