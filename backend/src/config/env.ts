import dotenv from 'dotenv';
dotenv.config();

export const env = {
  port: Number(process.env.PORT || 4000),
  nodeEnv: process.env.NODE_ENV || 'development',
  clientOrigin: process.env.CLIENT_ORIGIN || 'http://localhost:3000',
  mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/vedaai',
  redisUrl: process.env.REDIS_URL || 'redis://localhost:6379',
  geminiKey: process.env.GEMINI_API_KEY || '',
  geminiModel: process.env.GEMINI_MODEL || 'gemini-2.5-flash',
  runWorkerInline:
    (process.env.RUN_WORKER_INLINE || 'true').toLowerCase() === 'true',
};
