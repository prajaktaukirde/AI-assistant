import { GoogleGenerativeAI } from '@google/generative-ai';
import { env } from '../config/env';
import { IAssessmentDoc, ISection, Difficulty } from '../models/Assessment';
import { buildPrompt } from '../utils/prompt';
import { safeJsonParse } from '../utils/parse';

interface RawPaper {
  schoolName: string;
  title: string;
  subject: string;
  grade: string;
  durationMinutes: number;
  totalMarks: number;
  generalInstructions: string[];
  sections: ISection[];
  answerKey: string[];
  aiIntro?: string;
}

const ALLOWED_DIFF: Difficulty[] = ['easy', 'moderate', 'hard'];

function clean(p: RawPaper, a: IAssessmentDoc): RawPaper {
  const sections = (p.sections || []).map((s) => ({
    title: s.title || 'Section',
    instruction: s.instruction || 'Attempt all questions.',
    questions: (s.questions || []).map((q) => {
      let diff = (q.difficulty || 'moderate').toLowerCase() as Difficulty;
      if (diff === ('medium' as Difficulty)) diff = 'moderate';
      if (!ALLOWED_DIFF.includes(diff)) diff = 'moderate';
      return {
        text: String(q.text || '').trim(),
        difficulty: diff,
        marks: Math.max(1, Number(q.marks) || 1),
        type: q.type || 'Short Answer',
        options: Array.isArray(q.options) ? q.options : undefined,
        answer: q.answer ? String(q.answer) : undefined,
      };
    }),
  }));

  const totalMarks =
    Number(p.totalMarks) ||
    sections.reduce(
      (acc, s) => acc + s.questions.reduce((x, q) => x + q.marks, 0),
      0
    );

  const answerKey = (p.answerKey && p.answerKey.length
    ? p.answerKey
    : sections
        .flatMap((s) => s.questions)
        .map((q) => q.answer || '—')
  ).map(String);

  return {
    schoolName: p.schoolName || a.schoolName || 'Delhi Public School, Sector-4, Bokaro',
    title: p.title || a.title,
    subject: p.subject || a.subject || 'General',
    grade: p.grade || a.grade || 'N/A',
    durationMinutes: Number(p.durationMinutes) || 60,
    totalMarks,
    generalInstructions:
      p.generalInstructions && p.generalInstructions.length
        ? p.generalInstructions
        : ['All questions are compulsory unless stated otherwise.'],
    sections,
    answerKey,
    aiIntro:
      p.aiIntro ||
      `Here is a customized question paper for your ${a.subject || 'class'}.`,
  };
}

export async function generatePaper(a: IAssessmentDoc): Promise<RawPaper> {
  const prompt = buildPrompt(a);

  if (!env.geminiKey) {
    return mockPaper(a);
  }

  try {
    const genAI = new GoogleGenerativeAI(env.geminiKey);
    const model = genAI.getGenerativeModel({
      model: env.geminiModel,
      generationConfig: { responseMimeType: 'application/json' },
    });
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const parsed = safeJsonParse<RawPaper>(text);
    return clean(parsed, a);
  } catch (e) {
    console.error('[gemini] failed, using mock:', (e as Error).message);
    return mockPaper(a);
  }
}

function mockPaper(a: IAssessmentDoc): RawPaper {
  const letters = ['A', 'B', 'C', 'D', 'E'];
  const sections: ISection[] = a.questionSpecs.map((spec, idx) => {
    const questions = Array.from({ length: spec.count }).map((_, i) => {
      const diff: Difficulty =
        i % 3 === 0 ? 'easy' : i % 3 === 1 ? 'moderate' : 'hard';
      const tag =
        diff === 'easy' ? 'Easy' : diff === 'moderate' ? 'Moderate' : 'Challenging';
      const baseText = `${spec.type} question ${i + 1} on ${a.subject || a.title}.`;
      const text = `[${tag}] ${baseText} [${spec.marks} Marks]`;
      const base = {
        text,
        difficulty: diff,
        marks: spec.marks,
        type: spec.type,
      };
      if (spec.type.toLowerCase().includes('multiple choice')) {
        return {
          ...base,
          options: ['Option A', 'Option B', 'Option C', 'Option D'],
          answer: 'Option A is correct because it matches the definition.',
        };
      }
      return {
        ...base,
        answer: `Sample answer for question ${i + 1}.`,
      };
    });
    return {
      title: `Section ${letters[idx] || idx + 1}`,
      instruction: `Attempt all questions. Each question carries ${spec.marks} mark${spec.marks > 1 ? 's' : ''}.`,
      questions,
    };
  });

  const allQs = sections.flatMap((s) => s.questions);

  return clean(
    {
      schoolName: a.schoolName || 'Delhi Public School, Sector-4, Bokaro',
      title: a.title,
      subject: a.subject || 'General',
      grade: a.grade || '5th',
      durationMinutes: 45,
      totalMarks: allQs.reduce((acc, q) => acc + q.marks, 0),
      generalInstructions: ['All questions are compulsory unless stated otherwise.'],
      sections,
      answerKey: allQs.map((q, i) => q.answer || `Answer ${i + 1}`),
      aiIntro: `Certainly! Here is a customized Question Paper for your ${a.grade || ''} ${a.subject || ''} class.`.trim(),
    },
    a
  );
}
