import * as dotenv from 'dotenv';

dotenv.config();

class Config {
  port: string;


  constructor() {
    this.port = process.env.PORT || '3000';
  }
}

const AppConfig = new Config();
export { AppConfig };
