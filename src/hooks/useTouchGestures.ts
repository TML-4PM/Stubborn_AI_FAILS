
import { useCallback, useRef, useState } from 'react';

interface TouchPosition {
  x: number;
  y: number;
}

interface SwipeDirection {
  direction: 'left' | 'right' | 'up' | 'down' | null;
  distance: number;
}

export const useTouchGestures = (
  onSwipe?: (direction: SwipeDirection) => void,
  onPinch?: (scale: number) => void,
  minSwipeDistance = 50
) => {
  const touchStart = useRef<TouchPosition | null>(null);
  const touchEnd = useRef<TouchPosition | null>(null);
  const [scale, setScale] = useState(1);
  const initialDistance = useRef<number>(0);

  const getDistance = (touch1: React.Touch, touch2: React.Touch) => {
    return Math.hypot(
      touch1.clientX - touch2.clientX,
      touch1.clientY - touch2.clientY
    );
  };

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchStart.current = { x: touch.clientX, y: touch.clientY };
    touchEnd.current = null;

    if (e.touches.length === 2) {
      initialDistance.current = getDistance(e.touches[0], e.touches[1]);
    }
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 2 && onPinch) {
      const currentDistance = getDistance(e.touches[0], e.touches[1]);
      const scaleValue = currentDistance / initialDistance.current;
      setScale(scaleValue);
      onPinch(scaleValue);
    }
  }, [onPinch]);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (!touchStart.current || e.touches.length > 0) return;

    const touch = e.changedTouches[0];
    touchEnd.current = { x: touch.clientX, y: touch.clientY };

    const deltaX = touchStart.current.x - touchEnd.current.x;
    const deltaY = touchStart.current.y - touchEnd.current.y;
    const distance = Math.hypot(deltaX, deltaY);

    if (distance < minSwipeDistance) return;

    let direction: SwipeDirection['direction'] = null;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      direction = deltaX > 0 ? 'left' : 'right';
    } else {
      direction = deltaY > 0 ? 'up' : 'down';
    }

    onSwipe?.({ direction, distance });
  }, [onSwipe, minSwipeDistance]);

  return {
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    scale
  };
};
