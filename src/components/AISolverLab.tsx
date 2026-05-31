import { useState, FormEvent, useEffect } from "react";
import {
  Sparkles,
  Award,
  Atom,
  Beaker,
  CheckCircle2,
  XCircle,
  Info,
  AlertTriangle,
  Lightbulb,
  BookOpen,
  Volume2,
  Download,
  ChevronRight,
  ChevronDown,
  Flag,
} from "lucide-react";
import { ChemistrySolution, SavedProblem } from "../types";

interface AISolverLabProps {
  question: string;
  setQuestion: (val: string) => void;
  difficultyLevel: string;
  setDifficultyLevel: (val: string) => void;
  isLoading: boolean;
  setIsLoading: (val: boolean) => void;
  error: string | null;
  setError: (val: string | null) => void;
  solution: ChemistrySolution | null;
  setSolution: (val: ChemistrySolution | null) => void;
  savedProblems: SavedProblem[];
  setSavedProblems: (val: SavedProblem[]) => void;
  activeProblemId: string;
  setActiveProblemId: (val: string) => void;
  selectedPracticeAnswers: Record<string, number>;
  setSelectedPracticeAnswers: (
    val: Record<string, number> | ((prev: Record<string, number>) => Record<string, number>)
  ) => void;
  handleQuickTemplate: (presetText: string) => void;
  defaultProblems: SavedProblem[];
}

export default function AISolverLab({
  question,
  setQuestion,
  difficultyLevel,
  setDifficultyLevel,
  isLoading,
  setIsLoading,
  error,
  setError,
  solution,
  setSolution,
  savedProblems,
  setSavedProblems,
  activeProblemId,
  setActiveProblemId,
  selectedPracticeAnswers,
  setSelectedPracticeAnswers,
  handleQuickTemplate,
  defaultProblems,
}: AISolverLabProps) {
  const [loadingStepLabel, setLoadingStepLabel] = useState("");
  const [isPlayingVoice, setIsPlayingVoice] = useState(false);
  const [activeSpokenStep, setActiveSpokenStep] = useState<number | null>(null);
  // 0-based index of the step currently "In Progress"
  const [activeIdx, setActiveIdx] = useState(0);

  // Reset progress whenever a fresh solution arrives
  useEffect(() => {
    if (solution) setActiveIdx(0);
  }, [solution]);

  /* ── voice helpers ─────────────────────────────────── */
  const stopActiveSpeech = () => {
    window.speechSynthesis.cancel();
    setIsPlayingVoice(false);
    setActiveSpokenStep(null);
  };

  const playVoiceForText = (text: string, stepId: number) => {
    window.speechSynthesis.cancel();
    if (isPlayingVoice && activeSpokenStep === stepId) {
      setIsPlayingVoice(false);
      setActiveSpokenStep(null);
      return;
    }
    const utterance = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();
    const voice =
      voices.find((v) => v.lang.toLowerCase().startsWith("en-za") || v.lang.toLowerCase().startsWith("en-zw")) ||
      voices.find((v) => v.lang.toLowerCase().startsWith("en-gb")) ||
      voices.find((v) => v.lang.toLowerCase().startsWith("en")) ||
      null;
    if (voice) utterance.voice = voice;
    utterance.rate = 0.84;
    utterance.pitch = 0.99;
    utterance.onstart = () => { setIsPlayingVoice(true); setActiveSpokenStep(stepId); };
    utterance.onend = () => { setIsPlayingVoice(false); setActiveSpokenStep(null); };
    utterance.onerror = () => { setIsPlayingVoice(false); setActiveSpokenStep(null); };
    window.speechSynthesis.speak(utterance);
  };

  const handleSpeakFullSolution = () => {
    if (!solution) return;
    if (isPlayingVoice) { stopActiveSpeech(); return; }
    let text = `Salibonani! Greetings from Andrew Academy. Topic: ${solution.topic || "Analysis Result"}. `;
    text += `Summary: ${solution.summary}. `;
    solution.steps.forEach((s) => {
      text += `Step ${s.number}: ${s.title}. ${s.explanation}. `;
      if (s.calculation) text += `Calculation: ${s.calculation.replace(/\*/g, " times ").replace(/\//g, " divided by ")}. `;
      text += `Result: ${s.result}. `;
    });
    text += `Pro tip: ${solution.conceptualTakeaway}. Final answer: ${solution.finalAnswer}.`;
    playVoiceForText(text, 999);
  };

  /* ── export notes ──────────────────────────────────── */
  const exportToText = () => {
    if (!solution) return;
    let c = `======================================\nANDREW ACADEMY: METALLURGICAL LAB NOTES\n======================================\n\n`;
    c += `TOPIC: ${solution.topic || "Analysis Result"}\n\nQUESTION:\n${question}\n\nSUMMARY:\n${solution.summary}\n\n`;
    if (solution.chemicalEquations?.length) {
      c += `EQUATIONS:\n`;
      solution.chemicalEquations.forEach((eq, i) => {
        c += ` ${i + 1}. ${eq.reactants} ${eq.arrow} ${eq.products} (${eq.balanced ? "Balanced" : "Skeleton"})\n`;
        if (eq.notes) c += `    Notes: ${eq.notes}\n`;
      });
      c += `\n`;
    }
    c += `STEPS:\n`;
    solution.steps.forEach((s) => {
      c += ` Step ${s.number}: ${s.title}\n   ${s.explanation}\n`;
      if (s.formula) c += `   Formula: ${s.formula}\n`;
      if (s.calculation) c += `   Calculation: ${s.calculation}\n`;
      c += `   Result: ${s.result}\n\n`;
    });
    c += `PRO TIP:\n${solution.conceptualTakeaway}\n\nFINAL ANSWER:\n${solution.finalAnswer}\n\n======================================\nGenerated by Andrew Academy VMS\n======================================\n`;
    const blob = new Blob([c], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Andrew_Academy_Notes_${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  /* ── AI solve ──────────────────────────────────────── */
  const LOADING_MESSAGES = [
    "Andrew is scanning feed material assays...",
    "Retrieving minerals and crystalline structure stats...",
    "Computing dry matrix mass balances...",
    "Calculating sintering temperatures stoichiometries...",
    "Checking machine calibration tolerances...",
  ];

  const handleSolveWithAI = async (e: FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;
    setIsLoading(true);
    setError(null);
    setSelectedPracticeAnswers({});
    setActiveIdx(0);
    let msgIndex = 0;
    setLoadingStepLabel(LOADING_MESSAGES[0]);
    const animInterval = setInterval(() => {
      msgIndex = (msgIndex + 1) % LOADING_MESSAGES.length;
      setLoadingStepLabel(LOADING_MESSAGES[msgIndex]);
    }, 1200);
    try {
      const res = await fetch("/api/chemistry/solve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: question.trim(), difficultyLevel }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || `HTTP error! Status: ${res.status}`);
      }
      const data: ChemistrySolution = await res.json();
      const newProblem: SavedProblem = {
        id: "solve-" + Date.now(),
        question: question.trim(),
        timestamp:
          new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) +
          ", " +
          new Date().toLocaleDateString([], { month: "short", day: "numeric" }),
        difficultyLevel,
        solution: data,
      };
      const updated = [newProblem, ...savedProblems.filter((x) => x.id !== "def-1" && x.id !== "def-2")].slice(0, 12);
      const final = [...updated];
      if (!final.some((x) => x.id === "def-2")) final.push(defaultProblems[1]);
      if (!final.some((x) => x.id === "def-1")) final.push(defaultProblems[0]);
      localStorage.setItem("andrew_academy_problems_v1", JSON.stringify(final));
      setSavedProblems(final);
      setSolution(data);
      setActiveProblemId(newProblem.id);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Unable to solve. Verify your connection or key status.");
    } finally {
      clearInterval(animInterval);
      setIsLoading(false);
    }
  };

  /* ── render ────────────────────────────────────────── */
  return (
    <div className="space-y-6 animate-fadeIn" id="page-tutor">

      {/* ── INPUT CARD ── */}
      <section id="prompt-card" className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
        <form onSubmit={handleSolveWithAI} className="space-y-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
            <div>
              <label className="text-[10px] sm:text-xs font-black text-rose-500 uppercase tracking-widest flex items-center gap-1.5">
                <Beaker className="w-4 h-4 fill-rose-500/10" />
                Enter Metallurgy Calculation / Question
              </label>
              <p className="text-[9px] sm:text-[11px] text-slate-500 font-semibold mt-0.5">
                Type mineral compositions, moisture logs, crush ratios, burden fractions, or calcination balances.
              </p>
            </div>
            <div className="w-full md:w-auto">
              <select
                value={difficultyLevel}
                onChange={(e) => setDifficultyLevel(e.target.value)}
                className="w-full md:w-auto px-3 py-1.5 bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 rounded-xl focus:ring-2 focus:ring-[#0f1157] outline-none"
                id="difficulty-level-dropdown"
              >
                <option value="ZNQF Level 4 - Core">ZNQF Level 4 Operator Core</option>
                <option value="Advanced Industrial Metallurgical Technician">Technician Level</option>
                <option value="General Mineral Processing & Smelting Base">Mineral Processing Base</option>
              </select>
            </div>
          </div>

          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Type your metallurgical query or paste raw assay values…"
            className="w-full h-24 bg-slate-50/75 border border-slate-200 rounded-xl p-3 sm:p-4 text-[11px] sm:text-xs font-medium text-slate-800 placeholder-slate-300 focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none resize-none transition-all"
            id="chemistry-prompt-input"
          />

          {/* Quick presets */}
          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] text-slate-400 font-bold uppercase">Quick Syllabus Formulas:</span>
            <div className="flex overflow-x-auto gap-1.5 pb-1 scrollbar-none -mx-5 px-5 sm:mx-0 sm:px-0">
              {[
                { id: "preset-moisture", emoji: "💧", label: "Wet-to-Dry Moisture Assay", text: "Calculate the moisture content percentage and dry weight of a 500g wet copper ore sample after oven drying at 105°C leaves a final weight of 435g." },
                { id: "preset-burden",  emoji: "⚖️", label: "Coke-to-Ore Burden Calculation", text: "What is the mass of coke required to prepare a sintering blast furnace burden with 1200 kg of mineral ore if the recommended coke ratio is 6.5%?" },
                { id: "preset-crush",   emoji: "⚙️", label: "Crusher Reduction Ratio", text: "If a jaw crusher has a raw feed gape size of 500mm and produces an average discharge of 55mm, what is its reduction ratio?" },
                { id: "preset-decomp",  emoji: "🔥", label: "Limestone Decomposition", text: "Calculate the mass of CaO flux produced from the decomposition of 250 kg of CaCO3 (CaCO3 -> CaO + CO2) under sintering temperatures." },
              ].map((p) => (
                <button
                  key={p.id}
                  type="button"
                  id={p.id}
                  onClick={() => handleQuickTemplate(p.text)}
                  className="bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer shrink-0"
                >
                  {p.emoji} {p.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pt-2 gap-3">
            <p className="text-[9px] sm:text-[10px] text-slate-400 font-semibold">
              💡 Solutions are saved automatically in your Study Journal.
            </p>
            <button
              type="submit"
              disabled={isLoading || !question.trim()}
              className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold px-5 py-2.5 rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all text-[10px] sm:text-xs uppercase tracking-wider cursor-pointer"
              id="submit-chemistry-btn"
            >
              {isLoading ? (
                <><div className="w-3.5 h-3.5 border-2 border-slate-400 border-t-white rounded-full animate-spin" /><span>Solving…</span></>
              ) : (
                <><Sparkles className="w-3.5 h-3.5 fill-white" /><span>Calculate &amp; Explain Step-by-Step</span></>
              )}
            </button>
          </div>
        </form>
      </section>

      {/* ── SOLUTION CARD ── */}
      <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col min-h-[400px]" id="solution-section">

        {/* Header bar */}
        <div className="border-b border-slate-100 px-4 sm:px-5 py-3 bg-slate-50/70 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] sm:text-xs font-black uppercase text-slate-500 tracking-wider">
              Andrew's Step-by-Step Solutions Guide
            </span>
          </div>
          {solution && (
            <div className="flex flex-wrap items-center gap-2 mt-1 sm:mt-0">
              <span className="text-[9px] bg-emerald-50 text-emerald-800 font-extrabold px-2.5 py-0.5 rounded-full border border-emerald-100 uppercase tracking-tight">
                {solution.topic || "Analysis Result"}
              </span>
              <button
                type="button"
                onClick={exportToText}
                className="text-[10px] px-3 py-1 rounded-full font-bold flex items-center gap-1.5 text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 shadow-sm cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" /> Export Notes
              </button>
              <button
                type="button"
                onClick={handleSpeakFullSolution}
                className={`text-[10px] px-3 py-1 rounded-full font-bold flex items-center gap-1.5 text-white cursor-pointer ${
                  isPlayingVoice && activeSpokenStep === 999
                    ? "bg-rose-600 animate-pulse"
                    : "bg-[#0f1157] hover:bg-[#121568]"
                }`}
              >
                {isPlayingVoice && activeSpokenStep === 999 ? "Stop 🛑" : "Voice Assist 🔊"}
              </button>
            </div>
          )}
        </div>

        {/* Body */}
        <div className="p-4 sm:p-6 flex-grow flex flex-col">

          {/* ── Loading ── */}
          {isLoading && (
            <div className="flex-grow flex flex-col items-center justify-center py-20 text-center">
              <div className="relative mb-5">
                <div className="w-16 h-16 border-4 border-emerald-500/30 border-b-emerald-600 rounded-full animate-spin" />
                <Beaker className="w-8 h-8 text-emerald-600 absolute inset-0 m-auto animate-pulse" />
              </div>
              <p className="text-base font-bold text-slate-700">Calibrating Industrial Solutions</p>
              <p className="text-xs font-black text-emerald-600 mt-2 bg-emerald-50 px-4 py-1.5 rounded-full border border-emerald-100 animate-pulse">
                {loadingStepLabel}
              </p>
              <p className="text-[11px] text-slate-400 mt-6 max-w-xs">
                💡 Andrew's processing guides compare raw compositions and mineral formulas to generate balanced, validated reports.
              </p>
            </div>
          )}

          {/* ── Error ── */}
          {!isLoading && error && (
            <div className="flex-grow flex flex-col items-center justify-center py-16 text-center px-4">
              <div className="p-3.5 bg-rose-50 text-rose-600 rounded-full border border-rose-100 mb-4 animate-bounce">
                <AlertTriangle className="w-10 h-10 stroke-[2]" />
              </div>
              <h3 className="text-base font-bold text-slate-800 mb-1">Calculation Stall Detected</h3>
              <p className="text-xs text-rose-600 font-medium max-w-md">{error}</p>
              <div className="mt-6 bg-slate-50 p-4 rounded-xl text-left border border-slate-100 text-[11px] text-slate-500 max-w-md w-full">
                <p className="font-bold text-slate-700 mb-1">To resolve this:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Ensure your environment configuration has correct secrets.</li>
                  <li>Use "Reset All Logs" in the Study Journal tab to clear stale storage.</li>
                  <li>Check prompt syntax and try again.</li>
                </ul>
              </div>
            </div>
          )}

          {/* ── Solution ── */}
          {!isLoading && !error && solution && (() => {
            const steps = solution.steps;
            const total = steps.length;
            const allDone = activeIdx >= total;

            return (
              <div className="space-y-6 flex-grow">

                {/* Topic + summary */}
                <div>
                  <h2 className="text-base font-black text-slate-800 leading-tight">{solution.topic || "Analysis Result"}</h2>
                  <p className="text-xs text-slate-500 font-medium mt-1 leading-relaxed">{solution.summary}</p>
                </div>

                {/* Segmented progress bar — exactly like screenshot */}
                <div className="space-y-1">
                  <div className="flex gap-1.5">
                    {steps.map((_, i) => (
                      <div
                        key={i}
                        className={`flex-1 h-1.5 rounded-full transition-all duration-500 ${
                          i < activeIdx ? "bg-emerald-500" : i === activeIdx ? "bg-blue-500" : "bg-slate-200"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-[11px] font-bold text-slate-400 text-right">
                    Step {Math.min(activeIdx + 1, total)} of {total}
                  </p>
                </div>

                {/* Chemical equations */}
                {solution.chemicalEquations && solution.chemicalEquations.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Chemical / Phase Equations</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {solution.chemicalEquations.map((eq, i) => (
                        <div key={i} className="bg-slate-900 text-white rounded-xl p-4 border border-slate-800">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-[9px] font-bold text-emerald-400 tracking-wider font-mono">EQ {i + 1}</span>
                            <span className={`text-[8px] font-extrabold px-1.5 py-0.5 rounded-full ${eq.balanced ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "bg-amber-500/20 text-amber-400 border border-amber-500/30"}`}>
                              {eq.balanced ? "Balanced" : "Skeleton"}
                            </span>
                          </div>
                          <div className="text-xs font-black font-mono text-emerald-50 bg-slate-950/60 rounded-lg px-2 py-2 text-center">
                            {eq.reactants} {eq.arrow} {eq.products}
                          </div>
                          {eq.notes && (
                            <p className="text-[10px] text-slate-400 font-semibold mt-2 pt-1.5 border-t border-slate-800/60 leading-relaxed">
                              💡 {eq.notes}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* ── Vertical timeline ── */}
                <div className="relative">
                  {/* Continuous connector line */}
                  <div className="absolute left-[19px] top-5 bottom-5 w-[2px] bg-slate-200 rounded-full z-0" />

                  <div className="space-y-3 relative z-10">
                    {steps.map((step, idx) => {
                      const isCompleted = idx < activeIdx;
                      const isCurrent   = idx === activeIdx;
                      const isLocked    = idx > activeIdx;

                      return (
                        <div key={step.number} className="flex gap-3 items-start">

                          {/* Step bubble */}
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-sm shrink-0 ring-4 ring-white shadow z-10 transition-all duration-300 ${
                              isCompleted
                                ? "bg-emerald-500 text-white"
                                : isCurrent
                                ? "bg-blue-600 text-white"
                                : "bg-white border-2 border-slate-300 text-slate-400"
                            }`}
                          >
                            {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : step.number}
                          </div>

                          {/* Card */}
                          <div
                            className={`flex-1 rounded-2xl border transition-all duration-300 overflow-hidden ${
                              isCompleted
                                ? "bg-white border-slate-200"
                                : isCurrent
                                ? "bg-white border-blue-400 shadow-md ring-1 ring-blue-200"
                                : "bg-slate-50 border-slate-200 opacity-60"
                            }`}
                          >
                            {/* Card header row */}
                            <div className="flex items-center justify-between px-4 pt-3 pb-1">
                              <div className="flex items-center gap-2">
                                <span
                                  className={`text-[10px] font-black uppercase tracking-wide px-2 py-0.5 rounded-full ${
                                    isCompleted
                                      ? "bg-emerald-100 text-emerald-700"
                                      : isCurrent
                                      ? "bg-blue-100 text-blue-700"
                                      : "bg-slate-200 text-slate-500"
                                  }`}
                                >
                                  Step {step.number}
                                </span>
                                <span
                                  className={`text-[9px] font-bold uppercase tracking-wide ${
                                    isCompleted ? "text-emerald-600" : isCurrent ? "text-blue-600" : "text-slate-400"
                                  }`}
                                >
                                  {isCompleted ? "Completed" : isCurrent ? "In Progress" : "Locked"}
                                </span>
                              </div>
                              {/* Speak button */}
                              <button
                                type="button"
                                onClick={() => {
                                  const txt =
                                    `Step ${step.number}: ${step.title}. ${step.explanation}. ` +
                                    (step.calculation
                                      ? `Calculation: ${step.calculation.replace(/\*/g, " times ").replace(/\//g, " divided by ")}. `
                                      : "") +
                                    `Result: ${step.result}.`;
                                  playVoiceForText(txt, step.number);
                                }}
                                className={`p-1.5 rounded-full border transition-all cursor-pointer ${
                                  isPlayingVoice && activeSpokenStep === step.number
                                    ? "bg-rose-50 border-rose-300 text-rose-500 animate-pulse"
                                    : "bg-slate-100 border-slate-200 text-slate-400 hover:bg-slate-200"
                                }`}
                              >
                                <Volume2 className="w-3 h-3" />
                              </button>
                            </div>

                            {/* Expanded body (completed + current) */}
                            {!isLocked && (
                              <div className="px-4 pb-4 space-y-3">
                                <h5 className="text-sm font-black text-slate-800 leading-snug">{step.title}</h5>
                                <p className="text-xs text-slate-600 font-medium leading-relaxed">{step.explanation}</p>

                                {/* Syllabus ref pill */}
                                {step.formula && (
                                  <span className="inline-block text-[10px] font-mono bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md font-bold">
                                    <span className="text-slate-400 font-sans mr-1">Syllabus Ref:</span>
                                    {step.formula}
                                  </span>
                                )}

                                {/* Calculation dark box */}
                                {step.calculation && (
                                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-start gap-2">
                                    <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center shrink-0 mt-0.5">
                                      <Atom className="w-3.5 h-3.5 text-blue-600" />
                                    </div>
                                    <span className="text-[11px] font-mono text-slate-700 font-bold leading-snug break-all">
                                      {step.calculation}
                                    </span>
                                  </div>
                                )}

                                {/* Result row — exactly like screenshot */}
                                <div
                                  className={`flex items-center justify-between rounded-xl px-3 py-2.5 ${
                                    isCompleted
                                      ? "bg-slate-50 border border-slate-100"
                                      : "bg-blue-50 border border-blue-100"
                                  }`}
                                >
                                  <div className="flex items-center gap-1.5">
                                    <Beaker className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">
                                      Result
                                    </span>
                                  </div>
                                  <span
                                    className={`text-lg font-black font-mono tracking-tight ${
                                      isCompleted ? "text-emerald-600" : "text-blue-700"
                                    }`}
                                  >
                                    {step.result}
                                  </span>
                                </div>

                                {/* Continue button */}
                                {isCurrent && activeIdx < total - 1 && (
                                  <button
                                    type="button"
                                    id={`continue-step-${step.number}`}
                                    onClick={() => setActiveIdx((i) => i + 1)}
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black text-xs rounded-xl py-3 flex items-center justify-center gap-2 transition-all shadow-md mt-1"
                                  >
                                    Continue to Step {step.number + 1}
                                    <ChevronRight className="w-4 h-4" />
                                  </button>
                                )}
                              </div>
                            )}

                            {/* Locked — collapsed preview */}
                            {isLocked && (
                              <div className="px-4 pb-3 flex items-center justify-between gap-2">
                                <div className="min-w-0">
                                  <p className="text-xs font-bold text-slate-600 truncate">{step.title}</p>
                                  <p className="text-[10px] text-slate-400 font-medium mt-0.5 line-clamp-1">{step.explanation}</p>
                                </div>
                                <ChevronDown className="w-4 h-4 text-slate-300 shrink-0" />
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* ── Final answer + tip (only when all steps walked through) ── */}
                {allDone && (
                  <>
                    {/* Pro tip */}
                    <div className="bg-amber-50 rounded-2xl border border-amber-100 p-4">
                      <div className="flex gap-2.5 items-start">
                        <Lightbulb className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                        <div>
                          <h4 className="text-xs font-bold text-amber-800 uppercase tracking-widest">Andrew's Pro Metallurgy Tip</h4>
                          <p className="text-xs text-slate-700 font-medium leading-relaxed mt-1">{solution.conceptualTakeaway}</p>
                        </div>
                      </div>
                    </div>

                    {/* Final answer banner */}
                    <div className="p-4 bg-slate-900 text-white rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-md">
                      <div>
                        <p className="text-[9px] text-slate-400 font-mono tracking-widest uppercase">Ultimate Calibrated Value:</p>
                        <p className="text-sm sm:text-base font-black text-emerald-400 mt-1 font-mono select-all">
                          {solution.finalAnswer}
                        </p>
                      </div>
                      <div className="flex items-center gap-1.5 bg-slate-800 text-[10px] px-3 py-1.5 rounded-lg border border-slate-700 text-slate-300 font-bold">
                        <Flag className="w-3.5 h-3.5 text-emerald-400" /> SOP Validated
                      </div>
                    </div>

                    {/* Practice quiz */}
                    {solution.practiceQuestions && solution.practiceQuestions.length > 0 && (
                      <div className="pt-4 border-t border-slate-100 space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Award className="w-5 h-5 text-emerald-600 animate-pulse" />
                            <h4 className="text-sm font-black uppercase tracking-tight text-slate-800">Interactive Material Quiz</h4>
                          </div>
                          <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-100 font-black px-2 py-0.5 rounded-full uppercase">
                            Practice Verification Roll
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 font-medium">
                          Verify your understanding with these topic questions:
                        </p>
                        <div className="space-y-4">
                          {solution.practiceQuestions.map((quiz, qIdx) => {
                            const key = `q-${qIdx}`;
                            const chosen = selectedPracticeAnswers[key];
                            const answered = chosen !== undefined;
                            return (
                              <div
                                key={qIdx}
                                className={`p-4 rounded-2xl border transition-all ${
                                  answered
                                    ? chosen === quiz.correctOptionIndex
                                      ? "bg-emerald-50/40 border-emerald-200"
                                      : "bg-rose-50/40 border-rose-200"
                                    : "bg-slate-50 border-slate-200"
                                }`}
                              >
                                <p className="text-xs font-extrabold text-slate-800 leading-relaxed mb-3">
                                  <span className="bg-slate-200 text-slate-800 text-[10px] font-black px-2 py-0.5 rounded-md mr-1.5 font-mono">
                                    Q{qIdx + 1}
                                  </span>
                                  {quiz.questionText}
                                </p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                  {quiz.options.map((opt, oIdx) => {
                                    const sel = chosen === oIdx;
                                    const correct = oIdx === quiz.correctOptionIndex;
                                    let cls = "bg-white border-slate-200 text-slate-700 hover:bg-slate-50 cursor-pointer";
                                    if (answered) {
                                      if (correct) cls = "bg-emerald-500 border-emerald-600 text-white font-extrabold";
                                      else if (sel) cls = "bg-rose-500 border-rose-600 text-white font-extrabold";
                                      else cls = "bg-white border-slate-200 text-slate-400 opacity-60";
                                    }
                                    return (
                                      <button
                                        key={oIdx}
                                        disabled={answered}
                                        onClick={() =>
                                          setSelectedPracticeAnswers((prev) => ({ ...prev, [key]: oIdx }))
                                        }
                                        className={`px-3 py-2 text-xs text-left rounded-xl border transition-all ${cls} flex items-center justify-between`}
                                      >
                                        <span>{opt}</span>
                                        {answered && correct && <CheckCircle2 className="w-4 h-4 text-emerald-100 shrink-0" />}
                                        {answered && sel && !correct && <XCircle className="w-4 h-4 text-rose-100 shrink-0" />}
                                      </button>
                                    );
                                  })}
                                </div>
                                {answered && (
                                  <div
                                    className={`mt-3 p-3 rounded-xl text-xs font-semibold flex items-start gap-2 ${
                                      chosen === quiz.correctOptionIndex
                                        ? "bg-emerald-100/40 text-emerald-950 border border-emerald-200"
                                        : "bg-rose-50 text-rose-950 border border-rose-200"
                                    }`}
                                  >
                                    <Info className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                                    <div>
                                      <p className="font-extrabold">
                                        {chosen === quiz.correctOptionIndex
                                          ? "Correct Operational Assessment!"
                                          : "Incorrect Operational Assessment!"}
                                      </p>
                                      <p className="text-[11px] text-slate-600 font-medium leading-relaxed mt-1">
                                        {quiz.explanation}
                                      </p>
                                    </div>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            );
          })()}

          {/* ── Empty state ── */}
          {!isLoading && !error && !solution && (
            <div className="flex-grow flex flex-col items-center justify-center py-20 text-center animate-fadeIn">
              <BookOpen className="w-12 h-12 text-slate-300 mb-3" />
              <h3 className="text-sm font-bold text-slate-800">Ready for Calculations</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-sm">
                Enter your metallurgical query or select a quick formula preset to begin!
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 border-t border-slate-100 px-4 py-3 shrink-0 text-[10px] text-slate-500 flex justify-between items-center">
          <span className="font-bold uppercase tracking-tight">ANDREW ACADEMY VIRTUAL METALLURGICAL STATION</span>
          <span className="font-medium">Active Calculations: Dry Mass &amp; Agglomeration Modeling</span>
        </div>
      </section>
    </div>
  );
}
