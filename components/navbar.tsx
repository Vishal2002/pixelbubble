import Link from 'next/link'
import { Github, Users } from 'lucide-react'
import { Button } from "@/components/ui/button"

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white bg-opacity-70 backdrop-blur-md shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-8 w-8 text-purple-600"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <line x1="3" y1="9" x2="21" y2="9" />
              <line x1="9" y1="21" x2="9" y2="9" />
            </svg>
            <span className="text-xl font-bold text-gray-800">PixelBubble</span>
          </Link>
          <div className="flex items-center space-x-4">
            <Button className=' cursor-pointer' variant="outline" size="sm" asChild>
              <Link href="https://github.com/yourusername/pixelbubble" target="_blank" rel="noopener noreferrer">
                <Github className="mr-2 h-4 w-4" />
                Star on GitHub
              </Link>
            </Button>
            <Button className=' cursor-pointer' variant="outline" size="sm" asChild>
              <Link href="https://peerlist.io/yourusername" target="_blank" rel="noopener noreferrer">
                <Users className="mr-2 h-4 w-4" />
                Peerlist
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}