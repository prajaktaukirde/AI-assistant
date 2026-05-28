import dns from 'dns';
import mongoose from 'mongoose';
import { env } from './env';

let connected = false;

export async function connectMongo() {
  if (connected) return mongoose.connection;

  if (env.mongoUri.startsWith('mongodb+srv://')) {
    dns.setServers(['8.8.8.8', '1.1.1.1']);
    console.log('[mongo] using custom DNS servers for SRV resolution');
  }

  mongoose.set('strictQuery', true);
  await mongoose.connect(env.mongoUri, { serverSelectionTimeoutMS: 8000 });
  connected = true;
  console.log('[mongo] connected');
  return mongoose.connection;
}
