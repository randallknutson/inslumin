export enum ILightStyle {
  SOLID,
  PULSE,
  STROBE,
}

export interface ILightConfig {
  type: string,
  id: string,
}

export abstract class ILight<Config> {
  config: Config;
  constructor(config: Config) {
    this.config = config;
  };
  async connect(): Promise<void> { };
  async disconnect(): Promise<void> { };
  async on(): Promise<void> { };
  async off(): Promise<void> { };
  async toggle(): Promise<void> { };
  async blink(): Promise<void> { };
  async steady(): Promise<void> { };
  async set(color: string): Promise<void> { };
}
