import { Worker, Job } from 'bullmq';
import { redisOptions } from '../config/redis';
import { connectMongo } from '../config/db';
import { Assessment } from '../models/Assessment';
import { generatePaper } from '../services/gemini';
import { emitProgress, emitReady, emitFailed } from '../sockets/io';
import { QUEUE_NAME } from './generationQueue';

let started = false;

export function startWorker() {
  if (started) return;
  started = true;

  const worker = new Worker(
    QUEUE_NAME,
    async (job: Job<{ assessmentId: string }>) => {
      const { assessmentId } = job.data;
      await connectMongo();

      const a = await Assessment.findById(assessmentId);
      if (!a) throw new Error('Assessment not found');

      a.status = 'processing';
      a.progress = 10;
      a.error = undefined;
      await a.save();
      emitProgress(assessmentId, {
        status: 'processing',
        progress: 10,
        message: 'Building structured prompt…',
      });

      a.progress = 35;
      await a.save();
      emitProgress(assessmentId, {
        status: 'processing',
        progress: 35,
        message: 'Calling AI model…',
      });

      const paper = await generatePaper(a);

      a.progress = 80;
      await a.save();
      emitProgress(assessmentId, {
        status: 'processing',
        progress: 80,
        message: 'Validating and structuring questions…',
      });

      a.paper = paper;
      a.status = 'ready';
      a.progress = 100;
      await a.save();

      emitReady(assessmentId);
      return { ok: true };
    },
    { connection: redisOptions, concurrency: 2 }
  );

  worker.on('failed', async (job, err) => {
    console.error('[worker] job failed', job?.id, err.message);
    if (!job) return;
    const { assessmentId } = job.data as { assessmentId: string };
    try {
      await Assessment.findByIdAndUpdate(assessmentId, {
        status: 'failed',
        error: err.message,
      });
    } catch (e) {
      console.error('[worker] failed to mark assessment failed', e);
    }
    emitFailed(assessmentId, err.message);
  });

  worker.on('ready', () => console.log('[worker] ready'));
  worker.on('error', (e) => console.error('[worker] error', e.message));
}

if (require.main === module) {
  connectMongo().then(() => startWorker());
}
