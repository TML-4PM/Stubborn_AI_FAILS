
import { Skeleton } from "@/components/ui/skeleton";

export const FailCardSkeleton = () => (
  <div className="overflow-hidden transition-all">
    <div className="aspect-[4/3] overflow-hidden relative">
      <Skeleton className="w-full h-full" />
    </div>
    <div className="p-4 space-y-3">
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <div className="flex gap-2">
        <Skeleton className="h-5 w-16" />
        <Skeleton className="h-5 w-20" />
      </div>
    </div>
    <div className="p-4 pt-0 flex items-center justify-between">
      <div className="flex items-center">
        <Skeleton className="h-6 w-6 rounded-full mr-2" />
        <Skeleton className="h-4 w-24" />
      </div>
      <div className="flex items-center space-x-1">
        <Skeleton className="h-8 w-16" />
        <Skeleton className="h-8 w-8" />
      </div>
    </div>
  </div>
);

export const GallerySkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
    {Array.from({ length: 8 }).map((_, i) => (
      <FailCardSkeleton key={i} />
    ))}
  </div>
);
