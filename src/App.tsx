import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Sparkles, 
  BookOpen, 
  Award, 
  Flame, 
  RotateCcw, 
  Trash2, 
  Calculator, 
  Atom, 
  FileText,
  Home,
  Search,
  HelpCircle,
  X,
  Menu,
  LogOut,
  Shield
} from "lucide-react";
import { ChemistrySolution, SavedProblem } from "./types";
import AISolverLab from "./components/AISolverLab";
import PeriodicDesk from "./components/PeriodicDesk";
import MolarMassDesk from "./components/MolarMassDesk";
import HomeDesk from "./components/HomeDesk";
import QuizzesDesk from "./components/QuizzesDesk";
import AboutDesk from "./components/AboutDesk";
import PrivacyPolicyDesk from "./components/PrivacyPolicyDesk";
import LocalAuth from "./components/LocalAuth";
import AdminDesk from "./components/AdminDesk";
import PWAInstallPrompt from "./components/PWAInstallPrompt";

// Static Default metallurgy problems to populate on first load or fallback
const DEFAULT_PROBLEMS: SavedProblem[] = [
  {
    id: "def-1",
    question: "Calculate the moisture content percentage and dry weight of a 500g wet copper ore sample after oven drying at 105°C leaves a final weight of 435g.",
    timestamp: "Pre-loaded Example",
    difficultyLevel: "ZNQF Level 4 - Core",
    solution: {
      topic: "LO1: Process raw materials - Moisture Analysis",
      summary: "Moisture content is an essential physical property in ore raw materials classification under LO1. Excess water affects bulk transport density, sintering rates, and causes fuel losses during heat extraction.",
      steps: [
        {
          number: 1,
          title: "Identify Wet Mass and Dry Mass",
          explanation: "In metallurgical assaying, record the wet mass (mass before heating) and dry mass (mass after heating in an oven to remove unbound water molecules). Here: Wet Mass = 500g, Dry Mass = 435g.",
          result: "Wet = 500g; Dry = 435g"
        },
        {
          number: 2,
          title: "Calculate the Mass of Water Removed",
          explanation: "Subtract the dry mass of the heated copper ore from its initial wet mass to calculate the total water weight that was evaporated during the heating sequence.",
          formula: "Water Mass = Wet Mass - Dry Mass",
          calculation: "500g - 435g = 65g of water",
          result: "65g of evaporated water"
        },
        {
          number: 3,
          title: "Compute Moisture Content Percentage",
          explanation: "Apply the gravimetric moisture equation: divide the evaporated water mass by the initial wet ore mass and multiply by 100 to yield the final moisture fraction percentage.",
          formula: "Moisture % = (Water Mass / Wet Mass) * 100",
          calculation: "(65g / 500g) * 105 = 13.0%",
          result: "13.0% Moisture content (wet basis)"
        }
      ],
      finalAnswer: "Moisture Content = 13.0% | Dry Ore Mass = 435g",
      chemicalEquations: [
        {
          reactants: "CuFeS2·xH2O(s) + Thermal Energy",
          products: "CuFeS2(s) + x H2O(g)",
          arrow: "→",
          balanced: true,
          notes: "Gravimetric drying process conducted at 105°C in laboratory conditions."
        }
      ],
      conceptualTakeaway: "Always divide by the INITIAL WET MASS, not the dry mass, when calculating wet-basis moisture! This is a core standard operating procedure (SOP) used in industrial metallurgy.",
      practiceQuestions: [
        {
          questionText: "Which chemical laboratory oven temperature range is standard for removing physical moisture without causing chemical sulfide roasting of the minerals?",
          options: [
            "105°C to 110°C",
            "400°C to 500°C",
            "800°C to 1000°C",
            "0°C to 25°C"
          ],
          correctOptionIndex: 0,
          explanation: "Heating between 105°C and 110°C is the standardized practice to evaporate unbound moisture without decomposing carbonate mineral forms or initiating chemical sulfide roasting."
        },
        {
          questionText: "If a 1.2 kg ore concentrate sample has a wet moisture rating of exactly 5.0%, what is the dry mass of the metallurgical ore sample?",
          options: ["1.14 kg", "1.08 kg", "1.18 kg", "0.95 kg"],
          correctOptionIndex: 0,
          explanation: "Water weight = 1.2 kg * 0.05 = 0.06 kg. Dry mass = 1.2 kg - 0.06 kg = 1.14 kg."
        }
      ]
    }
  },
  {
    id: "def-2",
    question: "What is the mass of coke required to prepare a sintering blast furnace burden with 1200 kg of mineral ore concentrate if the recommended coke ratio is 6.5%?",
    timestamp: "Pre-loaded Example",
    difficultyLevel: "ZNQF Level 4 - Core",
    solution: {
      topic: "LO2: Prepare burden - Mass balancing",
      summary: "In blast furnace and sinter plant burden preparation under LO2, coke is added as a thermodynamic carbon source and fuel. Coke ratios must match specifications perfectly to sustain reducing conditions.",
      steps: [
        {
          number: 1,
          title: "Identify dry ore mass and coke ratio specification",
          explanation: "Check the design specs for the aggregate mix. Ore Concentrate Mass = 1200 kg. Recommended Coke-to-Ore proportion = 6.5%.",
          result: "Ore = 1200 kg; Coke Ratio = 6.5%"
        },
        {
          number: 2,
          title: "Convert ratio to decimal factor",
          explanation: "In order to compute mass requirements, divide the percentage ratio by 100 to convert to a decimal multiplier factor.",
          formula: "Multiplier = Ratio % / 100",
          calculation: "6.5 / 100 = 0.065",
          result: "0.065 multiplier factor"
        },
        {
          number: 3,
          title: "Calculate carbon coke mass requirement",
          explanation: "Multiply the total ore mass by the decimal proportion factor to determine the dry weights of coke fuel that must be batch-measured.",
          formula: "Coke Mass = Ore Mass * Decimal Factor",
          calculation: "1200 kg * 0.065 = 78.0 kg of coke",
          result: "78.0 kg coke fuel"
        }
      ],
      finalAnswer: "Coke Mass Required = 78.0 kg for 1200 kg iron ore concentrate charge",
      chemicalEquations: [
        {
          reactants: "Fe2O3(s) + 3 C(s) (coke)",
          products: "2 Fe(l) + 3 CO(g)",
          arrow: "→",
          balanced: true,
          notes: "Idealized carbothermic reduction occurring inside smelting conditions."
        }
      ],
      conceptualTakeaway: "Accurate weighing of carbonaceous fuels keeps the combustion index in thermal balance. Incorrect ratios lead to cooling or oxidation of the molten metal batch.",
      practiceQuestions: [
        {
          questionText: "What is the primary role of coke carbon during high-temperature blast furnace reactions?",
          options: [
            "As a mechanical mesh binder to hold ores in solid pellet form",
            "As a primary reducing agent supplying carbon monoxide gas to extract iron metal",
            "As an acidic silica flux to combine and create slaggable residues",
            "To wash and clean wet raw ore moisture content"
          ],
          correctOptionIndex: 1,
          explanation: "Coke carbon acts as a fuel to provide heat and combusts with air to produce carbon monoxide (CO), which is the primary reducing gas that abstracts oxygen from iron oxides."
        },
        {
          questionText: "If the sintering blend requires a slag flux limestone addition of 4.0% relative to 1200 kg ore, what Limestone weight must be batch weighed?",
          options: ["36.0 kg", "48.0 kg", "24.0 kg", "12.0 kg"],
          correctOptionIndex: 1,
          explanation: "Limestone weight = 1200 kg * 4.0% = 1200 * 0.04 = 48.0 kg limestone."
        }
      ]
    }
  }
];

export default function App() {
  // --- Persistent & In-App States ---
  const [currentUser, setCurrentUser] = useState<{ name: string; email: string; studentId: string; isAdmin?: boolean } | null>(null);
  const [currentTab, setCurrentTab] = useState<"home" | "solver" | "table" | "quizzes" | "about" | "privacy" | "admin">("home");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [tableSubTab, setTableSubTab] = useState<"elements" | "mass">("elements");
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [question, setQuestion] = useState("Calculate the moisture content percentage and dry weight of a 500g wet copper ore sample after oven drying at 105°C leaves a final weight of 435g.");
  const [difficultyLevel, setDifficultyLevel] = useState("ZNQF Level 4 - Core");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [adminClickCount, setAdminClickCount] = useState(0);
  
  // Recover user session on load
  useEffect(() => {
    const userJson = localStorage.getItem("andrew_academy_current_user_v1");
    if (userJson) {
      try {
        setCurrentUser(JSON.parse(userJson));
      } catch (e) {
        // ignore
      }
    }
  }, []);
  
  // Solution currently showing in main panel
  const [solution, setSolution] = useState<ChemistrySolution | null>(null);
  const [activeProblemId, setActiveProblemId] = useState<string>("def-1");

  // History lists
  const [savedProblems, setSavedProblems] = useState<SavedProblem[]>([]);
  
  // Selection response index
  const [selectedPracticeAnswers, setSelectedPracticeAnswers] = useState<Record<string, number>>({});

  // --- Initial Setup & Local Storage Load ---
  useEffect(() => {
    // Load Saved Problems from Local Storage
    const local = localStorage.getItem("andrew_academy_problems_v1");
    if (local) {
      try {
        const parsed = JSON.parse(local);
        if (parsed && parsed.length > 0) {
          setSavedProblems(parsed);
          setSolution(parsed[0].solution);
          setActiveProblemId(parsed[0].id);
        } else {
          localStorage.setItem("andrew_academy_problems_v1", JSON.stringify(DEFAULT_PROBLEMS));
          setSavedProblems(DEFAULT_PROBLEMS);
          setSolution(DEFAULT_PROBLEMS[0].solution);
          setActiveProblemId(DEFAULT_PROBLEMS[0].id);
        }
      } catch (err) {
        setSavedProblems(DEFAULT_PROBLEMS);
        setSolution(DEFAULT_PROBLEMS[0].solution);
        setActiveProblemId(DEFAULT_PROBLEMS[0].id);
      }
    } else {
      localStorage.setItem("andrew_academy_problems_v1", JSON.stringify(DEFAULT_PROBLEMS));
      setSavedProblems(DEFAULT_PROBLEMS);
      setSolution(DEFAULT_PROBLEMS[0].solution);
      setActiveProblemId(DEFAULT_PROBLEMS[0].id);
    }
  }, []);

  // --- Quick Examples Launcher ---
  const handleQuickTemplate = (presetText: string) => {
    setQuestion(presetText);
  };

  // --- Selection of Saved items ---
  const handleSelectHistoryItem = (prob: SavedProblem) => {
    setSolution(prob.solution);
    setActiveProblemId(prob.id);
    setQuestion(prob.question);
    setDifficultyLevel(prob.difficultyLevel);
    setSelectedPracticeAnswers({});
    setCurrentTab("solver");
  };

  // --- Deletion of items ---
  const handleDeleteHistoryIdx = (e: any, idToDelete: string) => {
    e.stopPropagation();
    const updated = savedProblems.filter(x => x.id !== idToDelete);
    localStorage.setItem("andrew_academy_problems_v1", JSON.stringify(updated));
    setSavedProblems(updated);
    
    // If active selected was deleted, fallback
    if (activeProblemId === idToDelete && updated.length > 0) {
      setSolution(updated[0].solution);
      setActiveProblemId(updated[0].id);
    } else if (updated.length === 0) {
      setSolution(null);
      setActiveProblemId("");
    }
  };

  // --- Clear and reset all solves ---
  const handleResetWorkspace = () => {
    if (window.confirm("Do you want to reset your metallurgy workspace logs and restore dry mass templates?")) {
      localStorage.removeItem("andrew_academy_problems_v1");
      setSavedProblems(DEFAULT_PROBLEMS);
      setSolution(DEFAULT_PROBLEMS[0].solution);
      setActiveProblemId(DEFAULT_PROBLEMS[0].id);
      setSelectedPracticeAnswers({});
      setError(null);
      setCurrentTab("home");
    }
  };

  // --- Brand click trigger for Admin ---
  const handleBrandClick = () => {
    const newCount = adminClickCount + 1;
    setAdminClickCount(newCount);
    if (newCount >= 5) {
      setCurrentTab("admin");
      setAdminClickCount(0);
    }
  };

  // Derived helper for real studies metadata in journal
  const uniqueTopicsCount = useMemo(() => {
    const topics = savedProblems.map(p => p.solution?.topic || "Processing");
    return Array.from(new Set(topics)).length;
  }, [savedProblems]);

  if (!currentUser) {
    return <LocalAuth onLoginSuccess={(user) => setCurrentUser(user)} />;
  }

  const handleLogout = () => {
    localStorage.removeItem("andrew_academy_current_user_v1");
    setCurrentUser(null);
    setCurrentTab("home");
  };

  return (
    <div id="school-root" className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col justify-between selection:bg-emerald-100 relative overflow-x-hidden animate-fadeIn">
      
      {/* Decorative blurred background shapes */}
      <div className="fixed top-0 left-1/4 w-[500px] h-[500px] bg-emerald-100/20 rounded-full blur-[140px] pointer-events-none -z-10 animate-pulse" style={{ animationDuration: "14s" }} />
      <div className="fixed bottom-1/3 right-1/4 w-[450px] h-[450px] bg-teal-100/15 rounded-full blur-[120px] pointer-events-none -z-10 animate-pulse" style={{ animationDuration: "18s" }} />

      {/* Mobile Drawer Slide-out Navigation */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 md:hidden flex" id="mobile-navigation-drawer">
            {/* Backdrop wrapper overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs cursor-pointer"
            />

            {/* Slide-out Menu content */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="relative w-72 max-w-[80vw] bg-white h-full shadow-[5px_0_30px_rgba(0,0,0,0.15)] flex flex-col justify-between select-none border-r border-slate-200"
            >
              <div className="flex flex-col flex-grow overflow-y-auto p-5 space-y-6">
                
                {/* Drawer Header Profile */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-950 to-indigo-700 text-white flex items-center justify-center font-black text-sm border-2 border-slate-100 shadow-xs uppercase select-none shrink-0" id="avatar-drawer">
                      {currentUser?.name ? currentUser.name.charAt(0) : "S"}
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-[#0e1154] uppercase tracking-wide font-sans">{currentUser?.name || "Student Miner"}</h4>
                      <p className="text-[9px] text-slate-400 font-medium font-mono">{currentUser?.email || "student@andrew.edu"}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 transition-all border border-slate-200 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>



                {/* Main Tab Links */}
                <div className="flex flex-col space-y-1.5" id="drawer-tab-navigation">
                  <span className="text-[9px] font-black tracking-widest text-slate-400 uppercase mb-1 font-mono">Navigation Menu</span>
                  
                  {[
                    { id: "home", label: "Overview Dashboard", icon: Home },
                    { id: "solver", label: "Metallurgy Lab Desk", icon: Sparkles },
                    { id: "table", label: "Periodic Table & Masses", icon: Atom },
                    { id: "quizzes", label: "Quizzes Syllabus", icon: HelpCircle },
                    { id: "about", label: "About Creator", icon: FileText },
                    { id: "privacy", label: "Privacy Policy", icon: Shield }
                  ].map((tab) => {
                    // Fallback to FileText if icon not imported properly or dynamically
                    const IconComponent = tab.icon || FileText;
                    const isActive = currentTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => {
                          setCurrentTab(tab.id as any);
                          setIsMobileMenuOpen(false);
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left text-xs font-bold transition-all border cursor-pointer ${
                          isActive
                            ? "bg-[#0e1154] text-white border-[#0e1154] shadow-xs"
                            : "bg-transparent text-slate-600 border-transparent hover:bg-slate-100 hover:text-slate-800"
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <IconComponent className="w-4 h-4 shrink-0" />
                          <span>{tab.label}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Shortcuts & Extras section inside drawer */}
                <div className="flex flex-col space-y-2 pt-2 border-t border-slate-100">
                  <span className="text-[9px] font-black tracking-widest text-[#0e1154] uppercase font-mono">Student Actions</span>
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      setShowSearchModal(true);
                    }}
                    className="w-full flex items-center gap-2.5 hover:bg-slate-100 text-slate-600 px-3 py-2 text-xs font-bold text-left rounded-xl transition-all border border-transparent cursor-pointer"
                  >
                    <Search className="w-4 h-4 text-slate-400" />
                    <span>Search Database</span>
                  </button>
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      handleResetWorkspace();
                    }}
                    className="w-full flex items-center gap-2.5 hover:bg-rose-50 text-rose-600 px-3 py-2 text-xs font-bold text-left rounded-xl transition-all border border-transparent cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4 text-rose-400" />
                    <span>Clean Workspace Log</span>
                  </button>
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      handleLogout();
                    }}
                    className="w-full flex items-center gap-2.5 hover:bg-amber-50 text-amber-700 px-3 py-2 text-xs font-bold text-left rounded-xl transition-all border border-transparent cursor-pointer"
                  >
                    <LogOut className="w-4 h-4 text-amber-500" />
                    <span>Sign Out Account</span>
                  </button>
                </div>

              </div>

              {/* Drawer Footer info */}
              <div className="p-4 border-t border-slate-100 bg-slate-50 text-center rounded-b-3xl">
                <span className="text-[8px] font-extrabold uppercase tracking-widest text-[#0e1154] block">Andrew Academy</span>
                <span className="text-[8px] text-slate-400 font-mono mt-0.5 block">ZNQF LEVEL 4 V2 • 2026</span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>


      <div className="w-full max-w-6xl mx-auto px-4 py-4 md:py-8 flex flex-col flex-grow pb-8">
        {/* Header Bar */}
        <header className="flex justify-between items-center gap-4 mb-6 border-b border-slate-200 pb-5 animate-fadeIn" id="app-header">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#0e1154] transition-all cursor-pointer active:scale-95 border border-slate-200/80"
              title="Open Navigation"
              id="mobile-drawer-trigger"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex flex-col items-start leading-tight">
              <span className="text-[10px] font-extrabold text-[#0e1154] tracking-[0.2em] uppercase font-sans">Syllabus Guide</span>
              <div className="flex items-center gap-2">
                <h1 onClick={handleBrandClick} className="text-xl md:text-2xl font-black tracking-tight text-[#0e1154] cursor-pointer select-none" id="brand-title">Andrew Academy</h1>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Live active connection status indicator */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-full shadow-2xs">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-[9px] font-black text-slate-500 font-mono uppercase tracking-wider">METALLURGY ENGINE LIVE</span>
            </div>

            {/* Magnifying search glass icon */}
            <button 
              onClick={() => setShowSearchModal(true)}
              className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-[#0e1154] transition-all cursor-pointer active:scale-95 border border-slate-200"
              title="Search metallurgy database"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Profile scientist avatar with student's title */}
            <div className="flex items-center gap-2">
              <div className="hidden lg:flex flex-col text-right leading-none min-w-0">
                <span className="text-[10px] font-black text-[#0e1154] uppercase tracking-tight truncate max-w-36">{currentUser?.name}</span>
                <span className="text-[9px] text-slate-400 font-bold font-mono uppercase">{currentUser?.studentId}</span>
              </div>
              <div className="relative p-0.5 rounded-full shrink-0">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-950 to-indigo-700 text-white flex items-center justify-center font-black text-sm border border-slate-200 shadow-xs uppercase select-none" id="avatar-header">
                  {currentUser?.name ? currentUser.name.charAt(0) : "S"}
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-white rounded-full animate-pulse"></span>
              </div>
              <button
                onClick={handleLogout}
                className="hidden sm:flex items-center gap-1.5 text-[10px] uppercase font-black text-slate-500 hover:text-amber-600 transition-colors ml-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white shadow-2xs cursor-pointer select-none active:scale-95"
                title="Sign out of student account"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Sign Out</span>
              </button>
            </div>
          </div>
        </header>

        {/* Desktop-Only Tab Navigation */}
        <div className="hidden md:flex bg-slate-100/70 p-1 rounded-2xl mb-6 shrink-0 border border-slate-200/40" id="academy-tabs">
          <button
            id="tab-home"
            onClick={() => setCurrentTab("home")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer shrink-0 ${
              currentTab === "home"
                ? "bg-[#0e1154] text-white shadow-sm font-extrabold"
                : "text-slate-505 text-slate-500 hover:text-slate-800 hover:bg-slate-200/40"
            }`}
          >
            <Home className="w-3.5 h-3.5 shrink-0" />
            <span>Overview Dashboard</span>
          </button>

          <button
            id="tab-solver"
            onClick={() => setCurrentTab("solver")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer shrink-0 ${
              currentTab === "solver"
                ? "bg-[#0e1154] text-white shadow-sm font-extrabold"
                : "text-slate-505 text-slate-500 hover:text-slate-800 hover:bg-slate-200/40"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 shrink-0" />
            <span>Metallurgy Lab Desk</span>
          </button>
          
          <button
            id="tab-table"
            onClick={() => setCurrentTab("table")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer shrink-0 ${
              currentTab === "table"
                ? "bg-[#0e1154] text-white shadow-sm font-extrabold"
                : "text-slate-505 text-slate-500 hover:text-slate-800 hover:bg-slate-200/40"
            }`}
          >
            <Atom className="w-3.5 h-3.5 shrink-0" />
            <span>Periodic Table & Masses</span>
          </button>

          <button
            id="tab-quizzes"
            onClick={() => setCurrentTab("quizzes")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer shrink-0 ${
              currentTab === "quizzes"
                ? "bg-[#0e1154] text-white shadow-sm font-extrabold"
                : "text-slate-505 text-slate-500 hover:text-slate-800 hover:bg-slate-200/40"
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5 shrink-0" />
            <span>Quizzes Syllabus</span>
          </button>
          
          {currentUser?.isAdmin && (
            <button
              id="tab-admin"
              onClick={() => setCurrentTab("admin")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer shrink-0 ml-auto ${
                currentTab === "admin"
                  ? "bg-indigo-600 text-white shadow-sm font-extrabold"
                  : "text-slate-505 text-slate-500 hover:text-slate-800 hover:bg-slate-200/40"
              }`}
            >
              <Shield className="w-3.5 h-3.5 shrink-0" />
              <span>Admin Console</span>
            </button>
          )}
        </div>

        <main className="flex-grow mb-6 flex flex-col justify-stretch" id="main-content-panels">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
              className="flex-grow flex flex-col justify-stretch"
            >
              {currentTab === "home" && (
                <HomeDesk 
                  onNavigate={setCurrentTab}
                  onSetQuestion={setQuestion}
                />
              )}

              {currentTab === "solver" && (
                <AISolverLab
                  question={question}
                  setQuestion={setQuestion}
                  difficultyLevel={difficultyLevel}
                  setDifficultyLevel={setDifficultyLevel}
                  isLoading={isLoading}
                  setIsLoading={setIsLoading}
                  error={error}
                  setError={setError}
                  solution={solution}
                  setSolution={setSolution}
                  savedProblems={savedProblems}
                  setSavedProblems={setSavedProblems}
                  activeProblemId={activeProblemId}
                  setActiveProblemId={setActiveProblemId}
                  selectedPracticeAnswers={selectedPracticeAnswers}
                  setSelectedPracticeAnswers={setSelectedPracticeAnswers}
                  handleQuickTemplate={handleQuickTemplate}
                  defaultProblems={DEFAULT_PROBLEMS}
                />
              )}

              {currentTab === "table" && (
                <div className="space-y-6 animate-fadeIn text-left">
                  <div className="flex bg-slate-100 p-1 rounded-xl w-fit border border-slate-200">
                    <button 
                      onClick={() => setTableSubTab("elements")}
                      className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                        tableSubTab === "elements" ? "bg-white text-[#0e1154] shadow-xs cursor-pointer" : "text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      Periodic table
                    </button>
                    <button 
                      onClick={() => setTableSubTab("mass")}
                      className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                        tableSubTab === "mass" ? "bg-white text-[#0e1154] shadow-xs cursor-pointer" : "text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      Agglomeration Mass Calculator
                    </button>
                  </div>

                  <div>
                    {tableSubTab === "elements" ? <PeriodicDesk /> : <MolarMassDesk />}
                  </div>
                </div>
              )}

              {currentTab === "quizzes" && (
                <QuizzesDesk />
              )}

              {currentTab === "about" && (
                <AboutDesk />
              )}

              {currentTab === "privacy" && (
                <PrivacyPolicyDesk />
              )}

              {currentTab === "admin" && currentUser?.isAdmin && (
                <AdminDesk />
              )}
            </motion.div>
          </AnimatePresence>
        </main>
        <PWAInstallPrompt />
      </div>

      {/* Classroom Footer - responsive, mobile safety cushions */}
      <footer className="border-t border-slate-200 bg-white py-5 px-4 text-center text-xs text-slate-400 shrink-0 pb-20 md:pb-5 animate-fadeIn" id="portal-footer">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-center md:text-left">
            <p>© 2026 Andrew Academy. Created with passion for Industrial Metallurgy, Ore Assaying & Digital Process Pedagogy.</p>
            <p className="text-[10px] text-slate-400 mt-0.5 font-sans">Syllabus-aligned calculation suites for ZNQF Level 4 Operator Technician students.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-4 text-[11px] font-semibold text-slate-505 text-slate-500">
            <button onClick={() => setCurrentTab('about')} className="hover:text-slate-800 transition cursor-pointer">About Creator</button>
            <button onClick={() => setCurrentTab('privacy')} className="hover:text-slate-800 transition cursor-pointer">Privacy Policy</button>
          </div>
        </div>
      </footer>

      {/* Search Modal Overlay */}
      {showSearchModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-3xl border border-slate-200 w-full max-w-md p-5 relative shadow-2xl animate-scaleUp text-left">
            <div className="flex justify-between items-center mb-4 border-b border-slate-100 pb-2.5">
              <h3 className="text-xs font-black text-[#0e1154] uppercase tracking-wider flex items-center gap-1.5">
                <Search className="w-4 h-4 text-[#0e1154]" />
                <span>Metallurgy Database Lookup</span>
              </h3>
              <button 
                onClick={() => { setShowSearchModal(false); setSearchQuery(""); }}
                className="p-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 transition-all active:scale-95 cursor-pointer border border-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-[11px] text-slate-500 mb-3 font-medium leading-relaxed">
              Verify base metals, PGMs, screen sizes, or machine settings:
            </p>

            <div className="relative mb-4">
              <input 
                type="text"
                placeholder="Type any material, weight, or conveyor settings (e.g. Copper, Sinter, Coke)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 hover:border-indigo-300 focus:border-[#0e1154] focus:bg-white rounded-xl py-2 px-3 pl-9 text-xs outline-none transition-all font-bold"
                autoFocus
              />
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            </div>

            {/* Suggested Search Lists */}
            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {searchQuery.trim() === "" ? (
                <div className="space-y-2">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest font-mono">Suggested keywords</span>
                  <div className="flex flex-wrap gap-1.5 animate-fadeIn">
                    {["Moisture", "Sulfide", "PGM", "Limestone", "Coke", "Crusher", "Calibration", "Sieve"].map((tag) => (
                      <button
                        key={tag}
                        onClick={() => setSearchQuery(tag)}
                        className="px-2.5 py-1 text-[10px] font-bold rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-650 text-slate-600 cursor-pointer"
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                (() => {
                  const queryLower = searchQuery.toLowerCase().trim();
                  const matchingItems: { title: string; desc: string; tab: "home" | "solver" | "table" | "quizzes"; customAction?: () => void }[] = [];

                  // Common base metals and PGMs search index
                  const commonElements = [
                    { symbol: "Fe", name: "Iron", mass: 55.845, cat: "transition-metal" },
                    { symbol: "Cu", name: "Copper", mass: 63.546, cat: "transition-metal" },
                    { symbol: "Ni", name: "Nickel", mass: 58.693, cat: "transition-metal" },
                    { symbol: "Pt", name: "Platinum", mass: 195.084, cat: "transition-metal" },
                    { symbol: "Pd", name: "Palladium", mass: 106.42, cat: "transition-metal" },
                    { symbol: "Rh", name: "Rhodium", mass: 102.906, cat: "transition-metal" },
                    { symbol: "Nd", name: "Neodymium", mass: 144.24, cat: "lanthanide" },
                    { symbol: "Au", name: "Gold", mass: 196.967, cat: "transition-metal" },
                  ];

                  commonElements.forEach((el) => {
                    if (el.name.toLowerCase().includes(queryLower) || el.symbol.toLowerCase().includes(queryLower)) {
                      matchingItems.push({
                        title: `${el.name} (${el.symbol})`,
                        desc: `Metallurgical Element • Atomic Weight: ${el.mass} g/mol • Category: ${el.cat}`,
                        tab: "table"
                      });
                    }
                  });

                  // Route terms
                  if ("moisture".includes(queryLower) || "sieve".includes(queryLower) || "sulfide".includes(queryLower)) {
                    matchingItems.push({
                      title: "LO1: Process Raw Materials Assessment",
                      desc: "Challenge your raw material classification, ore drying calculations, and sieve screen sizes.",
                      tab: "quizzes"
                    });
                  }
                  if ("coke".includes(queryLower) || "sinter".includes(queryLower) || "limestone".includes(queryLower) || "burden".includes(queryLower)) {
                    matchingItems.push({
                      title: "LO2: Formulate Sinter Burden Assessment",
                      desc: "Test your burden calculations, mass balancing coke-to-ore, and limestone flux agglomeration.",
                      tab: "quizzes"
                    });
                  }
                  if ("calibration".includes(queryLower) || "crusher".includes(queryLower) || "sheq".includes(queryLower)) {
                    matchingItems.push({
                      title: "LO3: Machine Setup Assessment Suite",
                      desc: "Review mineral separator setup, automatic belt conveyor calibrations, and safety dust inhalation hazards.",
                      tab: "quizzes"
                    });
                  }

                  // Search history logs
                  savedProblems.forEach((prob) => {
                    if (prob.question.toLowerCase().includes(queryLower) || (prob.solution?.topic && prob.solution.topic.toLowerCase().includes(queryLower))) {
                      matchingItems.push({
                        title: `Journal: ${prob.solution?.topic || "Syllabus Solve"}`,
                        desc: prob.question,
                        tab: "solver",
                        customAction: () => {
                          setSolution(prob.solution);
                          setActiveProblemId(prob.id);
                        }
                      });
                    }
                  });

                  if (matchingItems.length === 0) {
                    return (
                      <div className="text-center py-4 text-[11px] text-slate-400 font-medium">
                        No direct matching items. Try looking up "Coke", "Crusher", or "Copper".
                      </div>
                    );
                  }

                  return matchingItems.slice(0, 5).map((item, idx) => (
                    <div 
                      key={idx}
                      onClick={() => {
                        if (item.customAction) item.customAction();
                        setCurrentTab(item.tab);
                        setShowSearchModal(false);
                        setSearchQuery("");
                      }}
                      className="p-3 bg-slate-50 hover:bg-[#00ffff]/10 border border-slate-200/50 hover:border-indigo-400 rounded-xl cursor-pointer transition-all duration-150 text-left"
                    >
                      <div className="font-bold text-xs text-slate-800">{item.title}</div>
                      <div className="text-[10px] text-slate-500 mt-1 leading-normal line-clamp-2">{item.desc}</div>
                      <div className="text-[9px] font-bold text-indigo-700 mt-1.5 font-mono uppercase">Open {item.tab} tab →</div>
                    </div>
                  ));
                })()
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
