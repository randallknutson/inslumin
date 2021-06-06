export interface ICGMValue {
  value: number;
  trend: number;
  wt: number;
}

export interface ICGMConfig {
  type: string,
  username: string,
  password: string,
  ous: boolean,
}

export abstract class ICGM<Config> {
  config: Config;
  constructor(config: Config) {
    this.config = config;
  };
  async connect(): Promise<void> { };
  async disconnect(): Promise<void> { };
  async getCurrent(): Promise<ICGMValue> { return { value: 0, trend: 0, wt: 0 } };
}
