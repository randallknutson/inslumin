import { ILight, ILightConfig } from "./Lights/Light";
import { Lights } from './Lights';
import { CGMs } from './CGMs';
import { ICGM, ICGMConfig, ICGMValue } from "./CGMs/CGM";
import { IConfig } from "./config";
const minute = 60000;
const second = 1000;

export class Control {
  key: string;
  config: IConfig;
  light: ILight<ILightConfig>;
  cgm: ICGM<ICGMConfig>;
  lastResult: ICGMValue;
  tries: number;

  constructor(key: string, config: any) {
    this.key = key;
    this.config = config;
    this.cgm = new (CGMs as any)[this.config.cgm.type as string](this.config.cgm);
    this.light = new (Lights as any)[this.config.light.type as string](this.config.light);
    this.tries = 0;
    this.lastResult = { value: 0, trend: 0, time: Date.now() - (5 * minute) }
    this.init();
  }

  getColor(value): string {
    switch (true) {
      case (value < 60):
        return 'ff0000';
      case (value < 70):
        return 'ff4500';
      case (value < 80):
        return 'ff8c00';
      case (value < 90):
        return 'ffff00';
      case (value < 100):
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

  shouldCheck(): boolean {
    if (this.tries === 0 && this.lastResult.time + (5 * minute + 8 * second) < Date.now()) return true;
    if (this.tries === 1 && this.lastResult.time + (5 * minute + 9 * second) < Date.now()) return true;
    if (this.tries === 2 && this.lastResult.time + (5 * minute + 11 * second) < Date.now()) return true;
    if (this.tries === 3 && this.lastResult.time + (5 * minute + 13 * second) < Date.now()) return true;
    if (this.tries === 4 && this.lastResult.time + (5 * minute + 16 * second) < Date.now()) return true;
    if (this.tries === 5 && this.lastResult.time + (5 * minute + 30 * second) < Date.now()) return true;
    if (this.tries > 5 && this.lastResult.time + (6 * minute + ((this.tries - 6) * minute)) < Date.now()) return true;
    return false;
  }

  async init() {
    await Promise.all([this.cgm.connect(), this.light.connect()]);
    setInterval(() => this.process(), second);
  }

  async process() {
    if (this.lastResult.time + (10 * minute) < Date.now()) {
      this.light.blink();
    }
    else {
      this.light.steady();
    }
    if (!this.shouldCheck()) {
      return;
    }
    console.log(this.tries, this.lastResult.time);
    try {
      const newResult = await this.cgm.getCurrent();
      if (newResult.time === this.lastResult.time) {
        this.tries++;
        return;
      }
      this.lastResult = newResult;
      console.log(this.lastResult, this.getColor(this.lastResult.value));
      this.tries = 0;
      this.light.set(this.getColor(this.lastResult.value));
    }
    catch (err) {
      this.tries++;
      console.log(err);
    }
  }
}