import noble, { Peripheral, Characteristic } from '@abandonware/noble';
import { ILight, ILightConfig } from "./Light";

interface LuminConfig extends ILightConfig {
  type: string,
  id: string,
}

export class Lumin extends ILight<LuminConfig> {
  peripheral?: Peripheral;
  characteristic?: Characteristic;
  isOn: boolean = false;
  isBlinking: boolean = false;
  blinkInterval: any;

  async connect() {
    return new Promise<void>((resolve, reject) => {
      const timeout = setTimeout(() => reject(`Unable to find Lumin ${this.config.id}`), 3000)

      noble.on('stateChange', (state) => {
        if (state === 'poweredOn') {
          noble.startScanning();
        } else {
          noble.stopScanning();
        }
      });

      noble.on('discover', async (peripheral) => {
        if (peripheral.id === this.config.id) {
          noble.stopScanning();
          await peripheral.connectAsync();
          const service = (await peripheral.discoverServicesAsync(['ffd5']))[0];
          const characteristic = (await service.discoverCharacteristicsAsync(['ffd9']))[0];
          this.peripheral = peripheral;
          this.characteristic = characteristic;
          this.program('25');
          clearTimeout(timeout);
          return resolve();
        }
      });
    })
  }

  async disconnect() {
    if (!this.peripheral) {
      throw new Error('Not connected');
    }
    await this.peripheral.disconnectAsync();
    this.peripheral = undefined;
  }

  async on() {
    if (!this.peripheral || !this.characteristic) {
      throw new Error('Not connected');
    }
    this.isOn = true;
    this.characteristic.write(Buffer.from('cc2333', 'hex'), true, (err) => err ? console.log : null);
  }

  async off() {
    if (!this.peripheral || !this.characteristic) {
      throw new Error('Not connected');
    }
    this.isOn = false;
    this.characteristic.write(Buffer.from('cc2433', 'hex'), true, (err) => err ? console.log : null);
  }

  async set(color: string) {
    if (!this.peripheral || !this.characteristic) {
      throw new Error('Not connected');
    }
    if (!this.isOn) {
      this.on();
    }
    this.characteristic.write(Buffer.from(`56${color}01f0aa`, 'hex'), true, (err) => err ? console.log : null);
  }

  async program(program: string, speed: string = '10') {
    if (!this.peripheral || !this.characteristic) {
      throw new Error('Not connected');
    }
    if (!this.isOn) {
      this.on();
    }
    this.characteristic.write(Buffer.from(`bb${program}${speed}44`, 'hex'), true, (err) => err ? console.log : null);
  }

  async toggle() {
    if (this.isOn) {
      await this.off();
    }
    else {
      await this.on();
    }
  }

  async blink() {
    if (this.isBlinking) {
      return;
    }
    this.toggle();
    this.blinkInterval = setInterval(() => this.toggle(), 50);
  }

  async steady() {
    this.isBlinking = false;
    clearInterval(this.blinkInterval);
    this.blinkInterval = null;
  }
}
