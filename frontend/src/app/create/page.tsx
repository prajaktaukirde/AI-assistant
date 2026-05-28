'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  CloudUpload,
  Mic,
  Minus,
  Plus,
  X,
  ChevronDown,
} from 'lucide-react';
import { AppShell } from '@/components/AppShell';
import { Topbar } from '@/components/Topbar';
import { createAssessment } from '@/lib/api';

const TYPE_OPTIONS = [
  'Multiple Choice Questions',
  'Short Questions',
  'Long Questions',
  'True / False',
  'Fill in the Blanks',
  'Diagram/Graph-Based Questions',
  'Numerical Problems',
];

interface SpecRow {
  type: string;
  count: number;
  marks: number;
}

export default function CreatePage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [grade, setGrade] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [instructions, setInstructions] = useState('');
  const [specs, setSpecs] = useState<SpecRow[]>([
    { type: 'Multiple Choice Questions', count: 4, marks: 1 },
    { type: 'Short Questions', count: 3, marks: 2 },
    { type: 'Diagram/Graph-Based Questions', count: 5, marks: 5 },
    { type: 'Numerical Problems', count: 5, marks: 5 },
  ]);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const totalQuestions = specs.reduce((a, s) => a + s.count, 0);
  const totalMarks = specs.reduce((a, s) => a + s.count * s.marks, 0);

  function setRow(i: number, patch: Partial<SpecRow>) {
    setSpecs((rows) =>
      rows.map((r, idx) => (idx === i ? { ...r, ...patch } : r))
    );
  }
  function removeRow(i: number) {
    setSpecs((rows) => rows.filter((_, idx) => idx !== i));
  }
  function addRow() {
    const used = new Set(specs.map((s) => s.type));
    const next = TYPE_OPTIONS.find((t) => !used.has(t)) || TYPE_OPTIONS[0];
    setSpecs((rows) => [...rows, { type: next, count: 1, marks: 1 }]);
  }

  function validate(): string | null {
    const err: Record<string, string> = {};
    if (title.trim().length < 2) err.title = 'Title is required';
    if (specs.length === 0) err.specs = 'Add at least one question type';
    specs.forEach((s, i) => {
      if (s.count < 1) err[`count-${i}`] = 'Min 1';
      if (s.marks < 1) err[`marks-${i}`] = 'Min 1';
    });
    if (totalQuestions < 1) err.total = 'Need at least 1 question';
    setErrors(err);
    return Object.keys(err).length ? 'Please fix the highlighted fields.' : null;
  }

  async function onSubmit() {
    const e = validate();
    if (e) return;
    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append('title', title);
      if (subject) fd.append('subject', subject);
      if (grade) fd.append('grade', grade);
      if (dueDate) fd.append('dueDate', dueDate);
      if (instructions) fd.append('instructions', instructions);
      fd.append('questionSpecs', JSON.stringify(specs));
      if (file) fd.append('file', file);

      const { id } = await createAssessment(fd);
      router.push(`/result/${id}`);
    } catch (err) {
      setErrors({ submit: (err as Error).message });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AppShell>
      <Topbar title="Assignment" />

      <div className="card p-6 sm:p-8">
        <div className="flex items-start gap-3 mb-6">
          <span className="mt-1.5 h-3 w-3 rounded-full bg-emerald-500 ring-4 ring-emerald-100 shrink-0" />
          <div>
            <h2 className="text-xl font-bold">Create Assignment</h2>
            <p className="text-sm text-gray-500 mt-0.5">
              Set up a new assignment for your students
            </p>
          </div>
        </div>

        <div className="mb-6 flex items-center gap-2">
          <div className="h-1 flex-1 rounded-full bg-ink-900" />
          <div className="h-1 flex-1 rounded-full bg-gray-200" />
        </div>

        <div className="rounded-3xl border border-gray-100 bg-gray-50/60 p-6 sm:p-8">
          <h3 className="text-xl font-bold">Assignment Details</h3>
          <p className="text-sm text-gray-500 mt-0.5">
            Basic information about your assignment
          </p>

          <FileDrop file={file} onChange={setFile} />

          <p className="text-xs text-center text-gray-500 mt-3 mb-7">
            Upload images of your preferred document/image
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-7">
            <div className="sm:col-span-2">
              <label className="label">Title *</label>
              <input
                className="input"
                placeholder="e.g. Quiz on Electricity"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              {errors.title && <Err msg={errors.title} />}
            </div>
            <div>
              <label className="label">Subject</label>
              <input
                className="input"
                placeholder="e.g. Science"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </div>
            <div>
              <label className="label">Grade / Class</label>
              <input
                className="input"
                placeholder="e.g. 5th"
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
              />
            </div>
          </div>

          <div className="mb-7">
            <label className="label">Due Date</label>
            <div className="relative">
              <input
                type="date"
                className="input pr-14"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                placeholder="DD-MM-YYYY"
              />
              <span className="absolute right-2 top-1/2 -translate-y-1/2 grid h-9 w-9 place-items-center rounded-full bg-ink-900 text-white pointer-events-none">
                <Calendar size={15} />
              </span>
            </div>
          </div>

          <div>
            <div className="grid grid-cols-[1fr_24px_140px_140px] gap-3 items-center text-sm font-semibold text-ink-900 mb-3">
              <span>Question Type</span>
              <span />
              <span className="text-center">No. of Questions</span>
              <span className="text-center">Marks</span>
            </div>

            <div className="space-y-3">
              {specs.map((s, i) => (
                <div
                  key={i}
                  className="grid grid-cols-[1fr_24px_140px_140px] gap-3 items-center"
                >
                  <TypeSelect
                    value={s.type}
                    onChange={(v) => setRow(i, { type: v })}
                  />
                  <button
                    onClick={() => removeRow(i)}
                    className="grid h-7 w-7 place-items-center text-gray-500 hover:text-rose-600"
                    aria-label="Remove"
                  >
                    <X size={18} />
                  </button>
                  <Stepper
                    value={s.count}
                    onChange={(v) => setRow(i, { count: Math.max(1, v) })}
                  />
                  <Stepper
                    value={s.marks}
                    onChange={(v) => setRow(i, { marks: Math.max(1, v) })}
                  />
                </div>
              ))}
            </div>

            <button
              onClick={addRow}
              className="mt-5 inline-flex items-center gap-3 text-sm text-ink-900 font-semibold"
            >
              <span className="grid h-9 w-9 place-items-center rounded-full bg-ink-900 text-white">
                <Plus size={16} />
              </span>
              Add Question Type
            </button>

            <div className="mt-6 flex justify-end gap-x-10 text-sm">
              <span>
                <strong className="font-semibold">Total Questions :</strong>{' '}
                <span className="font-semibold">{totalQuestions}</span>
              </span>
              <span>
                <strong className="font-semibold">Total Marks :</strong>{' '}
                <span className="font-semibold">{totalMarks}</span>
              </span>
            </div>
          </div>

          <div className="mt-7">
            <label className="label">
              Additional Information (For better output)
            </label>
            <div className="relative rounded-2xl border-2 border-dashed border-gray-200 bg-white p-4">
              <textarea
                className="w-full min-h-[100px] bg-transparent border-none outline-none text-sm placeholder-gray-400 resize-none pr-10"
                placeholder="e.g Generate a question paper for 3 hour exam duration..."
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
              />
              <button
                type="button"
                className="absolute right-3 bottom-3 grid h-9 w-9 place-items-center rounded-full bg-ink-900 text-white"
                aria-label="Voice input (UI only)"
              >
                <Mic size={14} />
              </button>
            </div>
          </div>
        </div>

        {errors.submit && (
          <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {errors.submit}
          </div>
        )}

        <div className="mt-7 flex items-center justify-between">
          <button onClick={() => router.back()} className="btn-light">
            <ArrowLeft size={14} /> Previous
          </button>
          <button
            onClick={onSubmit}
            disabled={submitting}
            className="btn-dark"
          >
            {submitting ? 'Generating…' : 'Next'} <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </AppShell>
  );
}

function Err({ msg }: { msg?: string }) {
  if (!msg) return null;
  return <p className="mt-1 text-xs text-rose-600">{msg}</p>;
}

function FileDrop({
  file,
  onChange,
}: {
  file: File | null;
  onChange: (f: File | null) => void;
}) {
  const [drag, setDrag] = useState(false);
  return (
    <label
      onDragOver={(e) => {
        e.preventDefault();
        setDrag(true);
      }}
      onDragLeave={() => setDrag(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDrag(false);
        const f = e.dataTransfer.files?.[0];
        if (f) onChange(f);
      }}
      className={`mt-6 flex flex-col items-center justify-center text-center rounded-3xl border-2 border-dashed bg-white py-10 px-6 cursor-pointer transition ${
        drag ? 'border-brand-400 bg-brand-50/40' : 'border-gray-300'
      }`}
    >
      <span className="grid h-14 w-14 place-items-center rounded-full bg-ink-900 text-white">
        <CloudUpload size={22} />
      </span>
      <p className="mt-4 text-base font-semibold text-ink-900">
        {file ? file.name : 'Choose a file or drag & drop it here'}
      </p>
      <p className="mt-1 text-xs text-gray-500">
        {file
          ? `${(file.size / 1024).toFixed(0)} KB · click to replace`
          : 'JPEG, PNG, upto 10MB'}
      </p>
      <span className="mt-5 inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-6 py-2.5 text-sm font-medium text-ink-900 hover:bg-gray-50">
        Browse Files
      </span>
      <input
        type="file"
        accept=".pdf,.txt,image/*,application/pdf,text/*"
        className="hidden"
        onChange={(e) => onChange(e.target.files?.[0] || null)}
      />
    </label>
  );
}

function TypeSelect({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none w-full rounded-full bg-white px-5 py-3 pr-10 text-sm font-medium text-ink-900 outline-none focus:ring-2 focus:ring-brand-100"
        style={{ boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.04), 0 4px 12px -4px rgb(0 0 0 / 0.08)' }}
      >
        {TYPE_OPTIONS.map((t) => (
          <option key={t} value={t}>
            {t}
          </option>
        ))}
      </select>
      <ChevronDown
        size={16}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
      />
    </div>
  );
}

function Stepper({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div
      className="inline-flex items-center justify-between gap-2 rounded-full bg-white px-2 py-1.5 w-full"
      style={{ boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.04), 0 4px 12px -4px rgb(0 0 0 / 0.08)' }}
    >
      <button
        type="button"
        onClick={() => onChange(value - 1)}
        className="grid h-7 w-7 place-items-center rounded-full text-gray-700 hover:bg-gray-100"
      >
        <Minus size={14} />
      </button>
      <span className="text-sm font-semibold tabular-nums">{value}</span>
      <button
        type="button"
        onClick={() => onChange(value + 1)}
        className="grid h-7 w-7 place-items-center rounded-full text-gray-700 hover:bg-gray-100"
      >
        <Plus size={14} />
      </button>
    </div>
  );
}
