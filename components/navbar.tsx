import Link from 'next/link'
import { Github, } from 'lucide-react'
import { Button } from "@/components/ui/button"
import Image from 'next/image'

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white bg-opacity-70 backdrop-blur-md shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-2">
            <Image
             src="/pixels.png"
             width={30}
             height={30}
             alt="Pixels"
            />
            <span className="text-xl font-bold text-gray-800">PixelBubble</span>
          </Link>
          <div className="flex items-center space-x-4">
            <Button className=' cursor-pointer' variant="outline" size="sm" asChild>
              <Link href="https://github.com/Vishal2002/pixelbubble" target="_blank" rel="noopener noreferrer">
                <Github className="mr-2 h-4 w-4" />
                <span className='text-md font-semibold flex justify-center items-center'> Star on Github</span>
              </Link>
            </Button>
            <Button className=' cursor-pointer' variant="outline" size="sm" asChild>
              <Link href="https://peerlist.io/vishal2002/project/pixelbubble" target="_blank" rel="noopener noreferrer">
                <Image
                  src="/Peerlist.png"
                  width={30}
                  height={30}
                  alt="Peerlist"
                />
                <span className='text-md font-semibold'>Upvote on Peerlist</span>
                
              </Link>
            </Button>
            <Button className=' cursor-pointer flex gap-2' variant="outline" size="sm" asChild>
              <Link href="https://x.com/sharma_188" target="_blank" rel="noopener noreferrer">
                <Image
                  src="/x.png"
                  width={15}
                  height={15}
                  alt="X.com"
                />
                <span className='text-md font-semibold'>Follow on X</span>
                
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}