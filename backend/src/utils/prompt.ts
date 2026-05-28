import { IAssessmentDoc } from '../models/Assessment';

export function buildPrompt(a: IAssessmentDoc): string {
  const specBlock = a.questionSpecs
    .map(
      (s) =>
        `- ${s.type}: ${s.count} question${s.count > 1 ? 's' : ''} × ${s.marks} mark${s.marks > 1 ? 's' : ''} each`
    )
    .join('\n');

  const sourceBlock = a.sourceText
    ? `\nSOURCE MATERIAL (questions must be answerable from this):\n"""\n${a.sourceText.slice(0, 12000)}\n"""\n`
    : '';

  return `You are an expert Indian school teacher generating a printable, exam-style question paper.

Return ONLY valid JSON (no markdown, no commentary) matching exactly this TypeScript type:

type Paper = {
  schoolName: string;          // e.g. "Delhi Public School, Sector-4, Bokaro"
  title: string;
  subject: string;
  grade: string;               // e.g. "5th"
  durationMinutes: number;     // e.g. 45
  totalMarks: number;
  generalInstructions: string[]; // e.g. ["All questions are compulsory unless stated otherwise."]
  sections: {
    title: string;             // "Section A", "Section B", ...
    instruction: string;       // e.g. "Attempt all questions. Each question carries 2 marks"
    questions: {
      text: string;            // PREFIX with "[Easy] " | "[Moderate] " | "[Challenging] " and SUFFIX with "[N Marks]"
      difficulty: "easy" | "moderate" | "hard";
      marks: number;
      type: string;            // e.g. "MCQ" | "Short Answer" | "Long Answer"
      options?: string[];      // only for MCQ (4 options)
      answer?: string;         // brief model answer
    }[];
  }[];
  answerKey: string[];         // numbered answers in the order questions appear, plain text
  aiIntro: string;             // one short friendly sentence introducing the paper, e.g. "Certainly! Here is a question paper for ..."
};

Constraints:
- Title: "${a.title}"
- Subject: "${a.subject || 'General'}"
- Grade: "${a.grade || 'N/A'}"
- School name: "${a.schoolName || 'Delhi Public School, Sector-4, Bokaro'}"
- Total questions across all sections: exactly ${a.numQuestions}
- Total marks across all questions: exactly ${a.totalMarks}
- Question type breakdown (must match exactly):
${specBlock}
- Group questions by type into sections (Section A, B, C...). One section per type, ordered easiest-first (MCQ → True/False → Short → Diagram → Long → Numerical).
- Every question text MUST start with "[Easy] ", "[Moderate] " or "[Challenging] " and end with "[N Marks]".
- Mix difficulties within each section.
- For MCQ provide 4 plausible options.
- Keep questions clear, age-appropriate, self-contained, and free of LaTeX or markdown.
${a.instructions ? `- Teacher's note: ${a.instructions}` : ''}
${sourceBlock}
Output: JSON only.`;
}
