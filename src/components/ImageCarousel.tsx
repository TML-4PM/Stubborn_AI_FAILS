
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from "@/components/ui/carousel";
import { useEffect, useState } from "react";
import { AIFail } from "@/data/sampleFails";

// Animated effect for images
const ImageEffect = ({ children }: { children: React.ReactNode }) => (
  <div className="relative overflow-hidden rounded-xl shadow-lg transition-all duration-500 hover:shadow-xl">
    <div className="absolute inset-0 bg-gradient-to-tr from-fail/10 to-primary/5 opacity-60 mix-blend-multiply"></div>
    <div className="absolute -inset-1 bg-gradient-to-tr from-fail to-primary/80 opacity-10 blur-xl filter"></div>
    {children}
  </div>
);

interface ImageCarouselProps {
  fails: AIFail[];
}

const ImageCarousel = ({ fails }: ImageCarouselProps) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <Carousel
      opts={{
        align: "start",
        loop: true,
      }}
      className="w-full max-w-5xl mx-auto"
    >
      <CarouselContent>
        {fails.map((fail) => (
          <CarouselItem key={fail.id} className="sm:basis-1/2 lg:basis-1/3">
            <div className="p-2 h-full">
              <ImageEffect>
                <div className="aspect-square relative overflow-hidden rounded-xl">
                  <img
                    src={fail.imageUrl}
                    alt={fail.title}
                    className="w-full h-full object-cover transition-all duration-700 hover:scale-110"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                    <h3 className="text-white font-medium line-clamp-1">
                      {fail.title}
                    </h3>
                  </div>
                </div>
              </ImageEffect>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <div className="flex justify-center mt-4 gap-2">
        <CarouselPrevious className="relative static left-0 translate-y-0 bg-fail text-white border-none hover:bg-fail/90" />
        <CarouselNext className="relative static right-0 translate-y-0 bg-fail text-white border-none hover:bg-fail/90" />
      </div>
    </Carousel>
  );
};

export default ImageCarousel;
