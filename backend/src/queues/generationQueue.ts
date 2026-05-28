import { Queue } from 'bullmq';
import { redisOptions } from '../config/redis';

export const QUEUE_NAME = 'assessment-generation';

export const generationQueue = new Queue(QUEUE_NAME, {
  connection: redisOptions,
  defaultJobOptions: {
    attempts: 2,
    backoff: { type: 'exponential', delay: 2000 },
    removeOnComplete: { count: 50 },
    removeOnFail: { count: 50 },
  },
});

export async function enqueueGeneration(assessmentId: string) {
  return generationQueue.add(
    'generate',
    { assessmentId },
    { jobId: `gen:${assessmentId}:${Date.now()}` }
  );
}
