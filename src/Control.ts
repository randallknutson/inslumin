import { ILight, ILightConfig } from "./Lights/Light";
import { Lights } from './Lights';
import { CGMs } from './CGMs';
import { ICGM, ICGMConfig } from "./CGMs/CGM";
import { IConfig } from "./config";

export class Control {
  key: string;
  config: IConfig;
  light: ILight<ILightConfig>;
  cgm: ICGM<ICGMConfig>;

  constructor(key: string, config: any) {
    this.key = key;
    this.config = config;
    this.cgm = new (CGMs as any)[this.config.cgm.type as string](this.config.cgm);
    this.light = new (Lights as any)[this.config.light.type as string](this.config.light);
    this.init();
  }

  getColor(value): string {
    switch (true) {
      case (value < 70):
        return 'ff0000';
      case (value < 85):
        return 'ff4500';
      case (value < 100):
        return 'ff8c00';
      case (value < 110):
        return 'ffff00';
      case (value < 120):
        return '8c8c00';
      case (value < 151):
        return '00ff00';
      case (value < 151):
        return '0d98ba';
      case (value < 200):
        return '0d98ba';
      case (value < 250):
        return '0000ff';
      case (value < 300):
        return '8a2be2';
      case (value < 500):
        return '800080';
    }
    return 'ff0000';
  }

  async init() {
    await Promise.all([this.cgm.connect(), this.light.connect()]);
    setInterval(() => this.process(), 3000);
  }

  async process() {
    const gv = await this.cgm.getCurrent();
    this.light.set(this.getColor(gv.value));
  }
}