import { Dexcom as RTDexcom } from "rtdexcom";
import { ICGM, ICGMConfig } from "./CGM";

interface IDexcomConfig extends ICGMConfig {
  type: string,
  username: string,
  password: string,
  ous: boolean,
}

export class Dexcom extends ICGM<IDexcomConfig> {
  dexcom: RTDexcom;
  constructor(config: IDexcomConfig) {
    super(config);
    this.dexcom = new RTDexcom(config.username, config.password, config.ous);
  }

  async connect() {
    await this.dexcom.createSession();
  }

  async getCurrent() {
    const result = await this.dexcom.getCurrentGlucoseReading();
    return {
      value: result.value,
      trend: result.trend as number,
      time: result.time.getTime(),
    }
  }
}