import express from 'express';
import cors from 'cors';
import http from 'http';
import { env } from './config/env';
import { connectMongo } from './config/db';
import assessmentsRouter from './routes/assessments';
import { initSocket } from './sockets/io';
import { startWorker } from './queues/worker';

async function bootstrap() {
  await connectMongo();

  const app = express();
  app.use(
    cors({
      origin: (origin, cb) => cb(null, true),
      credentials: true,
    })
  );
  app.use(express.json({ limit: '2mb' }));

  app.get('/health', (_req, res) =>
    res.json({ ok: true, time: new Date().toISOString() })
  );

  app.use('/api/assessments', assessmentsRouter);

  const server = http.createServer(app);
  initSocket(server);

  if (env.runWorkerInline) {
    startWorker();
    console.log('[server] worker running inline');
  }

  server.listen(env.port, () => {
    console.log(`[server] listening on :${env.port} (${env.nodeEnv})`);
  });
}

bootstrap().catch((err) => {
  console.error('[bootstrap] fatal', err);
  process.exit(1);
});
