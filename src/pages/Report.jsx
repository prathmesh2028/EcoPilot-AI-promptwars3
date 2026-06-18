import { useEffect, useState, useRef, useCallback } from 'react';
import { Navigate } from 'react-router-dom';
import { useEco } from '../context/EcoContext';
import { generateSustainabilityReport } from '../services/gemini';
import { FileText, Printer, Loader2, RefreshCw, AlertTriangle, Leaf, CheckCircle2 } from 'lucide-react';

/** Very simple markdown → React renderer (no external library needed) */
const MdRenderer = ({ text }) => {
  if (!text) return null;
  const lines = text.split('\n');
  let inList = false;
  const elements = [];

  lines.forEach((raw, i) => {
    const line = raw.trim();

    // Close list if needed
    if (inList && !line.startsWith('- ') && !line.startsWith('* ') && !line.match(/^\d+\./)) {
      inList = false;
    }

    if (line.startsWith('## ')) {
      elements.push(
        <h2 key={i} className="text-2xl font-extrabold text-slate-900 mt-10 mb-3 pb-2 border-b border-slate-200">
          {line.slice(3)}
        </h2>
      );
    } else if (line.startsWith('### ')) {
      elements.push(
        <h3 key={i} className="text-base font-bold text-slate-800 mt-6 mb-2">
          {line.slice(4)}
        </h3>
      );
    } else if (line.startsWith('# ')) {
      elements.push(
        <h1 key={i} className="text-3xl font-black text-slate-900 mt-4 mb-4">
          {line.slice(2)}
        </h1>
      );
    } else if (line.startsWith('- ') || line.startsWith('* ')) {
      elements.push(
        <li key={i} className="flex gap-2 items-start text-slate-700 text-sm leading-relaxed mb-1.5">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
          <span>{renderInline(line.slice(2))}</span>
        </li>
      );
    } else if (line.match(/^\d+\.\s/)) {
      const [, num, rest] = line.match(/^(\d+)\.\s(.+)/);
      elements.push(
        <li key={i} className="flex gap-2 items-start text-slate-700 text-sm leading-relaxed mb-1.5">
          <span className="font-bold text-emerald-700 shrink-0">{num}.</span>
          <span>{renderInline(rest)}</span>
        </li>
      );
    } else if (line === '') {
      elements.push(<div key={i} className="h-2" />);
    } else {
      elements.push(
        <p key={i} className="text-slate-700 text-[15px] leading-relaxed mb-2">
          {renderInline(line)}
        </p>
      );
    }
  });

  return <>{elements}</>;
};

/** Handle **bold** inline */
const renderInline = (text) => {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, i) =>
    part.startsWith('**') && part.endsWith('**')
      ? <strong key={i} className="font-bold text-slate-900">{part.slice(2, -2)}</strong>
      : part
  );
};

/**
 * Report Page Component
 * 
 * Fetches and displays a full markdown-formatted Executive Sustainability Report
 * from the Gemini AI service. Includes native print capabilities for PDF export.
 */
export const Report = () => {
  const { userData, carbonMetrics, hasCompletedAssessment, aiCache, updateAiCache } = useEco();
  const [reportText, setReportText] = useState(aiCache.report || '');
  const [loading,    setLoading]    = useState(false);
  const [error,      setError]      = useState(null);
  const printRef = useRef(null);

  const fetchReport = useCallback(async (force = false) => {
    if (!userData) return;
    if (aiCache.report && !force) { setReportText(aiCache.report); return; }
    setLoading(true);
    setError(null);
    try {
      const text = await generateSustainabilityReport(userData, carbonMetrics);
      setReportText(text);
      updateAiCache('report', text);
    } catch {
      setError('Failed to generate report. The AI service may be temporarily unavailable. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [userData, aiCache.report, carbonMetrics, updateAiCache]);

  useEffect(() => { 
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchReport(); 
  }, [fetchReport]);

  if (!hasCompletedAssessment) return <Navigate to="/assessment" replace />;

  const handlePrint = () => window.print();

  return (
    <div className="bg-slate-100 min-h-[calc(100vh-68px)] py-10 px-4 print:bg-white print:p-0">

      {/* ── Top controls (hidden in print) ─────────────── */}
      <div className="max-w-3xl mx-auto flex justify-between items-center mb-6 no-print animate-fade-in-up">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-slate-400" />
          <span className="text-sm font-semibold text-slate-500 uppercase tracking-widest">Executive Summary</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => fetchReport(true)}
            aria-label="Regenerate Report"
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 rounded-full border border-slate-300 text-sm font-semibold text-slate-600 hover:border-slate-400 hover:bg-white transition-all disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} /> Regenerate
          </button>
          <button
            onClick={handlePrint}
            aria-label="Export PDF"
            disabled={loading || !reportText}
            className="flex items-center gap-2 px-5 py-2 bg-slate-900 text-white rounded-full text-sm font-bold shadow-md hover:bg-slate-800 disabled:opacity-50 transition-all hover:-translate-y-0.5"
          >
            <Printer className="h-4 w-4" /> Export PDF
          </button>
        </div>
      </div>

      {/* ── Document sheet ──────────────────────────────── */}
      <div
        ref={printRef}
        className="max-w-3xl mx-auto bg-white min-h-[900px] shadow-2xl shadow-slate-200/70 rounded border border-slate-200 print:shadow-none print:border-none print:m-0 animate-fade-in-up delay-100"
      >
        {loading ? (
          <div className="flex flex-col items-center justify-center h-[500px] gap-6">
            <div className="relative">
              <div className="h-16 w-16 rounded-full border-4 border-emerald-100 flex items-center justify-center">
                <Leaf className="h-7 w-7 text-emerald-600" />
              </div>
              <Loader2 className="h-16 w-16 text-emerald-500 animate-spin absolute inset-0" />
            </div>
            <div className="text-center">
              <p className="text-sm font-bold tracking-widest uppercase text-slate-400">
                Compiling executive briefing…
              </p>
              <p className="text-xs text-slate-300 mt-1">Gemini AI is generating your personalized report</p>
            </div>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-[500px] gap-4 px-8 text-center">
            <AlertTriangle className="h-12 w-12 text-amber-500" />
            <h3 className="text-lg font-bold text-slate-800">Generation Failed</h3>
            <p className="text-sm text-slate-500 max-w-md">{error}</p>
            <button onClick={() => fetchReport(true)} aria-label="Try Again" className="mt-2 px-6 py-2.5 rounded-full bg-slate-900 text-white text-sm font-bold hover:bg-slate-800 transition-colors">
              Try Again
            </button>
          </div>
        ) : (
          <article className="p-10 sm:p-16 text-slate-800 print:p-8">
            {/* Report header */}
            <header className="border-b-2 border-slate-900 pb-8 mb-10">
              <div className="flex items-center gap-2 mb-6">
                <div className="h-8 w-8 bg-emerald-600 rounded-lg flex items-center justify-center">
                  <Leaf className="h-4 w-4 text-white" strokeWidth={2.5} />
                </div>
                <span className="font-black text-lg text-slate-900 tracking-tight">EcoPilot AI</span>
              </div>
              <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 mb-3">
                Sustainability Capability Report
              </h1>
              <p className="text-slate-500 font-medium">
                Auto-generated via EcoPilot AI • {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
              {/* Profile summary row */}
              <div className="mt-6 flex flex-wrap gap-3">
                {[
                  { label: 'Commute',   value: `${userData.commuteMode} · ${userData.commuteDistance} mi` },
                  { label: 'Diet',      value: userData.foodLifestyle },
                  { label: 'Office',    value: `${userData.officeDays} days/wk` },
                  { label: 'Lifestyle', value: userData.lifestylePattern },
                  { label: 'Total CO₂', value: `${carbonMetrics.total.toLocaleString()} kg/yr`, highlight: true },
                ].map(m => (
                  <div key={m.label} className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                    m.highlight
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : 'bg-slate-100 text-slate-600 border border-slate-200'
                  }`}>
                    <span className="opacity-60 mr-1">{m.label}:</span>{m.value}
                  </div>
                ))}
              </div>
            </header>

            {/* Report body */}
            <div className="prose prose-slate max-w-none">
              {reportText
                ? <MdRenderer text={reportText} />
                : <p className="text-slate-400 italic">Report content will appear here once generated.</p>
              }
            </div>

            {/* Footer */}
            <footer className="mt-16 pt-8 border-t border-slate-200 flex items-center justify-between text-xs text-slate-400">
              <span>CONFIDENTIAL — GENERATED BY ECOPILOT AI</span>
              <span>© {new Date().getFullYear()}</span>
            </footer>
          </article>
        )}
      </div>
    </div>
  );
};
