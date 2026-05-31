import { useState, FormEvent } from "react";
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
  VolumeX
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
  setSelectedPracticeAnswers: (val: Record<string, number> | ((prev: Record<string, number>) => Record<string, number>)) => void;
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
  defaultProblems
}: AISolverLabProps) {
  const [loadingStepLabel, setLoadingStepLabel] = useState("");
  const [isPlayingVoice, setIsPlayingVoice] = useState(false);
  const [activeSpokenStep, setActiveSpokenStep] = useState<number | null>(null);

  const stopActiveSpeech = () => {
    window.speechSynthesis.cancel();
    setIsPlayingVoice(false);
    setActiveSpokenStep(null);
  };

  const playVoiceForText = (text: string, currentStep: number) => {
    window.speechSynthesis.cancel();

    // If already playing this identical step, just stop!
    if (isPlayingVoice && activeSpokenStep === currentStep) {
      setIsPlayingVoice(false);
      setActiveSpokenStep(null);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);

    // Dynamic browser lookup for ZA/ZW southern African accents, fallback to UK, general English
    const voices = window.speechSynthesis.getVoices();
    const targetedVoice = voices.find(v => v.lang.toLowerCase().startsWith("en-za") || v.lang.toLowerCase().startsWith("en-zw"))
      || voices.find(v => v.lang.toLowerCase().startsWith("en-gb"))
      || voices.find(v => v.lang.toLowerCase().startsWith("en"))
      || null;

    if (targetedVoice) {
      utterance.voice = targetedVoice;
    }

    // Zimbabwean style clear academic speed (slightly slower (~0.84) and clear articulation)
    utterance.rate = 0.84;
    utterance.pitch = 0.99;

    utterance.onstart = () => {
      setIsPlayingVoice(true);
      setActiveSpokenStep(currentStep);
    };

    utterance.onend = () => {
      setIsPlayingVoice(false);
      setActiveSpokenStep(null);
    };

    utterance.onerror = () => {
      setIsPlayingVoice(false);
      setActiveSpokenStep(null);
    };

    window.speechSynthesis.speak(utterance);
  };

  const handleSpeakFullSolution = () => {
    if (!solution) return;

    if (isPlayingVoice) {
      stopActiveSpeech();
      return;
    }

    // High quality zimbabwean school academic voice style introductory greeting
    let greeting = `Salibonani! Respectful greetings from Andrew Academy. Let us review the metallurgical steps together for the topic: ${solution.topic || "Analysis Result"}. Please check your screen as I run through. `;
    greeting += `First, the Abstract Summary. ${solution.summary}. `;
    
    if (solution.chemicalEquations && solution.chemicalEquations.length > 0) {
      greeting += `We have verified phases and equations. `;
      solution.chemicalEquations.forEach((eq, idx) => {
        greeting += `Equation number ${idx + 1}: ${eq.reactants} decomposes or reacts with ${eq.products}. `;
        if (eq.notes) {
          greeting += `Operator parameters state: ${eq.notes}. `;
        }
      });
    }

    greeting += `Now, let us audit each calculation step-by-step. `;
    solution.steps.forEach(step => {
      greeting += `Step ${step.number}: ${step.title}. ${step.explanation}. `;
      if (step.calculation) {
        greeting += `We compute this as: ${step.calculation.replace(/\*/g, " times ").replace(/\//g, " divided by ") || ""}. `;
      }
      greeting += `Giving a calculated value of: ${step.result}. `;
    });

    greeting += `In general, Andrew says: ${solution.conceptualTakeaway}. `;
    greeting += `The final operational answer is ${solution.finalAnswer}. `;
    greeting += `Review of steps completed efficiently with standard procedures. Stand by for next calculations!`;

    playVoiceForText(greeting, 999); // 999 is code for full audit read
  };

  const LOADING_MESSAGES = [
    "Andrew is scanning feed material assays...",
    "Retrieving minerals and crystalline structure stats...",
    "Computing dry matrix mass balances...",
    "Calculating sintering temperatures stoichiometries...",
    "Checking machine calibration tolerances..."
  ];

  const handleSolveWithAI = async (e: FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;

    setIsLoading(true);
    setError(null);
    setSelectedPracticeAnswers({}); // Reset previous MCQ answers

    // Cycle through loading cues
    let msgIndex = 0;
    setLoadingStepLabel(LOADING_MESSAGES[0]);
    const animInterval = setInterval(() => {
      msgIndex = (msgIndex + 1) % LOADING_MESSAGES.length;
      setLoadingStepLabel(LOADING_MESSAGES[msgIndex]);
    }, 1200);

    try {
      const response = await fetch("/api/chemistry/solve", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: question.trim(),
          difficultyLevel,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! Status: ${response.status}`);
      }

      const resultData: ChemistrySolution = await response.json();
      
      const newProblem: SavedProblem = {
        id: "solve-" + Date.now(),
        question: question.trim(),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ", " + new Date().toLocaleDateString([], { month: 'short', day: 'numeric' }),
        difficultyLevel,
        solution: resultData
      };

      const updatedHistory = [newProblem, ...savedProblems.filter(x => x.id !== "def-1" && x.id !== "def-2")];
      const trimmedHistory = updatedHistory.slice(0, 12);
      
      const finalHistory = [...trimmedHistory];
      const hasDef1 = finalHistory.some(x => x.id === "def-1");
      const hasDef2 = finalHistory.some(x => x.id === "def-2");
      if (!hasDef2) finalHistory.push(defaultProblems[1]);
      if (!hasDef1) finalHistory.push(defaultProblems[0]);

      localStorage.setItem("andrew_academy_problems_v1", JSON.stringify(finalHistory));
      setSavedProblems(finalHistory);
      setSolution(resultData);
      setActiveProblemId(newProblem.id);

    } catch (err: any) {
      console.error(err);
      setError(err.message || "Unable to solve. Verify your connection or key status.");
    } finally {
      clearInterval(animInterval);
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn" id="page-tutor">
      {/* Input Workspace */}
      <section id="prompt-card" className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs relative overflow-hidden">
        <form onSubmit={handleSolveWithAI} className="space-y-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
            <div>
              <label className="text-[10px] sm:text-xs font-black text-rose-500 uppercase tracking-widest flex items-center gap-1.5 justify-start">
                <Beaker className="w-4 h-4 text-rose-500 fill-rose-500/10" />
                <span>Enter Metallurgy Calculation / Question</span>
              </label>
              <p className="text-[9px] sm:text-[11px] text-slate-500 font-semibold text-left">Type mineral compositions, wet moisture logs, crush ratios, burden fractions, or calcination balances.</p>
            </div>
            
            {/* ZNQF Level Selector */}
            <div className="w-full md:w-auto">
              <select
                value={difficultyLevel}
                onChange={(e) => setDifficultyLevel(e.target.value)}
                className="w-full md:w-auto px-3 py-1.5 bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 rounded-xl shadow-xs focus:ring-2 focus:ring-[#0f1157] outline-none"
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
            placeholder="Type your metallurgical query or paste raw assay values (e.g., screen fractions, moisture weights, CaCO3 flux decomposition)..."
            className="w-full h-24 bg-slate-50/75 border border-slate-200 rounded-xl p-3 sm:p-4 text-[11px] sm:text-xs font-bold text-slate-800 placeholder-slate-300 focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none resize-none transition-all duration-200 font-medium"
            id="chemistry-prompt-input"
          />

          {/* Quick Examples Launcher */}
          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] text-slate-400 font-bold uppercase text-left">Quick Syllabus Formulas:</span>
            <div className="flex overflow-x-auto gap-1.5 pb-2 scrollbar-none shrink-0 -mx-5 px-5 sm:mx-0 sm:px-0">
              <button
                type="button"
                onClick={() => handleQuickTemplate("Calculate the moisture content percentage and dry weight of a 500g wet copper ore sample after oven drying at 105°C leaves a final weight of 435g.")}
                className="bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer shrink-0"
                id="preset-moisture"
              >
                💧 Wet-to-Dry Moisture Assay
              </button>
              <button
                type="button"
                onClick={() => handleQuickTemplate("What is the mass of coke required to prepare a sintering blast furnace burden with 1200 kg of mineral ore coordinate if the recommended coke ratio is 6.5%?")}
                className="bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer shrink-0"
                id="preset-burden"
              >
                ⚖️ Coke-to-Ore Burden Calculation
              </button>
              <button
                type="button"
                onClick={() => handleQuickTemplate("If a jaw crusher has a raw feed gape size of 500mm and produces an average discharge particles discharge of 55mm, what is its reduction ratio?")}
                className="bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer shrink-0"
                id="preset-crush"
              >
                ⚙️ Crusher Reduction Ratio
              </button>
              <button
                type="button"
                onClick={() => handleQuickTemplate("Calculate the mass of calcium oxide (CaO) flux produced from the decomposition of 250 kg of limestone calcium carbonate flux (CaCO3 -> CaO + CO2) under sintering temperatures.")}
                className="bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer shrink-0"
                id="preset-decomposition"
              >
                🔥 Limestone Decomposition Stoichiometry
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pt-2 gap-3">
            <div className="text-[9px] sm:text-[10px] text-slate-400 font-semibold tracking-wide text-left">
              💡 Solutions are saved automatically in your Active Study Journal logs.
            </div>
            <button
              type="submit"
              disabled={isLoading || !question.trim()}
              className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-200 disabled:text-slate-450 text-white font-bold px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl flex items-center justify-center gap-2 shadow-xs transition-all shrink-0 cursor-pointer text-[10px] sm:text-xs uppercase tracking-wider"
              id="submit-chemistry-btn"
            >
              {isLoading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-slate-600 border-t-white rounded-full animate-spin"></div>
                  <span>Solving...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 fill-white" />
                  <span>Calculate & Explain Step-by-Step</span>
                </>
              )}
            </button>
          </div>
        </form>
      </section>

      {/* Steps & Solution Guide (No AI titles) */}
      <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col min-h-[400px]" id="solution-section">
        {/* Solved Card Header */}
        <div className="border-b border-slate-100 p-4 sm:p-5 bg-slate-50/70 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0"></div>
            <span className="text-[10px] sm:text-xs font-black uppercase text-slate-500 leading-tight tracking-wider truncate sm:whitespace-normal">
              Andrew's Step-by-Step Operations Solutions Guide
            </span>
          </div>
          {solution && (
            <div className="flex flex-wrap items-center gap-2 mt-2 sm:mt-0">
              <span className="text-[9px] sm:text-xs bg-emerald-50 text-emerald-800 font-extrabold px-2.5 py-0.5 rounded-full border border-emerald-100 uppercase tracking-tight shrink-0">
                Syllabus: {solution.topic || "Analysis Result"}
              </span>
              <button
                type="button"
                onClick={handleSpeakFullSolution}
                className={`text-[10px] sm:text-xs px-3 py-1 rounded-full font-bold flex items-center gap-1.5 transition-all text-white select-none shrink-0 ${
                  isPlayingVoice && activeSpokenStep === 999
                    ? "bg-rose-600 hover:bg-rose-700 animate-pulse"
                    : "bg-[#0f1157] hover:bg-[#121568]"
                }`}
              >
                <span>{isPlayingVoice && activeSpokenStep === 999 ? "Stop Speech 🛑" : "Voice Assist 🔊"}</span>
              </button>
            </div>
          )}
        </div>

        {/* Main scrollable workspace screen */}
        <div className="p-6 flex-grow flex flex-col justify-between">
          {isLoading ? (
            /* Elegant Loader */
            <div className="flex-grow flex flex-col items-center justify-center py-20 text-center">
              <div className="relative mb-5">
                <div className="w-16 h-16 border-4 border-emerald-500/30 border-b-emerald-600 rounded-full animate-spin"></div>
                <Beaker className="w-8 h-8 text-emerald-600 absolute inset-0 m-auto animate-pulse" />
              </div>
              <p className="text-base font-bold text-slate-700 tracking-tight" id="loading-state-title">Calibrating Industrial Solutions</p>
              <p className="text-xs font-black text-emerald-600 mt-2 bg-emerald-50 px-3.5 py-1.5 rounded-full border border-emerald-100 animate-pulse">
                {loadingStepLabel}
              </p>
              
              <div className="mt-8 max-w-xs space-y-1.5 text-[11px] text-slate-400">
                <p>💡 Andrew's processing guides compare raw compositions and mineral formulas to generate balanced, validated reports.</p>
              </div>
            </div>
          ) : error ? (
            <div className="flex-grow flex flex-col items-center justify-center py-16 text-center px-4">
              <div className="p-3.5 bg-rose-50 text-rose-600 rounded-full border border-rose-100 mb-4 animate-bounce">
                <AlertTriangle className="w-10 h-10 stroke-[2]" />
              </div>
              <h3 className="text-base font-bold text-slate-800 mb-1">Calculation Stall Detected</h3>
              <p className="text-xs text-rose-600 font-medium max-w-md">{error}</p>
              
              <div className="mt-6 bg-slate-50 p-4 rounded-xl text-left border border-slate-100 text-[11px] text-slate-500 max-w-md w-full">
                <p className="font-bold text-slate-700 mb-1">To resolve this:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Ensure your application environment configuration has correct secrets.</li>
                  <li>Use the "Reset All Logs" option in the Study Journal tab to clear stale storage.</li>
                  <li>Check prompt metallurgical syntax and try again.</li>
                </ul>
              </div>
            </div>
          ) : solution ? (
            <div className="space-y-6 flex-grow">
              
              {/* Summary Abstract */}
              <div className="bg-emerald-50/40 rounded-2xl border border-emerald-100 p-4 text-left">
                <div className="flex gap-2.5 items-start">
                  <Info className="w-4.5 h-4.5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-black text-emerald-800 uppercase tracking-wider">Concept Abstract</h4>
                    <p className="text-xs text-slate-700 font-medium leading-relaxed mt-1">
                      {solution.summary}
                    </p>
                  </div>
                </div>
              </div>

              {/* Chemical Reaction / Mineral Equations if any */}
              {solution.chemicalEquations && solution.chemicalEquations.length > 0 && (
                <div className="space-y-2 text-left">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Chemical / Phase Equations Verified</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {solution.chemicalEquations.map((eq, index) => (
                      <div key={index} className="bg-slate-900 text-white rounded-xl p-4 border border-slate-800 flex flex-col justify-between">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-[9px] font-bold text-emerald-400 tracking-wider font-mono">EQUATION {index + 1}</span>
                          <span className={`text-[8px] font-extrabold px-1.5 py-0.5 rounded-full ${
                            eq.balanced ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                          }`}>
                            {eq.balanced ? "Fully Balanced" : "Skeleton Model"}
                          </span>
                        </div>
                        
                        <div className="text-xs font-black tracking-wider font-mono px-1 py-2 text-center text-emerald-50 bg-slate-950/60 rounded-lg">
                          {eq.reactants} {eq.arrow} {eq.products}
                        </div>

                        {eq.notes && (
                          <p className="text-[10px] text-slate-400 font-semibold mt-2 border-t border-slate-800/60 pt-1.5 leading-relaxed">
                            💡 {eq.notes}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Calculated Steps */}
              <div className="space-y-4 text-left">
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Calculated Steps Summary</h4>
                
                <div className="relative pl-3 border-l-2 border-emerald-100 ml-4 space-y-6">
                  {solution.steps.map((step) => (
                    <div key={step.number} className="relative z-10 flex gap-4 items-start p-4 bg-white hover:bg-slate-50 border border-slate-200/80 rounded-2xl transition-all -ml-[25px]">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#0f1157] text-white flex items-center justify-center font-black text-sm shadow-md ring-4 ring-white">
                        {step.number}
                      </div>
                      <div className="space-y-2 flex-grow min-w-0">
                        <div className="flex justify-between items-center gap-2">
                          <h5 className="text-xs font-black text-slate-800 uppercase tracking-wide">
                            {step.title}
                          </h5>
                          <button
                            type="button"
                            onClick={() => {
                              const textToSpeak = `Step ${step.number}: ${step.title}. ${step.explanation}. ` + (step.calculation ? `Operational calculation: ${step.calculation.replace(/\*/g, " times ").replace(/\//g, " divided by ")}, ` : '') + `resulting in a value of ${step.result}`;
                              playVoiceForText(textToSpeak, step.number);
                            }}
                            className={`p-1 rounded-full border transition-all shrink-0 ${
                              isPlayingVoice && activeSpokenStep === step.number
                                ? "bg-rose-50 border-rose-300 text-rose-600 animate-pulse"
                                : "bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-500 hover:text-slate-800"
                            }`}
                            title="Speak step"
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        
                        <p className="text-xs text-slate-600 font-medium leading-relaxed">
                          {step.explanation}
                        </p>

                        {/* Formula */}
                        {step.formula && (
                          <div className="text-[10px] font-mono bg-slate-100 text-slate-800 px-2.5 py-1 rounded-md inline-block max-w-full font-bold">
                            <span className="font-bold text-slate-500 mr-1 font-sans">Syllabus Ref:</span>
                            {step.formula}
                          </div>
                        )}

                        {/* Calculations */}
                        {step.calculation && (
                          <div className="text-[11px] font-mono bg-slate-50 border border-slate-200 p-2.5 rounded-xl flex items-center gap-2 overflow-x-auto select-all" title="Mathematical workspace">
                            <span className="text-[9px] text-[#0f1157] bg-indigo-50 border border-indigo-100 px-1 py-0.5 rounded font-black font-sans uppercase shrink-0">Compute:</span>
                            <span className="text-slate-700 font-bold whitespace-nowrap">{step.calculation}</span>
                          </div>
                        )}

                        {/* Result banner */}
                        <div className="text-xs font-bold text-emerald-850 text-emerald-800 bg-emerald-50/40 border-l-2 border-emerald-500 pl-2.5 py-1.5 flex items-center gap-1.5 rounded-r-lg">
                          <span className="uppercase text-[9px] tracking-wider text-slate-400 font-bold">Value:</span>
                          <span className="font-black">{step.result}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Conceptual takeaway tip */}
              <div className="bg-amber-50/40 hover:bg-amber-50 rounded-2xl border border-amber-100 p-4 text-left transition duration-200">
                <div className="flex gap-2.5 items-start">
                  <Lightbulb className="w-5 h-5 text-amber-500 stroke-[2] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-amber-800 uppercase tracking-widest">
                      <span>Andrew's Pro Metallurgy Tip</span>
                    </h4>
                    <p className="text-xs text-slate-700 font-medium leading-relaxed mt-1">
                      {solution.conceptualTakeaway}
                    </p>
                  </div>
                </div>
              </div>

              {/* Final Answer Banner */}
              <div className="p-4 bg-slate-900 border border-slate-900 text-white rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between text-left gap-3 shadow-md">
                <div>
                  <p className="text-[9px] text-slate-400 font-mono tracking-widest font-black uppercase">ULTIMATE CALIBRATED VALUE:</p>
                  <p className="text-sm sm:text-base font-black tracking-tight text-emerald-400 mt-1 font-mono select-all">
                    {solution.finalAnswer}
                  </p>
                </div>
                <div className="bg-slate-800 text-[10px] px-3 py-1.5 rounded-lg border border-slate-700 text-slate-300 font-bold">
                  SOP Validated
                </div>
              </div>

              {/* Practice questions on topic */}
              {solution.practiceQuestions && solution.practiceQuestions.length > 0 && (
                <div className="pt-4 border-t border-slate-100 text-left space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Award className="w-5 h-5 text-emerald-600 animate-pulse" />
                      <h4 className="text-sm font-black text-slate-850 uppercase tracking-tight">Interactive Material Quiz</h4>
                    </div>
                    <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-100 font-black px-2 py-0.5 rounded-full uppercase">
                      Practice Verification Roll
                    </span>
                  </div>
                  
                  <p className="text-xs text-slate-550 text-slate-500 font-medium">Verify your understanding on this exact machine operation topic with these prompt questions:</p>

                  <div className="space-y-4">
                    {solution.practiceQuestions.map((quiz, qIdx) => {
                      const uniqueKey = `q-${qIdx}`;
                      const userChosenIdx = selectedPracticeAnswers[uniqueKey];
                      const hasAnswered = userChosenIdx !== undefined;

                      return (
                        <div key={qIdx} className={`p-4 rounded-2xl border transition-all ${
                          hasAnswered 
                            ? (userChosenIdx === quiz.correctOptionIndex 
                                ? "bg-emerald-50/40 border-emerald-250" 
                                : "bg-rose-50/40 border-rose-200") 
                            : "bg-slate-50/55 border-slate-150"
                        }`}>
                          <p className="text-xs font-extrabold text-slate-800 leading-relaxed mb-3">
                            <span className="bg-slate-200 text-slate-800 text-[10px] font-black px-2 py-0.5 rounded-md mr-1.5 font-mono">Q{qIdx + 1}</span>
                            {quiz.questionText}
                          </p>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {quiz.options.map((opt, oIdx) => {
                              const isSelected = userChosenIdx === oIdx;
                              const isCorrect = oIdx === quiz.correctOptionIndex;
                              let btnStyle = "bg-white border-slate-200 text-slate-700 hover:bg-slate-50 cursor-pointer";

                              if (hasAnswered) {
                                if (isCorrect) {
                                  btnStyle = "bg-emerald-500 border-emerald-600 text-white font-extrabold";
                                } else if (isSelected) {
                                  btnStyle = "bg-rose-500 border-rose-600 text-white font-extrabold pb-1";
                                } else {
                                  btnStyle = "bg-white border-slate-200 text-slate-400 opacity-60";
                                }
                              }

                              return (
                                <button
                                  key={oIdx}
                                  disabled={hasAnswered}
                                  onClick={() => {
                                    setSelectedPracticeAnswers(prev => ({
                                      ...prev,
                                      [uniqueKey]: oIdx
                                    }));
                                  }}
                                  className={`px-3 py-2 text-xs text-left rounded-xl border transition-all ${btnStyle} flex items-center justify-between`}
                                >
                                  <span>{opt}</span>
                                  {hasAnswered && isCorrect && <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-100" />}
                                  {hasAnswered && isSelected && !isCorrect && <XCircle className="w-4 h-4 shrink-0 text-rose-100" />}
                                </button>
                              );
                            })}
                          </div>

                          {hasAnswered && (
                            <div className={`mt-3 p-3 rounded-xl text-xs font-semibold flex items-start gap-2 ${
                              userChosenIdx === quiz.correctOptionIndex
                                ? "bg-emerald-100/40 text-emerald-950 border border-emerald-250"
                                : "bg-rose-50 text-rose-950 border border-rose-150"
                            }`}>
                              <Info className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                              <div>
                                <p className="font-extrabold">
                                  {userChosenIdx === quiz.correctOptionIndex ? "Correct Operational Assessment!" : "Incorrect Operational Assessment!"}
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

            </div>
          ) : (
            <div className="flex-grow flex flex-col items-center justify-center py-20 text-center px-4 animate-fadeIn">
              <BookOpen className="w-12 h-12 text-slate-300 mb-3" />
              <h3 className="text-sm font-bold text-slate-800">Ready for Calculations</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-sm">
                Enter your metallurgical query in the input panel or select a quick formula preset to start checking compositions step-by-step!
              </p>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="bg-slate-50 border-t border-slate-100 p-4 shrink-0 text-[10px] text-slate-500 flex justify-between items-center bg-slate-100/40">
          <span className="font-bold tracking-tight text-slate-500 uppercase">ANDREW ACADEMY VIRTUAL METALLURGICAL STATION</span>
          <span className="font-medium text-slate-450">Active Calculations: Dry Mass & Agglomeration Modeling</span>
        </div>
      </section>
    </div>
  );
}
