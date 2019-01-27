import mongoose from 'mongoose';
import config from './config';
import { logger } from './utils';

const MONGO_URL = `mongodb://${process.env.NODE_ENV === 'prod' ? `${config.DB_USERNAME}:${config.DB_PASSWORD}@` : ''}${config.DB_HOST}:${config.DB_PORT}/${config.DATABASE}`;

mongoose.connect(MONGO_URL, { useMongoClient: true }, err => {
  if (err) {
    logger.error('MongoDB connection error: ' + err);
    process.exit(1);
  }
});

export default mongoose.connection