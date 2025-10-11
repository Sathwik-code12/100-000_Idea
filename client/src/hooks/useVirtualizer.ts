import { useMemo, useState, useEffect, useCallback } from 'react';

interface VirtualizerOptions {
  itemHeight: number;
  containerHeight: number;
  items: any[];
  overscan?: number;
}

// Custom hook for virtualizing long lists to improve performance
export function useVirtualizer({ itemHeight, containerHeight, items, overscan = 5 }: VirtualizerOptions) {
  const [scrollTop, setScrollTop] = useState(0);

  const visibleRange = useMemo(() => {
    const itemCount = items.length;
    const visibleCount = Math.ceil(containerHeight / itemHeight);
    const start = Math.floor(scrollTop / itemHeight);
    const end = Math.min(start + visibleCount + overscan, itemCount);
    
    return {
      start: Math.max(0, start - overscan),
      end,
      visibleItems: items.slice(Math.max(0, start - overscan), end)
    };
  }, [scrollTop, itemHeight, containerHeight, items, overscan]);

  const handleScroll = useCallback((e: Event) => {
    const target = e.target as HTMLElement;
    setScrollTop(target.scrollTop);
  }, []);

  const totalHeight = items.length * itemHeight;

  return {
    visibleRange,
    totalHeight,
    handleScroll,
    offsetY: visibleRange.start * itemHeight
  };
}