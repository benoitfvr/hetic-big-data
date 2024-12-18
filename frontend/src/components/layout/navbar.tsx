import { cn } from "../../lib/utils";
import { useEffect, useState } from "react";

interface NavbarProps {
  className?: string;
}

export function Navbar({ className }: NavbarProps) {
  const [opacity, setOpacity] = useState(1);
  const [display, setDisplay] = useState<'block' | 'none'>('block');

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const viewportHeight = window.innerHeight;
      const targetScroll = viewportHeight * 0.4; 
            
      const newOpacity = Math.max(0, 1 - (scrollPosition / targetScroll));
      setOpacity(newOpacity);
      setDisplay(newOpacity === 0 ? 'none' : 'block');
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav 
      style={{ opacity, display }}
      className={cn("fixed top-0 left-1/2 -translate-x-1/2 w-[calc(70%-2rem)] m-4 bg-white border z-50", className)}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <a href="/" className="text-xl font-bold">
              France Bike Data
            </a>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <a 
              href="/map" 
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Carte
            </a>
            <a 
              href="/stats" 
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Statistiques
            </a>
            <a 
              href="/about" 
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              À propos
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}
