import { ILight, ILightConfig } from "./Light";

interface MockConfig extends ILightConfig {
  type: string,
  id: string,
}

export class Mock extends ILight<MockConfig> {
  async connect() {
    console.log('Connect Light', this.config.id);
  }

  async disconnect() {
    console.log('Disconnect Light', this.config.id);
  }

  async on() {
    console.log('On Light', this.config.id);
  }

  async off() {
    console.log('Off Light', this.config.id);
  }

  async set(color: string) {
    console.log('set', this.config.id, color);
  }
}
