
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from "@/components/ui/carousel";
import { useEffect, useState } from "react";
import { AIFail } from "@/data/sampleFails";
import { ExternalLink } from "lucide-react";

// Animated effect for images
const ImageEffect = ({ children }: { children: React.ReactNode }) => (
  <div className="relative overflow-hidden rounded-xl shadow-lg transition-all duration-500 hover:shadow-xl group">
    <div className="absolute inset-0 bg-gradient-to-tr from-fail/20 to-primary/10 opacity-60 mix-blend-multiply"></div>
    <div className="absolute -inset-1 bg-gradient-to-tr from-fail to-primary/80 opacity-10 blur-xl filter group-hover:opacity-20 transition-opacity duration-300"></div>
    {children}
  </div>
);

interface ImageCarouselProps {
  fails: AIFail[];
}

const ImageCarousel = ({ fails }: ImageCarouselProps) => {
  const [mounted, setMounted] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    setMounted(true);
    
    // Auto-rotate carousel every 5 seconds
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % fails.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [fails.length]);

  if (!mounted) {
    return null;
  }

  return (
    <div className="relative">
      {/* Decorative elements */}
      <div className="absolute -top-6 -left-6 w-12 h-12 rounded-full border border-fail/10 opacity-50"></div>
      <div className="absolute -bottom-6 -right-6 w-12 h-12 rounded-full border border-fail/10 opacity-50"></div>
      <div className="absolute top-1/2 -translate-y-1/2 -left-3 w-6 h-6 bg-fail/5 rounded-full"></div>
      <div className="absolute top-1/2 -translate-y-1/2 -right-3 w-6 h-6 bg-fail/5 rounded-full"></div>
      
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full max-w-5xl mx-auto"
        onSelect={(api) => {
          const index = api?.selectedScrollSnap();
          if (index !== undefined) setActiveIndex(index);
        }}
      >
        <CarouselContent>
          {fails.map((fail, index) => (
            <CarouselItem key={fail.id} className="sm:basis-1/2 lg:basis-1/3">
              <div className="p-2 h-full">
                <ImageEffect>
                  <div className="aspect-square relative overflow-hidden rounded-xl">
                    <img
                      src={fail.imageUrl}
                      alt={fail.title}
                      className="w-full h-full object-cover transition-all duration-700 hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                      <h3 className="text-white font-medium line-clamp-1">
                        {fail.title}
                      </h3>
                      <div className="flex items-center text-xs text-white/70 mt-1">
                        <span>{fail.username}</span>
                        <span className="mx-1.5">•</span>
                        <span>{fail.likes} likes</span>
                      </div>
                    </div>
                    <button className="absolute top-2 right-2 p-1.5 bg-black/30 backdrop-blur-sm rounded-full text-white opacity-0 transform translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </div>
                </ImageEffect>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="flex flex-col items-center mt-6">
          <div className="flex justify-center gap-2 mb-3">
            <CarouselPrevious className="relative static left-0 translate-y-0 bg-fail text-white border-none hover:bg-fail/90" />
            <CarouselNext className="relative static right-0 translate-y-0 bg-fail text-white border-none hover:bg-fail/90" />
          </div>
          <div className="flex gap-1.5 items-center">
            {fails.map((_, index) => (
              <div 
                key={index}
                className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                  index === activeIndex 
                    ? 'bg-fail w-4' 
                    : 'bg-fail/30'
                }`}
              />
            ))}
          </div>
        </div>
      </Carousel>
    </div>
  );
};

export default ImageCarousel;
