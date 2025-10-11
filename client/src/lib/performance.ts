// Performance optimization utilities

// Image preloading for critical resources
export function preloadImages(imageSources: string[]): void {
  imageSources.forEach(src => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = src;
    document.head.appendChild(link);
  });
}

// Font preloading
export function preloadFonts(fontUrls: string[]): void {
  fontUrls.forEach(url => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'font';
    link.type = 'font/woff2';
    link.crossOrigin = 'anonymous';
    link.href = url;
    document.head.appendChild(link);
  });
}

// Performance monitoring
export class PerformanceMonitor {
  private metrics: Map<string, number> = new Map();

  startTimer(label: string): void {
    this.metrics.set(`${label}_start`, performance.now());
  }

  endTimer(label: string): number {
    const startTime = this.metrics.get(`${label}_start`);
    if (!startTime) return 0;
    
    const duration = performance.now() - startTime;
    this.metrics.set(label, duration);
    return duration;
  }

  getMetric(label: string): number | undefined {
    return this.metrics.get(label);
  }

  getAllMetrics(): Record<string, number> {
    return Object.fromEntries(this.metrics);
  }

  logToConsole(): void {
    console.table(this.getAllMetrics());
  }
}

// Lazy loading intersection observer
export function createLazyLoadObserver(callback: (element: Element) => void): IntersectionObserver {
  return new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          callback(entry.target);
        }
      });
    },
    { rootMargin: '50px' }
  );
}

// Memory usage monitoring
export function getMemoryUsage(): any | null {
  if ('memory' in performance) {
    return (performance as any).memory;
  }
  return null;
}

// Critical resource hints
export function addResourceHints(): void {
  // DNS prefetch for external resources
  const dnsPrefetchUrls = [
    'https://images.unsplash.com',
    'https://fonts.googleapis.com',
    'https://fonts.gstatic.com'
  ];

  dnsPrefetchUrls.forEach(url => {
    const link = document.createElement('link');
    link.rel = 'dns-prefetch';
    link.href = url;
    document.head.appendChild(link);
  });
}