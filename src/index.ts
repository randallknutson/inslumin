import { config } from './config';
import { Control } from './Control';

const controls = Object.keys(config).map((key: string) => new Control(key, config[key]));