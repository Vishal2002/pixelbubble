import React, { useRef, ChangeEvent } from 'react'
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { ImagePlus } from "lucide-react"

interface InputBoxProps {
  onImageUpload: (file: File) => void
  onPixelSizeChange: (size: number) => void
  pixelSize: number
  outputType: 'pixel' | 'ascii'
  onOutputTypeChange: (type: 'pixel' | 'ascii') => void
}

export default function InputBox({ onImageUpload, onPixelSizeChange, pixelSize, outputType, onOutputTypeChange }: InputBoxProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      onImageUpload(file)
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Upload Your Photo</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="photo-upload" className="text-sm font-medium text-gray-700">
            Choose an image file
          </Label>
          <div className="flex items-center space-x-2">
            <Input
              ref={fileInputRef}
              type="file"
              id="photo-upload"
              name="photo-upload"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
            <Button 
              variant="outline" 
              onClick={() => fileInputRef.current?.click()}
              className="w-full"
            >
              <ImagePlus className="mr-2 h-4 w-4" />
              Select Image
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700">
            Output Type
          </Label>
          <RadioGroup 
            defaultValue={outputType} 
            onValueChange={(value) => onOutputTypeChange(value as 'pixel' | 'ascii')}
            className="flex space-x-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="pixel" id="pixel" />
              <Label htmlFor="pixel">Pixel Art</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="ascii" id="ascii" />
              <Label htmlFor="ascii">ASCII Art</Label>
            </div>
          </RadioGroup>
        </div>

        {outputType === 'pixel' && (
          <div className="space-y-2">
            {/* <Label htmlFor="pixel-size" className="text-sm font-medium text-gray-700">
              Pixel Size: {pixelSize}
            </Label> */}
            {/* <Slider
              id="pixel-size"
              min={1}
              max={10}
              step={2}
              value={[pixelSize]}
              onValueChange={(value:any) => onPixelSizeChange(value[0])}
              className="w-full"
            /> */}
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full bg-purple-600 hover:bg-purple-700"
          onClick={() => fileInputRef.current?.click()}
        >
          Convert to {outputType === 'pixel' ? 'Pixel' : 'ASCII'} Art
        </Button>
      </CardFooter>
    </Card>
  )
}