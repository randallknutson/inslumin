import { ICGM, ICGMConfig } from "./CGM";

const values = [
  90,
  100,
  110,
  125,
  155,
  180,
  210,
  301,
  240,
  200,
  120,
  100,
  80,
  75,
  60,
  49,
]

let at = 0;

interface IMockConfig extends ICGMConfig {
  type: string,
  username: string,
  password: string,
}

export class Mock extends ICGM<IMockConfig> {
  async connect() {
    console.log('Connect CGM', this.config);
  }

  async disconnect() {
    console.log('Disconnect CGM');
  }

  async getCurrent() {
    if (at > 15) {
      at = 0;
    }
    console.log('getCurrent', values[at]);
    return {
      value: values[at++],
      trend: 0,
      wt: Date.now(),
    }
  }
}