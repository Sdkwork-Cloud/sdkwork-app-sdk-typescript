export interface PerformanceMetrics {
  memory?: {
    usedJSHeapSize: number;
    totalJSHeapSize: number;
    jsHeapSizeLimit: number;
  };
  timing?: {
    dns: number;
    tcp: number;
    request: number;
    response: number;
    domProcessing: number;
    total: number;
  };
  resources: ResourceTiming[];
  fps: number;
  connection?: {
    effectiveType: string;
    downlink: number;
    rtt: number;
    saveData: boolean;
  };
}

export interface ResourceTiming {
  name: string;
  type: string;
  duration: number;
  size: number;
  startTime: number;
}

export interface PerformanceMonitorOptions {
  sampleInterval?: number;
  resourceTypes?: string[];
  onMetrics?: (metrics: PerformanceMetrics) => void;
}

class PerformanceMonitor {
  private options: Required<Omit<PerformanceMonitorOptions, 'onMetrics'>> & { onMetrics?: (metrics: PerformanceMetrics) => void };
  private frameCount = 0;
  private lastFrameTime = 0;
  private currentFps = 60;
  private intervalId: ReturnType<typeof setInterval> | null = null;
  private isRunning = false;

  constructor(options: PerformanceMonitorOptions = {}) {
    this.options = {
      sampleInterval: options.sampleInterval ?? 1000,
      resourceTypes: options.resourceTypes ?? ['script', 'link', 'img', 'xmlhttprequest', 'fetch'],
      onMetrics: options.onMetrics,
    };
  }

  start(): void {
    if (this.isRunning) return;
    this.isRunning = true;
    this.lastFrameTime = performance.now();
    this.measureFps();
    this.intervalId = setInterval(() => {
      this.collect();
    }, this.options.sampleInterval);
  }

  stop(): void {
    if (!this.isRunning) return;
    this.isRunning = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  private measureFps(): void {
    const now = performance.now();
    this.frameCount++;

    if (now - this.lastFrameTime >= 1000) {
      this.currentFps = Math.round((this.frameCount * 1000) / (now - this.lastFrameTime));
      this.frameCount = 0;
      this.lastFrameTime = now;
    }

    if (this.isRunning) {
      requestAnimationFrame(() => this.measureFps());
    }
  }

  private collect(): PerformanceMetrics {
    const metrics: PerformanceMetrics = {
      memory: this.getMemoryMetrics(),
      timing: this.getTimingMetrics(),
      resources: this.getResourceTimings(),
      fps: this.currentFps,
      connection: this.getConnectionInfo(),
    };

    this.options.onMetrics?.(metrics);
    return metrics;
  }

  private getMemoryMetrics(): PerformanceMetrics['memory'] {
    const memory = (performance as unknown as { memory?: {
      usedJSHeapSize: number;
      totalJSHeapSize: number;
      jsHeapSizeLimit: number;
    } }).memory;

    if (!memory) return undefined;

    return {
      usedJSHeapSize: memory.usedJSHeapSize,
      totalJSHeapSize: memory.totalJSHeapSize,
      jsHeapSizeLimit: memory.jsHeapSizeLimit,
    };
  }

  private getTimingMetrics(): PerformanceMetrics['timing'] {
    const timing = performance.timing;
    if (!timing) return undefined;

    return {
      dns: timing.domainLookupEnd - timing.domainLookupStart,
      tcp: timing.connectEnd - timing.connectStart,
      request: timing.responseStart - timing.requestStart,
      response: timing.responseEnd - timing.responseStart,
      domProcessing: timing.domComplete - timing.domInteractive,
      total: timing.loadEventEnd - timing.navigationStart,
    };
  }

  private getResourceTimings(): ResourceTiming[] {
    const entries = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
    
    return entries
      .filter((entry) => this.options.resourceTypes.includes(entry.initiatorType))
      .map((entry) => ({
        name: entry.name,
        type: entry.initiatorType,
        duration: entry.duration,
        size: entry.transferSize ?? 0,
        startTime: entry.startTime,
      }));
  }

  private getConnectionInfo(): PerformanceMetrics['connection'] {
    const connection = (navigator as unknown as { connection?: {
      effectiveType: string;
      downlink: number;
      rtt: number;
      saveData: boolean;
    } }).connection;

    if (!connection) return undefined;

    return {
      effectiveType: connection.effectiveType,
      downlink: connection.downlink,
      rtt: connection.rtt,
      saveData: connection.saveData,
    };
  }

  getMetrics(): PerformanceMetrics {
    return this.collect();
  }

  mark(name: string): void {
    performance.mark(name);
  }

  measure(name: string, startMark: string, endMark?: string): number {
    try {
      if (endMark) {
        performance.measure(name, startMark, endMark);
      } else {
        performance.measure(name, startMark);
      }
      const entries = performance.getEntriesByName(name, 'measure');
      const lastEntry = entries[entries.length - 1];
      return lastEntry ? lastEntry.duration : 0;
    } catch {
      return 0;
    }
  }

  clearMarks(name?: string): void {
    if (name) {
      performance.clearMarks(name);
    } else {
      performance.clearMarks();
    }
  }

  clearMeasures(name?: string): void {
    if (name) {
      performance.clearMeasures(name);
    } else {
      performance.clearMeasures();
    }
  }
}

export function createPerformanceMonitor(options?: PerformanceMonitorOptions): PerformanceMonitor {
  return new PerformanceMonitor(options);
}

export function measureAsync<T>(
  name: string,
  fn: () => Promise<T>
): Promise<{ result: T; duration: number }> {
  const startMark = `${name}-start`;
  const endMark = `${name}-end`;

  performance.mark(startMark);

  return fn().then((result) => {
    performance.mark(endMark);
    performance.measure(name, startMark, endMark);
    const entries = performance.getEntriesByName(name, 'measure');
    const lastEntry = entries[entries.length - 1];
    const duration = lastEntry ? lastEntry.duration : 0;
    
    performance.clearMarks(startMark);
    performance.clearMarks(endMark);
    performance.clearMeasures(name);

    return { result, duration };
  });
}

export function measureSync<T>(name: string, fn: () => T): { result: T; duration: number } {
  const startMark = `${name}-start`;
  const endMark = `${name}-end`;

  performance.mark(startMark);
  const result = fn();
  performance.mark(endMark);
  performance.measure(name, startMark, endMark);

  const entries = performance.getEntriesByName(name, 'measure');
  const lastEntry = entries[entries.length - 1];
  const duration = lastEntry ? lastEntry.duration : 0;

  performance.clearMarks(startMark);
  performance.clearMarks(endMark);
  performance.clearMeasures(name);

  return { result, duration };
}

export function getNavigationTiming(): Record<string, number> | null {
  const entries = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
  if (entries.length === 0) return null;

  const timing = entries[0];
  if (!timing) return null;
  
  return {
    dns: timing.domainLookupEnd - timing.domainLookupStart,
    tcp: timing.connectEnd - timing.connectStart,
    request: timing.responseStart - timing.requestStart,
    response: timing.responseEnd - timing.responseStart,
    domProcessing: timing.domComplete - timing.domInteractive,
    domContentLoaded: timing.domContentLoadedEventEnd - timing.startTime,
    load: timing.loadEventEnd - timing.startTime,
  };
}

export { PerformanceMonitor };
