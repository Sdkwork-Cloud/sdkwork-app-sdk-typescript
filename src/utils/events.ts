type EventHandler<T = unknown> = (data: T) => void | Promise<void>;

type EventMap = Record<string, unknown>;

export class EventEmitter<Events extends EventMap> {
  private handlers: Map<keyof Events, Set<EventHandler<unknown>>> = new Map();
  private onceHandlers: Map<keyof Events, Set<EventHandler<unknown>>> = new Map();

  on<K extends keyof Events>(event: K, handler: EventHandler<Events[K]>): () => void {
    if (!this.handlers.has(event)) {
      this.handlers.set(event, new Set());
    }
    this.handlers.get(event)!.add(handler as EventHandler<unknown>);

    return () => this.off(event, handler);
  }

  once<K extends keyof Events>(event: K, handler: EventHandler<Events[K]>): () => void {
    if (!this.onceHandlers.has(event)) {
      this.onceHandlers.set(event, new Set());
    }
    this.onceHandlers.get(event)!.add(handler as EventHandler<unknown>);

    return () => this.off(event, handler);
  }

  off<K extends keyof Events>(event: K, handler: EventHandler<Events[K]>): void {
    this.handlers.get(event)?.delete(handler as EventHandler<unknown>);
    this.onceHandlers.get(event)?.delete(handler as EventHandler<unknown>);
  }

  emit<K extends keyof Events>(event: K, data: Events[K]): Promise<void[]> {
    const promises: Promise<void>[] = [];

    const handlers = this.handlers.get(event);
    if (handlers) {
      handlers.forEach((handler) => {
        const result = handler(data);
        if (result instanceof Promise) {
          promises.push(result);
        }
      });
    }

    const onceHandlers = this.onceHandlers.get(event);
    if (onceHandlers) {
      onceHandlers.forEach((handler) => {
        const result = handler(data);
        if (result instanceof Promise) {
          promises.push(result);
        }
      });
      onceHandlers.clear();
    }

    return Promise.all(promises);
  }

  async emitSerial<K extends keyof Events>(event: K, data: Events[K]): Promise<void> {
    const handlers = this.handlers.get(event);
    if (handlers) {
      for (const handler of handlers) {
        await handler(data);
      }
    }

    const onceHandlers = this.onceHandlers.get(event);
    if (onceHandlers) {
      for (const handler of onceHandlers) {
        await handler(data);
      }
      onceHandlers.clear();
    }
  }

  removeAllListeners(event?: keyof Events): void {
    if (event) {
      this.handlers.delete(event);
      this.onceHandlers.delete(event);
    } else {
      this.handlers.clear();
      this.onceHandlers.clear();
    }
  }

  listenerCount(event: keyof Events): number {
    const handlers = this.handlers.get(event)?.size ?? 0;
    const onceHandlers = this.onceHandlers.get(event)?.size ?? 0;
    return handlers + onceHandlers;
  }

  eventNames(): (keyof Events)[] {
    const names = new Set<keyof Events>();
    this.handlers.forEach((_, key) => names.add(key));
    this.onceHandlers.forEach((_, key) => names.add(key));
    return Array.from(names);
  }
}

export function createEventEmitter<Events extends EventMap>(): EventEmitter<Events> {
  return new EventEmitter<Events>();
}

export type { EventHandler, EventMap };
