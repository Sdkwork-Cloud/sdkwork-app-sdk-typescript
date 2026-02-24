export type WebSocketState = 'connecting' | 'connected' | 'disconnecting' | 'disconnected';

export interface WebSocketOptions {
  url: string;
  protocols?: string | string[];
  /**
   * @deprecated WebSocket API does not support custom headers.
   * Use query parameters in the URL or subprotocols for authentication instead.
   */
  headers?: Record<string, string>;
  reconnect?: boolean;
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
  heartbeatInterval?: number;
  onOpen?: () => void;
  onClose?: (event: CloseEvent) => void;
  onError?: (event: Event) => void;
  onMessage?: (data: unknown) => void;
  onReconnect?: (attempt: number) => void;
  onStateChange?: (state: WebSocketState) => void;
}

export interface WebSocketMessage {
  type: string;
  payload: unknown;
  timestamp?: number;
}

export class WebSocketClient {
  private ws: WebSocket | null = null;
  private options: Required<Omit<WebSocketOptions, 'headers'>> & { headers?: Record<string, string> };
  private reconnectAttempts = 0;
  private heartbeatTimer: ReturnType<typeof setInterval> | null = null;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private _state: WebSocketState = 'disconnected';
  private messageQueue: unknown[] = [];

  constructor(options: WebSocketOptions) {
    this.options = {
      url: options.url,
      protocols: options.protocols ?? [],
      headers: options.headers,
      reconnect: options.reconnect ?? true,
      reconnectInterval: options.reconnectInterval ?? 3000,
      maxReconnectAttempts: options.maxReconnectAttempts ?? 5,
      heartbeatInterval: options.heartbeatInterval ?? 30000,
      onOpen: options.onOpen ?? (() => {}),
      onClose: options.onClose ?? (() => {}),
      onError: options.onError ?? (() => {}),
      onMessage: options.onMessage ?? (() => {}),
      onReconnect: options.onReconnect ?? (() => {}),
      onStateChange: options.onStateChange ?? (() => {}),
    };
  }

  get state(): WebSocketState {
    return this._state;
  }

  private setState(state: WebSocketState): void {
    this._state = state;
    this.options.onStateChange(state);
  }

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.setState('connecting');
        
        const protocols = this.options.protocols.length > 0 ? this.options.protocols : undefined;
        this.ws = new WebSocket(this.options.url, protocols);

        this.ws.onopen = () => {
          this.setState('connected');
          this.reconnectAttempts = 0;
          this.startHeartbeat();
          this.flushMessageQueue();
          this.options.onOpen();
          resolve();
        };

        this.ws.onclose = (event) => {
          this.setState('disconnected');
          this.stopHeartbeat();
          this.options.onClose(event);
          
          if (this.options.reconnect && this.reconnectAttempts < this.options.maxReconnectAttempts) {
            this.scheduleReconnect();
          }
        };

        this.ws.onerror = (event) => {
          this.options.onError(event);
          if (this._state === 'connecting') {
            reject(new Error('WebSocket connection failed'));
          }
        };

        this.ws.onmessage = (event) => {
          const data = this.parseMessage(event.data);
          this.options.onMessage(data);
        };
      } catch (error) {
        this.setState('disconnected');
        reject(error);
      }
    });
  }

  disconnect(): void {
    this.setState('disconnecting');
    this.stopHeartbeat();
    this.clearReconnectTimer();
    
    if (this.ws) {
      this.ws.close(1000, 'Client disconnect');
      this.ws = null;
    }
    
    this.setState('disconnected');
  }

  send(data: unknown): boolean {
    if (this.ws?.readyState === WebSocket.OPEN) {
      const message = typeof data === 'string' ? data : JSON.stringify(data);
      this.ws.send(message);
      return true;
    }
    
    this.messageQueue.push(data);
    return false;
  }

  sendJson(type: string, payload: unknown): boolean {
    return this.send({ type, payload, timestamp: Date.now() });
  }

  private parseMessage(data: string): unknown {
    try {
      return JSON.parse(data);
    } catch {
      return data;
    }
  }

  private flushMessageQueue(): void {
    while (this.messageQueue.length > 0 && this.ws?.readyState === WebSocket.OPEN) {
      const data = this.messageQueue.shift();
      if (data !== undefined) {
        this.send(data);
      }
    }
  }

  private startHeartbeat(): void {
    this.stopHeartbeat();
    
    this.heartbeatTimer = setInterval(() => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify({ type: 'ping', timestamp: Date.now() }));
      }
    }, this.options.heartbeatInterval);
  }

  private stopHeartbeat(): void {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
  }

  private scheduleReconnect(): void {
    this.reconnectAttempts++;
    this.options.onReconnect(this.reconnectAttempts);
    
    this.reconnectTimer = setTimeout(() => {
      this.connect().catch(() => {
        // Error is handled in onerror callback
      });
    }, this.options.reconnectInterval);
  }

  private clearReconnectTimer(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
  }

  getReadyState(): number {
    return this.ws?.readyState ?? WebSocket.CLOSED;
  }

  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }
}

export function createWebSocketClient(options: WebSocketOptions): WebSocketClient {
  return new WebSocketClient(options);
}

export type { WebSocketOptions as WebSocketClientOptions };
