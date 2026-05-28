import { Router } from 'express';
import multer from 'multer';
import { z } from 'zod';
import { Assessment } from '../models/Assessment';
import { enqueueGeneration } from '../queues/generationQueue';
import { extractTextFromBuffer } from '../services/pdfText';

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
});

const SpecSchema = z.object({
  type: z.string().min(1),
  count: z.coerce.number().int().min(1).max(50),
  marks: z.coerce.number().int().min(1).max(20),
});

const CreateSchema = z.object({
  title: z.string().min(2).max(200),
  subject: z.string().max(100).optional(),
  grade: z.string().max(40).optional(),
  schoolName: z.string().max(200).optional(),
  dueDate: z.string().optional(),
  questionSpecs: z.array(SpecSchema).min(1, 'Add at least one question type'),
  instructions: z.string().max(2000).optional(),
});

router.post('/', upload.single('file'), async (req, res) => {
  try {
    const body: Record<string, unknown> = { ...req.body };
    if (typeof body.questionSpecs === 'string') {
      try {
        body.questionSpecs = JSON.parse(body.questionSpecs);
      } catch {
        body.questionSpecs = [];
      }
    }

    const data = CreateSchema.parse(body);

    const numQuestions = data.questionSpecs.reduce((a, s) => a + s.count, 0);
    const totalMarks = data.questionSpecs.reduce(
      (a, s) => a + s.count * s.marks,
      0
    );

    let sourceText: string | undefined;
    let sourceFileName: string | undefined;
    if (req.file) {
      sourceFileName = req.file.originalname;
      try {
        sourceText = await extractTextFromBuffer(
          req.file.buffer,
          req.file.mimetype
        );
      } catch {
        sourceText = undefined;
      }
    }

    const doc = await Assessment.create({
      ...data,
      numQuestions,
      totalMarks,
      sourceText,
      sourceFileName,
      status: 'pending',
      progress: 0,
    });

    await enqueueGeneration(String(doc._id));
    res.status(201).json({ id: String(doc._id), status: doc.status });
  } catch (err: unknown) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Validation failed',
        issues: err.issues.map((i) => ({
          path: i.path.join('.'),
          message: i.message,
        })),
      });
    }
    console.error('[POST /assessments]', err);
    res.status(500).json({ error: (err as Error).message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const doc = await Assessment.findById(req.params.id).lean();
    if (!doc) return res.status(404).json({ error: 'Not found' });
    res.json(doc);
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await Assessment.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
});

router.post('/:id/regenerate', async (req, res) => {
  try {
    const doc = await Assessment.findById(req.params.id);
    if (!doc) return res.status(404).json({ error: 'Not found' });
    doc.status = 'pending';
    doc.progress = 0;
    doc.error = undefined;
    doc.paper = undefined;
    await doc.save();
    await enqueueGeneration(String(doc._id));
    res.json({ id: String(doc._id), status: doc.status });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

router.get('/', async (_req, res) => {
  const docs = await Assessment.find()
    .sort({ createdAt: -1 })
    .limit(50)
    .select('title subject status progress createdAt totalMarks numQuestions dueDate')
    .lean();
  res.json(docs);
});

export default router;
