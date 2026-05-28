'use client';

import { useEffect, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import {
  AlertTriangle,
  Download,
  RefreshCcw,
  Sparkles,
} from 'lucide-react';
import { AppShell } from '@/components/AppShell';
import { Topbar } from '@/components/Topbar';
import { PaperView } from '@/components/PaperView';
import { GeneratingState } from '@/components/GeneratingState';
import {
  Assessment,
  getAssessment,
  regenerate as regenerateApi,
} from '@/lib/api';
import { getSocket } from '@/lib/socket';
import { useAssessmentStore } from '@/store/assessmentStore';
import { exportElementToPdf } from '@/lib/pdf';

export default function ResultPage() {
  const { id } = useParams<{ id: string }>();
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [busy, setBusy] = useState(false);
  const paperRef = useRef<HTMLDivElement>(null);

  const { progress, status, message, applyEvent, setStatus, setError, error } =
    useAssessmentStore();

  useEffect(() => {
    if (!id) return;
    let cancelled = false;

    (async () => {
      try {
        const a = await getAssessment(id);
        if (cancelled) return;
        setAssessment(a);
        applyEvent({ status: a.status, progress: a.progress });
        if (a.error) setError(a.error);
      } catch (e) {
        setError((e as Error).message);
      }
    })();

    const socket = getSocket();
    socket.emit('subscribe', id);

    const onProgress = (e: {
      assessmentId: string;
      status: string;
      progress: number;
      message?: string;
    }) => {
      if (e.assessmentId !== id) return;
      applyEvent({ status: e.status, progress: e.progress, message: e.message });
    };
    const onReady = async (e: { assessmentId: string }) => {
      if (e.assessmentId !== id) return;
      const a = await getAssessment(id);
      setAssessment(a);
      applyEvent({ status: 'ready', progress: 100 });
    };
    const onFailed = (e: { assessmentId: string; message: string }) => {
      if (e.assessmentId !== id) return;
      setError(e.message);
    };

    socket.on('assessment:progress', onProgress);
    socket.on('assessment:ready', onReady);
    socket.on('assessment:failed', onFailed);

    return () => {
      cancelled = true;
      socket.off('assessment:progress', onProgress);
      socket.off('assessment:ready', onReady);
      socket.off('assessment:failed', onFailed);
    };
  }, [id, applyEvent, setError]);

  async function handleRegenerate() {
    if (!id) return;
    setBusy(true);
    try {
      await regenerateApi(id);
      setStatus('processing');
      applyEvent({ progress: 5, message: 'Re-queued generation…' });
      const a = await getAssessment(id);
      setAssessment(a);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  async function handleDownload() {
    if (!paperRef.current || !assessment?.paper) return;
    setBusy(true);
    try {
      const safe = (assessment.paper.title || 'paper')
        .replace(/[^\w\d-]+/g, '_')
        .slice(0, 60);
      await exportElementToPdf(paperRef.current, `${safe}.pdf`);
    } finally {
      setBusy(false);
    }
  }

  const showPaper = assessment?.paper && status === 'ready';

  return (
    <AppShell topButton="toolkit">
      <Topbar
        title="Create New"
        icon={<Sparkles size={16} className="text-brand-500" />}
      />

      {showPaper && assessment.paper && (
        <div
          className="rounded-3xl p-6 sm:p-7 text-white no-print"
          style={{ background: '#28272a' }}
        >
          <p className="text-base sm:text-[17px] font-semibold leading-relaxed">
            {assessment.paper.aiIntro ||
              `Certainly, Lakshya! Here are customized Question Paper for your CBSE Grade ${assessment.paper.grade} ${assessment.paper.subject} classes on the NCERT chapters:`}
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button
              onClick={handleDownload}
              disabled={busy}
              className="inline-flex items-center gap-2 rounded-full bg-white text-ink-900 hover:bg-gray-100 px-5 py-2.5 text-sm font-semibold"
            >
              <Download size={15} /> Download as PDF
            </button>
            <button
              onClick={handleRegenerate}
              disabled={busy}
              className="inline-flex items-center gap-2 rounded-full bg-white/10 hover:bg-white/15 px-5 py-2.5 text-sm font-medium border border-white/15"
            >
              <RefreshCcw size={14} /> Regenerate
            </button>
          </div>
        </div>
      )}

      {error && status !== 'ready' && (
        <div className="card border-rose-200 bg-rose-50 p-5 flex items-start gap-3">
          <AlertTriangle className="text-rose-600 mt-0.5" size={18} />
          <div className="flex-1">
            <h3 className="font-medium text-rose-700">Generation failed</h3>
            <p className="text-sm text-rose-700/80 mt-0.5">{error}</p>
            <button
              onClick={handleRegenerate}
              className="btn-light mt-3 text-xs"
              disabled={busy}
            >
              <RefreshCcw size={14} /> Try again
            </button>
          </div>
        </div>
      )}

      {!showPaper && !error && (
        <GeneratingState progress={progress} message={message} />
      )}

      {showPaper && assessment.paper && (
        <PaperView ref={paperRef} paper={assessment.paper} />
      )}
    </AppShell>
  );
}
