import { Schema, model, Document } from 'mongoose';

export type Difficulty = 'easy' | 'moderate' | 'hard';

export interface IQuestion {
  text: string;
  difficulty: Difficulty;
  marks: number;
  type: string;
  options?: string[];
  answer?: string;
}

export interface ISection {
  title: string;
  instruction: string;
  questions: IQuestion[];
}

export interface IQuestionSpec {
  type: string;
  count: number;
  marks: number;
}

export interface IAssessmentDoc extends Document {
  title: string;
  subject?: string;
  grade?: string;
  schoolName?: string;
  dueDate?: string;
  questionSpecs: IQuestionSpec[];
  numQuestions: number;
  totalMarks: number;
  instructions?: string;
  sourceText?: string;
  sourceFileName?: string;
  status: 'pending' | 'processing' | 'ready' | 'failed';
  progress: number;
  error?: string;
  paper?: {
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
  };
  createdAt: Date;
  updatedAt: Date;
}

const QuestionSchema = new Schema<IQuestion>(
  {
    text: { type: String, required: true },
    difficulty: {
      type: String,
      enum: ['easy', 'moderate', 'hard'],
      required: true,
    },
    marks: { type: Number, required: true },
    type: { type: String, required: true },
    options: [String],
    answer: String,
  },
  { _id: false }
);

const SectionSchema = new Schema<ISection>(
  {
    title: { type: String, required: true },
    instruction: { type: String, default: '' },
    questions: { type: [QuestionSchema], default: [] },
  },
  { _id: false }
);

const SpecSchema = new Schema<IQuestionSpec>(
  {
    type: { type: String, required: true },
    count: { type: Number, required: true, min: 1 },
    marks: { type: Number, required: true, min: 1 },
  },
  { _id: false }
);

const AssessmentSchema = new Schema<IAssessmentDoc>(
  {
    title: { type: String, required: true },
    subject: String,
    grade: String,
    schoolName: String,
    dueDate: String,
    questionSpecs: { type: [SpecSchema], default: [] },
    numQuestions: { type: Number, required: true, min: 1 },
    totalMarks: { type: Number, required: true, min: 1 },
    instructions: String,
    sourceText: String,
    sourceFileName: String,
    status: {
      type: String,
      enum: ['pending', 'processing', 'ready', 'failed'],
      default: 'pending',
    },
    progress: { type: Number, default: 0 },
    error: String,
    paper: {
      schoolName: String,
      title: String,
      subject: String,
      grade: String,
      durationMinutes: Number,
      totalMarks: Number,
      generalInstructions: [String],
      sections: [SectionSchema],
      answerKey: [String],
      aiIntro: String,
    },
  },
  { timestamps: true }
);

export const Assessment = model<IAssessmentDoc>('Assessment', AssessmentSchema);
