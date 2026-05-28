'use client';

import { create } from 'zustand';

export interface ProgressEvent {
  status: string;
  progress: number;
  message?: string;
}

interface State {
  currentId: string | null;
  progress: number;
  status: 'idle' | 'pending' | 'processing' | 'ready' | 'failed';
  message: string;
  error: string | null;
  setCurrent: (id: string) => void;
  applyEvent: (e: Partial<ProgressEvent>) => void;
  setStatus: (s: State['status']) => void;
  setError: (e: string | null) => void;
  reset: () => void;
}

export const useAssessmentStore = create<State>((set) => ({
  currentId: null,
  progress: 0,
  status: 'idle',
  message: '',
  error: null,
  setCurrent: (id) =>
    set({
      currentId: id,
      progress: 0,
      status: 'pending',
      message: 'Queued for generation…',
      error: null,
    }),
  applyEvent: (e) =>
    set((s) => ({
      progress: typeof e.progress === 'number' ? e.progress : s.progress,
      status: (e.status as State['status']) || s.status,
      message: e.message || s.message,
    })),
  setStatus: (status) => set({ status }),
  setError: (error) => set({ error, status: 'failed' }),
  reset: () =>
    set({
      currentId: null,
      progress: 0,
      status: 'idle',
      message: '',
      error: null,
    }),
}));
