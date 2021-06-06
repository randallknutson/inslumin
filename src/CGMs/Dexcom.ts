import { ICGM, ICGMConfig } from "./CGM";

class RTDexcom {
  constructor(username: string, password: string, ous: boolean) { }
  async createSession() { }
};

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
}