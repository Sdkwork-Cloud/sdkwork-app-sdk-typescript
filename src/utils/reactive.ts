type Subscriber<T> = (value: T, oldValue: T) => void;

interface ReactiveOptions {
  deep?: boolean;
  immediate?: boolean;
}

class ReactiveValue<T> {
  private _value: T;
  private subscribers: Set<Subscriber<T>> = new Set();
  private options: ReactiveOptions;

  constructor(initialValue: T, options: ReactiveOptions = {}) {
    this._value = initialValue;
    this.options = options;
  }

  get value(): T {
    return this._value;
  }

  set value(newValue: T) {
    if (Object.is(this._value, newValue)) {
      return;
    }

    const oldValue = this._value;
    this._value = newValue;

    this.subscribers.forEach((subscriber) => {
      subscriber(newValue, oldValue);
    });
  }

  subscribe(subscriber: Subscriber<T>): () => void {
    this.subscribers.add(subscriber);

    if (this.options.immediate) {
      subscriber(this._value, this._value);
    }

    return () => {
      this.subscribers.delete(subscriber);
    };
  }

  unsubscribe(subscriber: Subscriber<T>): void {
    this.subscribers.delete(subscriber);
  }

  clearSubscribers(): void {
    this.subscribers.clear();
  }

  update(updater: (value: T) => T): void {
    this.value = updater(this._value);
  }
}

class ComputedValue<T, Deps extends readonly unknown[]> {
  private _value: T;
  private subscribers: Set<Subscriber<T>> = new Set();
  private dependencies: ReactiveValue<unknown>[];
  private compute: (...deps: Deps) => T;
  private unsubscribers: (() => void)[] = [];

  constructor(
    dependencies: { [K in keyof Deps]: ReactiveValue<Deps[K]> },
    compute: (...deps: Deps) => T
  ) {
    this.dependencies = dependencies as unknown as ReactiveValue<unknown>[];
    this.compute = compute;
    this._value = this.computeValue();

    this.dependencies.forEach((dep) => {
      const unsub = dep.subscribe(() => {
        const oldValue = this._value;
        this._value = this.computeValue();

        if (!Object.is(oldValue, this._value)) {
          this.subscribers.forEach((subscriber) => {
            subscriber(this._value, oldValue);
          });
        }
      });
      this.unsubscribers.push(unsub);
    });
  }

  private computeValue(): T {
    const values = this.dependencies.map((dep) => dep.value) as unknown as Deps;
    return this.compute(...values);
  }

  get value(): T {
    return this._value;
  }

  subscribe(subscriber: Subscriber<T>): () => void {
    this.subscribers.add(subscriber);
    return () => {
      this.subscribers.delete(subscriber);
    };
  }

  destroy(): void {
    this.unsubscribers.forEach((unsub) => unsub());
    this.unsubscribers = [];
    this.subscribers.clear();
  }
}

class WatchEffect {
  private cleanup: (() => void) | null = null;
  private disposed = false;

  constructor(private effect: (onCleanup: (fn: () => void) => void) => void) {
    this.run();
  }

  private run(): void {
    if (this.disposed) return;

    this.cleanup?.();
    this.cleanup = null;

    this.effect((fn) => {
      this.cleanup = fn;
    });
  }

  dispose(): void {
    this.disposed = true;
    this.cleanup?.();
    this.cleanup = null;
  }
}

export function reactive<T>(initialValue: T, options?: ReactiveOptions): ReactiveValue<T> {
  return new ReactiveValue(initialValue, options);
}

export function computed<T, Deps extends readonly unknown[]>(
  dependencies: { [K in keyof Deps]: ReactiveValue<Deps[K]> },
  compute: (...deps: Deps) => T
): ComputedValue<T, Deps> {
  return new ComputedValue(dependencies, compute);
}

export function watchEffect(
  effect: (onCleanup: (fn: () => void) => void) => void
): WatchEffect {
  return new WatchEffect(effect);
}

export function watch<T>(
  source: ReactiveValue<T>,
  callback: (value: T, oldValue: T) => void | (() => void),
  options?: { immediate?: boolean }
): () => void {
  let cleanup: (() => void) | null = null;

  const subscriber = (value: T, oldValue: T) => {
    cleanup?.();
    const result = callback(value, oldValue);
    cleanup = typeof result === 'function' ? result : null;
  };

  if (options?.immediate) {
    subscriber(source.value, source.value);
  }

  return source.subscribe(subscriber);
}

export type { ReactiveValue, ComputedValue, Subscriber, ReactiveOptions };
