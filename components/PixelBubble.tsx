"use client"

import React, { useState, useCallback } from 'react';
import { ArrowRightCircle } from "lucide-react";
import Navbar from "./navbar";
import Hero from "./hero";
import InputBox from "./input-box";
import OutputBox from "./output-box";

type OutputType = 'pixel' | 'ascii';

type RGB = [number, number, number];

export default function PixelBubble() {
  const [inputImage, setInputImage] = useState<HTMLImageElement | null>(null);
  const [outputImage, setOutputImage] = useState<string | null>(null);
  const [asciiArt, setAsciiArt] = useState<string | null>(null);
  const [pixelSize, setPixelSize] = useState<number>(10);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [outputType, setOutputType] = useState<OutputType>('pixel');

  const handleImageUpload = useCallback((file: File) => {
    setIsProcessing(true);
    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      const img = new Image();
      img.onload = () => {
        setInputImage(img);
        if (outputType === 'pixel') {
          processPixelArt(img);
        }
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }, [outputType]);

  const processPixelArt = useCallback((image: HTMLImageElement) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.error('Unable to get 2D context');
      setIsProcessing(false);
      return;
    }
  
    const scaleFactor = Math.min(800 / image.width, 800 / image.height);
    const newWidth = Math.floor(image.width * scaleFactor);
    const newHeight = Math.floor(image.height * scaleFactor);
  
    canvas.width = newWidth;
    canvas.height = newHeight;
  
    // Draw and scale the original image
    ctx.drawImage(image, 0, 0, newWidth, newHeight);
  
    const imageData = ctx.getImageData(0, 0, newWidth, newHeight);
    const data = imageData.data;
  
    // Edge detection
    const edgeData = detectEdges(data, newWidth, newHeight, 20);
  
    // Color quantization
    const palette = generateImprovedPalette();
    const quantizedData = quantizeColors(data, palette);
  
    // Pixelate
    for (let y = 0; y < newHeight; y += pixelSize) {
      for (let x = 0; x < newWidth; x += pixelSize) {
        const i = (y * newWidth + x) * 4;
        const [r, g, b] = [quantizedData[i], quantizedData[i + 1], quantizedData[i + 2]];
        const edge = edgeData[y * newWidth + x];
  
        ctx.fillStyle = edge ? 'rgba(0,0,0,0.3)' : `rgb(${r},${g},${b})`;
        ctx.fillRect(x, y, pixelSize, pixelSize);
  
        // Add subtle highlight
        ctx.fillStyle = 'rgba(255,255,255,0.1)';
        ctx.fillRect(x, y, pixelSize / 2, pixelSize / 2);
      }
    }
  
    setOutputImage(canvas.toDataURL());
    setAsciiArt(null);
    setIsProcessing(false);
  }, [pixelSize]);
  
  
  const isEyeRegion = (x: number, y: number, width: number, height: number): boolean => {
    const eyeRegionTop = height * 0.15;
    const eyeRegionBottom = height * 0.45;
    const eyeRegionLeft = width * 0.15;
    const eyeRegionRight = width * 0.85;
    
    return y > eyeRegionTop && y < eyeRegionBottom && x > eyeRegionLeft && x < eyeRegionRight;
  };
  
  const isEyeColor = (data: Uint8ClampedArray, x: number, y: number, width: number): boolean => {
    const i = (y * width + x) * 4;
    const [r, g, b] = [data[i], data[i + 1], data[i + 2]];
    const brightness = (r + g + b) / 3;
    return brightness < 100 && Math.abs(r - g) < 20 && Math.abs(r - b) < 20; // Dark colors with low color variance
  };
  
  const getAverageColor = (data: Uint8ClampedArray, x: number, y: number, width: number, size: number): RGB => {
    let rSum = 0, gSum = 0, bSum = 0, count = 0;
    
    for (let dy = 0; dy < size; dy++) {
      for (let dx = 0; dx < size; dx++) {
        const i = ((y + dy) * width + (x + dx)) * 4;
        rSum += data[i];
        gSum += data[i + 1];
        bSum += data[i + 2];
        count++;
      }
    }
    
    return [Math.round(rSum / count), Math.round(gSum / count), Math.round(bSum / count)];
  };
  
  const enhanceFacialFeatures = (ctx: CanvasRenderingContext2D, width: number, height: number, pixelSize: number) => {
    // Enhance eyes
    const eyePositions = [
      {x: width * 0.35, y: height * 0.4},
      {x: width * 0.65, y: height * 0.4}
    ];
    
    eyePositions.forEach(pos => {
      ctx.fillStyle = 'white';
      ctx.fillRect(pos.x - pixelSize, pos.y - pixelSize, pixelSize * 3, pixelSize * 3);
      ctx.fillStyle = 'black';
      ctx.fillRect(pos.x, pos.y, pixelSize, pixelSize);
    });
  
    // Enhance mouth
    const mouthY = height * 0.7;
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.fillRect(width * 0.4, mouthY, width * 0.2, pixelSize);
  };
  
  
  
  const generateImprovedPalette = (): RGB[] => {
    return [
      // Skin tones
      [255, 224, 196], // Light skin
      [234, 192, 134], // Medium skin
      [161, 102, 94],  // Dark skin
      // Natural colors
      [139, 69, 19],   // Brown
      [34, 139, 34],   // Forest Green
      [0, 191, 255],   // Deep Sky Blue
      [255, 215, 0],   // Gold
      // Original vibrant colors
      [255, 0, 0],     // Red
      [0, 255, 0],     // Green
      [0, 0, 255],     // Blue
      [255, 255, 0],   // Yellow
      [255, 0, 255],   // Magenta
      [0, 255, 255],   // Cyan
      [255, 128, 0],   // Orange
      [128, 0, 255],   // Purple
      [255, 255, 255], // White
      [0, 0, 0],       // Black
      [128, 128, 128], // Gray
    ];
  };
  
  const quantizeColors = (data: Uint8ClampedArray, palette: RGB[]): Uint8ClampedArray => {
    const quantized = new Uint8ClampedArray(data.length);
  
    for (let i = 0; i < data.length; i += 4) {
      const [r, g, b] = [data[i], data[i + 1], data[i + 2]];
      const closestColor = palette.reduce((prev, curr) => {
        const prevDist = colorDistance([r, g, b], prev);
        const currDist = colorDistance([r, g, b], curr);
        return prevDist < currDist ? prev : curr;
      });
  
      quantized[i] = closestColor[0];
      quantized[i + 1] = closestColor[1];
      quantized[i + 2] = closestColor[2];
      quantized[i + 3] = data[i + 3];
    }
  
    return quantized;
  };
  
  const colorDistance = (c1: RGB, c2: RGB): number => {
    const rMean = (c1[0] + c2[0]) / 2;
    const r = c1[0] - c2[0];
    const g = c1[1] - c2[1];
    const b = c1[2] - c2[2];
    // Weighted distance to account for human perception
    return Math.sqrt((2 + rMean / 256) * r * r + 4 * g * g + (2 + (255 - rMean) / 256) * b * b);
  };

  const detectEdges = (data: Uint8ClampedArray, width: number, height: number,threshold_input:number): boolean[] => {
    const edges: boolean[] = new Array(width * height).fill(false);
    const threshold = threshold_input;

    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        const idx = (y * width + x) * 4;
        const surrounding = [
          data[((y - 1) * width + x - 1) * 4],
          data[((y - 1) * width + x) * 4],
          data[((y - 1) * width + x + 1) * 4],
          data[(y * width + x - 1) * 4],
          data[(y * width + x + 1) * 4],
          data[((y + 1) * width + x - 1) * 4],
          data[((y + 1) * width + x) * 4],
          data[((y + 1) * width + x + 1) * 4],
        ];

        const avgSurrounding = surrounding.reduce((a, b) => a + b) / surrounding.length;
        const diff = Math.abs(data[idx] - avgSurrounding);

        edges[y * width + x] = diff > threshold;
      }
    }

    return edges;
  };

 
  // const processAsciiArt = useCallback((image: HTMLImageElement) => {
  //   // ... (keep the existing processAsciiArt function)
  // }, []);

  const handlePixelSizeChange = useCallback((newSize: number) => {
    setPixelSize(newSize);
    if (inputImage && outputType === 'pixel') {
      setIsProcessing(true);
      processPixelArt(inputImage);
    }
  }, [inputImage, outputType, processPixelArt]);

  const handleOutputTypeChange = useCallback((type: OutputType) => {
    setOutputType(type);
    if (inputImage) {
      setIsProcessing(true);
      if (type === 'pixel') {
        processPixelArt(inputImage);
      }
    }
  }, [inputImage, processPixelArt]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-100 to-pink-100">
      <Navbar />
      <div className="container mx-auto px-4 py-24">
        <Hero />
        <div className="mt-16 flex flex-col items-center justify-center space-y-8 md:flex-row md:space-x-8 md:space-y-0">
          <InputBox 
            onImageUpload={handleImageUpload} 
            onPixelSizeChange={handlePixelSizeChange} 
            pixelSize={pixelSize}
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