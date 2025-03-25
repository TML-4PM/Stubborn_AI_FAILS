
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface ImageDropzoneProps {
  onDrop: (file: File) => void;
  children: React.ReactNode;
  isDragging: boolean;
  className?: string;
  disabled?: boolean;
}

const ImageDropzone = ({ 
  onDrop, 
  children, 
  isDragging, 
  className, 
  disabled = false 
}: ImageDropzoneProps) => {
  const [internalDragging, setInternalDragging] = useState(false);
  
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) setInternalDragging(true);
  };
  
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) setInternalDragging(false);
  };
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setInternalDragging(false);
    
    if (disabled) return;
    
    const file = e.dataTransfer.files?.[0];
    if (file) {
      onDrop(file);
    }
  };

  // Combine external and internal dragging state
  const isActiveDragging = isDragging || internalDragging;

  return (
    <div 
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className={cn(
        className,
        disabled ? 'pointer-events-none' : ''
      )}
    >
      {children}
    </div>
  );
};

export default ImageDropzone;
