export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export type Difficulty = 'easy' | 'moderate' | 'hard';

export interface Question {
  text: string;
  difficulty: Difficulty;
  marks: number;
  type: string;
  options?: string[];
  answer?: string;
}

export interface Section {
  title: string;
  instruction: string;
  questions: Question[];
}

export interface Paper {
  schoolName: string;
  title: string;
  subject: string;
  grade: string;
  durationMinutes: number;
  totalMarks: number;
  generalInstructions: string[];
  sections: Section[];
  answerKey: string[];
  aiIntro?: string;
}

export interface QuestionTypeSpec {
  type: string;
  count: number;
  marks: number;
}

export interface Assessment {
  _id: string;
  title: string;
  subject?: string;
  grade?: string;
  schoolName?: string;
  dueDate?: string;
  questionSpecs: QuestionTypeSpec[];
  numQuestions: number;
  totalMarks: number;
  instructions?: string;
  status: 'pending' | 'processing' | 'ready' | 'failed';
  progress: number;
  error?: string;
  paper?: Paper;
  createdAt: string;
}

export interface AssessmentSummary {
  _id: string;
  title: string;
  subject?: string;
  status: Assessment['status'];
  progress: number;
  createdAt: string;
  totalMarks: number;
  numQuestions: number;
  dueDate?: string;
}

export async function createAssessment(form: FormData): Promise<{ id: string }> {
  const res = await fetch(`${API_URL}/api/assessments`, {
    method: 'POST',
    body: form,
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || data.issues?.[0]?.message || 'Request failed');
  }
  return res.json();
}

export async function getAssessment(id: string): Promise<Assessment> {
  const res = await fetch(`${API_URL}/api/assessments/${id}`, {
    cache: 'no-store',
  });
  if (!res.ok) throw new Error('Failed to load assessment');
  return res.json();
}

export async function listAssessments(): Promise<AssessmentSummary[]> {
  const res = await fetch(`${API_URL}/api/assessments`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to list assessments');
  return res.json();
}

export async function deleteAssessment(id: string): Promise<void> {
  const res = await fetch(`${API_URL}/api/assessments/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete');
}

export async function regenerate(id: string) {
  const res = await fetch(`${API_URL}/api/assessments/${id}/regenerate`, {
    method: 'POST',
  });
  if (!res.ok) throw new Error('Failed to regenerate');
  return res.json();
}
