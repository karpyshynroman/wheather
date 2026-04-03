import * as dotenv from 'dotenv';

dotenv.config();

class Config {
  port = process.env.PORT;
  dbHost = process.env.DB_HOST;
  dbPort = process.env.DB_PORT;
  dbUsername = process.env.DB_USERNAME;
  dbPassword = process.env.DB_PASSWORD;
  dbName = process.env.DB_NAME;
  jwtSecret = process.env.JWT_SECRET;
  jwtExpiresIn = process.env.JWT_EXPIRES_IN;
  corsOrigin = process.env.CORS_ORIGIN;
}

export const AppConfig = new Config();
