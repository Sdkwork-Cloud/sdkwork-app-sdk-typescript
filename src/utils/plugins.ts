import type { SdkworkClient } from '../sdk';
import type { HttpClient } from '../http/client';

export interface PluginContext {
  client: SdkworkClient;
  http: HttpClient;
  config: Record<string, unknown>;
}

export interface Plugin {
  name: string;
  version?: string;
  install: (context: PluginContext) => void | Promise<void>;
  uninstall?: (context: PluginContext) => void | Promise<void>;
}

export interface PluginConfig {
  name: string;
  enabled?: boolean;
  config?: Record<string, unknown>;
}

class PluginManager {
  private plugins: Map<string, Plugin> = new Map();
  private pluginConfigs: Map<string, Record<string, unknown>> = new Map();
  private installedPlugins: Set<string> = new Set();
  private client: SdkworkClient | null = null;

  setClient(client: SdkworkClient): void {
    this.client = client;
  }

  register(plugin: Plugin, config?: Record<string, unknown>): void {
    if (this.plugins.has(plugin.name)) {
      console.warn(`Plugin "${plugin.name}" is already registered`);
      return;
    }

    this.plugins.set(plugin.name, plugin);
    if (config) {
      this.pluginConfigs.set(plugin.name, config);
    }
  }

  async install(pluginName: string): Promise<void> {
    const plugin = this.plugins.get(pluginName);
    if (!plugin) {
      throw new Error(`Plugin "${pluginName}" not found`);
    }

    if (this.installedPlugins.has(pluginName)) {
      console.warn(`Plugin "${pluginName}" is already installed`);
      return;
    }

    if (!this.client) {
      throw new Error('Client not set. Call setClient() first');
    }

    const config = this.pluginConfigs.get(pluginName) ?? {};
    await plugin.install({
      client: this.client,
      http: this.client.http,
      config,
    });

    this.installedPlugins.add(pluginName);
  }

  async uninstall(pluginName: string): Promise<void> {
    const plugin = this.plugins.get(pluginName);
    if (!plugin) {
      throw new Error(`Plugin "${pluginName}" not found`);
    }

    if (!this.installedPlugins.has(pluginName)) {
      console.warn(`Plugin "${pluginName}" is not installed`);
      return;
    }

    if (plugin.uninstall && this.client) {
      const config = this.pluginConfigs.get(pluginName) ?? {};
      await plugin.uninstall({
        client: this.client,
        http: this.client.http,
        config,
      });
    }

    this.installedPlugins.delete(pluginName);
  }

  async installAll(): Promise<void> {
    for (const [name] of this.plugins) {
      if (!this.installedPlugins.has(name)) {
        await this.install(name);
      }
    }
  }

  isInstalled(pluginName: string): boolean {
    return this.installedPlugins.has(pluginName);
  }

  isRegistered(pluginName: string): boolean {
    return this.plugins.has(pluginName);
  }

  getInstalledPlugins(): string[] {
    return Array.from(this.installedPlugins);
  }

  getRegisteredPlugins(): string[] {
    return Array.from(this.plugins.keys());
  }

  getPluginConfig(pluginName: string): Record<string, unknown> | undefined {
    return this.pluginConfigs.get(pluginName);
  }

  setPluginConfig(pluginName: string, config: Record<string, unknown>): void {
    this.pluginConfigs.set(pluginName, config);
  }
}

export const pluginManager = new PluginManager();

export function createPlugin(
  definition: Plugin
): Plugin {
  return definition;
}

export function usePlugin(pluginName: string): Plugin | undefined {
  return pluginManager.getRegisteredPlugins().includes(pluginName)
    ? undefined
    : undefined;
}

export type { PluginManager };
