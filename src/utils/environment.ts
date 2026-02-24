export interface EnvironmentInfo {
  browser: string;
  browserVersion: string;
  os: string;
  osVersion: string;
  device: 'mobile' | 'tablet' | 'desktop';
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isTouch: boolean;
  isOnline: boolean;
  language: string;
  timezone: string;
  screenWidth: number;
  screenHeight: number;
  pixelRatio: number;
  colorDepth: number;
  cookiesEnabled: boolean;
  localStorage: boolean;
  sessionStorage: boolean;
  webWorker: boolean;
  serviceWorker: boolean;
  webSocket: boolean;
  fetch: boolean;
  intersectionObserver: boolean;
  resizeObserver: boolean;
  mutationObserver: boolean;
}

function detectBrowser(): { name: string; version: string } {
  if (typeof navigator === 'undefined') {
    return { name: 'unknown', version: 'unknown' };
  }

  const ua = navigator.userAgent;
  let name = 'unknown';
  let version = 'unknown';

  if (ua.includes('Firefox/')) {
    name = 'Firefox';
    version = ua.match(/Firefox\/(\d+\.?\d*)/)?.[1] ?? 'unknown';
  } else if (ua.includes('Edg/')) {
    name = 'Edge';
    version = ua.match(/Edg\/(\d+\.?\d*)/)?.[1] ?? 'unknown';
  } else if (ua.includes('Chrome/')) {
    name = 'Chrome';
    version = ua.match(/Chrome\/(\d+\.?\d*)/)?.[1] ?? 'unknown';
  } else if (ua.includes('Safari/') && !ua.includes('Chrome')) {
    name = 'Safari';
    version = ua.match(/Version\/(\d+\.?\d*)/)?.[1] ?? 'unknown';
  } else if (ua.includes('MSIE') || ua.includes('Trident/')) {
    name = 'IE';
    version = ua.match(/(?:MSIE |rv:)(\d+\.?\d*)/)?.[1] ?? 'unknown';
  }

  return { name, version };
}

function detectOS(): { name: string; version: string } {
  if (typeof navigator === 'undefined') {
    return { name: 'unknown', version: 'unknown' };
  }

  const ua = navigator.userAgent;
  let name = 'unknown';
  let version = 'unknown';

  if (ua.includes('Windows NT 10')) {
    name = 'Windows';
    version = '10';
  } else if (ua.includes('Windows NT 6.3')) {
    name = 'Windows';
    version = '8.1';
  } else if (ua.includes('Windows NT 6.2')) {
    name = 'Windows';
    version = '8';
  } else if (ua.includes('Windows NT 6.1')) {
    name = 'Windows';
    version = '7';
  } else if (ua.includes('Mac OS X')) {
    name = 'macOS';
    version = ua.match(/Mac OS X (\d+[._]\d+)/)?.[1]?.replace('_', '.') ?? 'unknown';
  } else if (ua.includes('Android')) {
    name = 'Android';
    version = ua.match(/Android (\d+\.?\d*)/)?.[1] ?? 'unknown';
  } else if (ua.includes('iOS') || ua.includes('iPhone') || ua.includes('iPad')) {
    name = 'iOS';
    version = ua.match(/OS (\d+[._]\d+)/)?.[1]?.replace('_', '.') ?? 'unknown';
  } else if (ua.includes('Linux')) {
    name = 'Linux';
    version = 'unknown';
  }

  return { name, version };
}

function detectDevice(): 'mobile' | 'tablet' | 'desktop' {
  if (typeof navigator === 'undefined') {
    return 'desktop';
  }

  const ua = navigator.userAgent;

  if (/iPad|Android(?!.*Mobile)/i.test(ua)) {
    return 'tablet';
  }

  if (/iPhone|Android|webOS|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua)) {
    return 'mobile';
  }

  return 'desktop';
}

export function getEnvironment(): EnvironmentInfo {
  const browser = detectBrowser();
  const os = detectOS();
  const device = detectDevice();

  const isTouch = typeof window !== 'undefined' && (
    'ontouchstart' in window || 
    navigator.maxTouchPoints > 0
  );

  return {
    browser: browser.name,
    browserVersion: browser.version,
    os: os.name,
    osVersion: os.version,
    device,
    isMobile: device === 'mobile',
    isTablet: device === 'tablet',
    isDesktop: device === 'desktop',
    isTouch,
    isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
    language: typeof navigator !== 'undefined' ? navigator.language : 'en',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    screenWidth: typeof window !== 'undefined' ? window.screen.width : 0,
    screenHeight: typeof window !== 'undefined' ? window.screen.height : 0,
    pixelRatio: typeof window !== 'undefined' ? window.devicePixelRatio : 1,
    colorDepth: typeof window !== 'undefined' ? window.screen.colorDepth : 24,
    cookiesEnabled: typeof navigator !== 'undefined' ? navigator.cookieEnabled : false,
    localStorage: isLocalStorageAvailable(),
    sessionStorage: isSessionStorageAvailable(),
    webWorker: typeof Worker !== 'undefined',
    serviceWorker: 'serviceWorker' in navigator,
    webSocket: typeof WebSocket !== 'undefined',
    fetch: typeof fetch !== 'undefined',
    intersectionObserver: typeof IntersectionObserver !== 'undefined',
    resizeObserver: typeof ResizeObserver !== 'undefined',
    mutationObserver: typeof MutationObserver !== 'undefined',
  };
}

function isLocalStorageAvailable(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const test = '__test__';
    window.localStorage.setItem(test, test);
    window.localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
}

function isSessionStorageAvailable(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const test = '__test__';
    window.sessionStorage.setItem(test, test);
    window.sessionStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
}

export function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof document !== 'undefined';
}

export function isNode(): boolean {
  return typeof process !== 'undefined' && process.versions?.node !== undefined;
}

export function isWebWorker(): boolean {
  if (typeof self === 'undefined') return false;
  const selfObj = self as unknown as Record<string, unknown>;
  const WorkerGlobalScopeFn = selfObj.WorkerGlobalScope;
  return typeof WorkerGlobalScopeFn === 'function' && 
    self instanceof (WorkerGlobalScopeFn as new () => typeof self);
}

export function isServiceWorker(): boolean {
  if (typeof self === 'undefined') return false;
  const selfObj = self as unknown as Record<string, unknown>;
  const ServiceWorkerGlobalScopeFn = selfObj.ServiceWorkerGlobalScope;
  return typeof ServiceWorkerGlobalScopeFn === 'function' && 
    self instanceof (ServiceWorkerGlobalScopeFn as new () => typeof self);
}

export function supportsFeature(feature: string): boolean {
  const features: Record<string, () => boolean> = {
    webWorker: () => typeof Worker !== 'undefined',
    serviceWorker: () => 'serviceWorker' in navigator,
    webSocket: () => typeof WebSocket !== 'undefined',
    fetch: () => typeof fetch !== 'undefined',
    localStorage: isLocalStorageAvailable,
    sessionStorage: isSessionStorageAvailable,
    indexedDB: () => typeof indexedDB !== 'undefined',
    webGL: () => {
      if (typeof document === 'undefined') return false;
      const canvas = document.createElement('canvas');
      return !!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
    },
    webGL2: () => {
      if (typeof document === 'undefined') return false;
      const canvas = document.createElement('canvas');
      return !!canvas.getContext('webgl2');
    },
    geolocation: () => 'geolocation' in navigator,
    notifications: () => 'Notification' in window,
    pushManager: () => 'PushManager' in window,
    cache: () => 'caches' in window,
    blob: () => typeof Blob !== 'undefined',
    file: () => typeof File !== 'undefined',
    fileReader: () => typeof FileReader !== 'undefined',
    url: () => typeof URL !== 'undefined' && typeof URL.createObjectURL === 'function',
    proxy: () => typeof Proxy !== 'undefined',
    reflect: () => typeof Reflect !== 'undefined',
    promise: () => typeof Promise !== 'undefined',
    symbol: () => typeof Symbol !== 'undefined',
    map: () => typeof Map !== 'undefined',
    set: () => typeof Set !== 'undefined',
    weakMap: () => typeof WeakMap !== 'undefined',
    weakSet: () => typeof WeakSet !== 'undefined',
  };

  const checker = features[feature];
  return checker ? checker() : false;
}
