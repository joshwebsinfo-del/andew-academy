import { useState } from "react";
import { 
  Sparkles, 
  Map, 
  BookOpen, 
  Flame, 
  Atom, 
  Award, 
  Camera, 
  CheckCircle, 
  FileText,
  HelpCircle,
  Play,
  ChevronRight
} from "lucide-react";

interface HomeDeskProps {
  onNavigate: (tab: "home" | "solver" | "table" | "quizzes") => void;
  onSetQuestion: (text: string) => void;
}

export default function HomeDesk({ onNavigate, onSetQuestion }: HomeDeskProps) {
  const [showRoadmap, setShowRoadmap] = useState(false);

  // ZNQF Level 4 metallurgy syllabus learning pathways
  const metallurgyRoadmapSteps = [
    { number: "01", name: "Crystalline & Atomic Structure of Metals", hours: "15 hrs", state: "Completed" },
    { number: "02", name: "LO1: Raw Material Ores (REEs, Base, PGMs)", hours: "25 hrs", state: "Completed" },
    { number: "03", name: "LO1: Sampling Protocols & Moisture Sieve Analyser", hours: "35 hrs", state: "Completed" },
    { number: "04", name: "LO2: Burden Calculations & Sinter Charge Balance", hours: "45 hrs", state: "In Progress" },
    { number: "05", name: "LO2: Crushing, Milling & Pelletizing Operations", hours: "60 hrs", state: "Locked" },
    { number: "06", name: "LO3: Mineral Machinery Calibration & SHEQ", hours: "60 hrs", state: "Locked" },
  ];

  const handleQuickSolve = (eq: string) => {
    onSetQuestion(eq);
    onNavigate("solver");
  };

  return (
    <div className="space-y-6 text-left animate-fadeIn max-w-4xl mx-auto" id="home-dashboard">
      


      {/* 2. Sinter & Charge Calculation Banner (No AI text) */}
      <section 
        onClick={() => onNavigate("solver")}
        className="bg-gradient-to-r from-[#17195f] to-[#0f114a] text-white rounded-3xl p-6 md:p-8 border border-slate-900 shadow-lg cursor-pointer hover:shadow-xl active:scale-[0.99] duration-200 relative overflow-hidden text-left"
        id="home-quantum-engine-banner"
      >
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Sparkles className="w-36 h-36" />
        </div>

        <div className="relative space-y-3 max-w-xl">
          <div className="flex items-center gap-1.5 text-emerald-400">
            <Flame className="w-5 h-5 text-emerald-400 animate-pulse fill-emerald-400/10" />
            <span className="text-[10px] font-black uppercase tracking-widest font-mono">
              LAB ASSAY & CONCENTRATE CALCULATION CORE
            </span>
          </div>

          <h3 className="text-2xl font-black tracking-tight text-white leading-tight">
            Metallurgical Lab Desk
          </h3>

          <p className="text-xs text-slate-300 font-medium leading-relaxed">
            Verify ores composition, calculate wet-to-dry charge moisture, evaluate sintering burden mixes, or document crushing ratios step-by-step.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 bg-white/10 hover:bg-white/15 px-3 py-1.5 rounded-full text-[10px] font-bold text-emerald-300 border border-white/5 transition-colors">
              <Camera className="w-3.5 h-3.5" />
              <span>Validate Lab Samples</span>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">Simulate wet chemical assays and screen grading</span>
          </div>
        </div>
      </section>

      {/* 3. Helper quick access tiles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Table/Periodic/Densities lookup helper info */}
        <div 
          onClick={() => onNavigate("table")}
          className="bg-white border border-[#e2e8f0] hover:border-[#0f1157] rounded-3xl p-6 shadow-2xs transition-all cursor-pointer flex justify-between items-center"
        >
          <div className="space-y-2">
            <div className="p-2.5 bg-emerald-50 text-emerald-700 rounded-2xl w-fit">
              <Atom className="w-5 h-5" />
            </div>
            <h4 className="text-xs font-black text-[#0f1157] uppercase tracking-widest">
              Periodic Table & Densities
            </h4>
            <p className="text-[11px] text-slate-500 leading-relaxed max-w-xs">
              Check physical properties of base metals, PGMs, lanthanides, and compute precise mineral molecular weights instantly.
            </p>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-400 shrink-0 ml-2" />
        </div>

        {/* Quizzes helper info */}
        <div 
          onClick={() => onNavigate("quizzes")}
          className="bg-white border border-[#e2e8f0] hover:border-[#0f1157] rounded-3xl p-6 shadow-2xs transition-all cursor-pointer flex justify-between items-center"
        >
          <div className="space-y-2">
            <div className="p-2.5 bg-indigo-50 text-indigo-700 rounded-2xl w-fit">
              <Award className="w-5 h-5" />
            </div>
            <h4 className="text-xs font-black text-[#0f1157] uppercase tracking-widest">
              Syllabus Assessment Suite
            </h4>
            <p className="text-[11px] text-slate-500 leading-relaxed max-w-xs">
              Take the interactive written assessments for LO1 (Processing), LO2 (Burden Preparation), and LO3 (Machine Setup).
            </p>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-400 shrink-0 ml-2" />
        </div>
      </div>

      {/* Roadmap Overlay Modal Drawer */}
      {showRoadmap && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-3xl border border-slate-200 w-full max-w-lg p-6 overflow-hidden relative shadow-2xl animate-scaleUp text-left">
            <div className="flex justify-between items-start mb-4 border-b border-slate-100 pb-3">
              <div>
                <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest font-mono">Syllabus Path</span>
                <h3 className="text-base font-black text-slate-800">Machine Operations 1 (ZNQF Level 4)</h3>
              </div>
              <button 
                onClick={() => setShowRoadmap(false)}
                className="text-xs font-black text-slate-400 hover:text-slate-800 bg-slate-100 p-1.5 px-3 rounded-full cursor-pointer transition-all active:scale-95"
              >
                Close
              </button>
            </div>

            <p className="text-xs text-slate-500 mb-4 leading-relaxed">
              Academic plan, credits weightings, and milestones for Andrew Academy's Industrial Metallurgy students:
            </p>

            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {metallurgyRoadmapSteps.map((step) => (
                <div 
                  key={step.number}
                  className="p-3 bg-slate-50 border border-slate-200/50 rounded-xl flex justify-between items-center text-xs"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-black text-slate-400">{step.number}</span>
                    <span className="font-bold text-slate-700">{step.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-500 font-mono">{step.hours}</span>
                    <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full ${
                      step.state === "Completed" 
                        ? "bg-emerald-50 text-emerald-800 border border-emerald-100" 
                        : step.state === "In Progress"
                          ? "bg-indigo-50 text-indigo-800 border border-indigo-100 animate-pulse"
                          : "bg-slate-100 text-slate-400"
                    }`}>
                      {step.state}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex justify-between items-center text-[10px] text-slate-400">
              <span className="font-mono font-bold">Total duration: 240 hrs • 24 Credits</span>
              <span className="text-indigo-600 font-black">Andrew Academy Metallurgy</span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
