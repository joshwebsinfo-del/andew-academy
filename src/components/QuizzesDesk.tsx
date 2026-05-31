import { useState, useEffect } from "react";
import { 
  HelpCircle, 
  XCircle, 
  BookOpen, 
  Sparkles, 
  RotateCcw, 
  ChevronRight, 
  CheckCircle2,
  Lock,
  LockKeyhole,
  Award,
  ArrowRight,
  TrendingUp
} from "lucide-react";
import { QUIZ_MODULES, QuizModule } from "../data/quizData";

export default function QuizzesDesk() {
  const [activeModuleId, setActiveModuleId] = useState<string | null>(null);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [quizFinished, setQuizFinished] = useState<boolean>(false);
  const [hasSubmittedAnswer, setHasSubmittedAnswer] = useState<boolean>(false);
  
  // High scores tracking, partitioned by the logged-in student profile or guest
  const [highScores, setHighScores] = useState<Record<string, number>>({});
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    // Lookup current authenticated session
    const userJson = localStorage.getItem("andrew_academy_current_user_v1");
    let userEmail = "guest";
    if (userJson) {
      try {
        const u = JSON.parse(userJson);
        setCurrentUser(u);
        userEmail = u.email;
      } catch (e) {
        // ignore
      }
    }

    // Load quiz high scores for this specific student email
    const scoresJson = localStorage.getItem(`andrew_academy_quiz_scores_v1_${userEmail}`);
    if (scoresJson) {
      try {
        setHighScores(JSON.parse(scoresJson));
      } catch (e) {
        // ignore
      }
    }
  }, []);

  const activeModule = QUIZ_MODULES.find(m => m.id === activeModuleId);

  const handleStartModule = (modId: string, isLocked: boolean) => {
    if (isLocked) return;
    setActiveModuleId(modId);
    setCurrentQuestionIdx(0);
    setSelectedAnswers({});
    setQuizFinished(false);
    setHasSubmittedAnswer(false);
  };

  const handleOptionChoose = (optionIndex: number) => {
    if (hasSubmittedAnswer || !activeModule) return;

    // Track chosen answer
    const updatedAnswers = {
      ...selectedAnswers,
      [currentQuestionIdx]: optionIndex
    };
    setSelectedAnswers(updatedAnswers);

    // Lock choice and show explanation (No auto advancement countdown)
    setHasSubmittedAnswer(true);
  };

  const handleNextQuestionManual = () => {
    if (!activeModule) return;
    
    if (currentQuestionIdx < activeModule.questions.length - 1) {
      setCurrentQuestionIdx(prev => prev + 1);
      setHasSubmittedAnswer(false);
    } else {
      // Completed last question of the syllabus module!
      setQuizFinished(true);
      
      // Calculate final score
      const correctCount = activeModule.questions.reduce((acc, q, idx) => {
        return acc + (selectedAnswers[idx] === q.correctIndex ? 1 : 0);
      }, 0);
      const totalCount = activeModule.questions.length;
      const scorePercent = Math.round((correctCount / totalCount) * 100);

      // Save high score if greater
      const userEmail = currentUser ? currentUser.email : "guest";
      const currentHighest = highScores[activeModule.id] || 0;
      if (scorePercent > currentHighest) {
        const updatedScores = {
          ...highScores,
          [activeModule.id]: scorePercent
        };
        setHighScores(updatedScores);
        localStorage.setItem(`andrew_academy_quiz_scores_v1_${userEmail}`, JSON.stringify(updatedScores));
      }
    }
  };

  // Helpmate structure to analyze module locked states
  // Rules checklist:
  // - lo1-raw-materials is unlocked initially.
  // - lo2-prepare-burden is locked until LO1 score is >= 85%.
  // - lo3-machine-setup is locked until LO2 score is >= 85%.
  const getModuleStatus = (modId: string): { isLocked: boolean; requirementMessage?: string } => {
    if (modId === "lo1-raw-materials") {
      return { isLocked: false };
    }
    
    if (modId === "lo2-prepare-burden") {
      const lo1Score = highScores["lo1-raw-materials"] || 0;
      const passThreshold = 85;
      if (lo1Score < passThreshold) {
        return { 
          isLocked: true, 
          requirementMessage: `LO1 master grade of 85% required (your highest: ${lo1Score}%)` 
        };
      }
      return { isLocked: false };
    }

    if (modId === "lo3-machine-setup") {
      // Must clear LO1 and LO2
      const lo1Score = highScores["lo1-raw-materials"] || 0;
      const lo2Score = highScores["lo2-prepare-burden"] || 0;
      const passThreshold = 85;

      if (lo1Score < passThreshold) {
        return { 
          isLocked: true, 
          requirementMessage: `Unlock "LO2: Sinter Burden" first by scoring 85% on LO1` 
        };
      }
      if (lo2Score < passThreshold) {
        return { 
          isLocked: true, 
          requirementMessage: `LO2 master grade of 85% required (your highest: ${lo2Score}%)` 
        };
      }
      return { isLocked: false };
    }

    return { isLocked: false };
  };

  return (
    <div className="max-w-3xl mx-auto w-full animate-fadeIn text-left pb-12 px-2 sm:px-4" id="page-quizzes">
      {/* Primary Quiz Area */}
      <div className="space-y-6">
        
        {/* Scenario 1: No module selected; list all modules along with locking logic */}
        {!activeModuleId ? (
          <section className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-indigo-600 shrink-0" />
                <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest font-mono">
                  Syllabus Learning Outcomes
                </h3>
              </div>
              <div className="text-[10px] bg-amber-50 text-amber-800 border border-amber-200/80 rounded-lg px-3 py-1 font-semibold">
                Lockout active: Core learning outcomes require <span className="font-extrabold text-amber-950">≥85% accuracy score</span> to unlock subsequent modules.
              </div>
            </div>
            
            <p className="text-[11px] sm:text-xs text-slate-500 mb-6 leading-relaxed font-semibold">
              Verify your physical ore metrics, metallurgical composition formulas, and machine safety codes under ZNQF Level 4 directives. Complete the outcomes sequentially:
            </p>

            <div className="grid grid-cols-1 gap-4">
              {QUIZ_MODULES.map((mod) => {
                const { isLocked, requirementMessage } = getModuleStatus(mod.id);
                const highestScore = highScores[mod.id] || 0;
                const hasPassed = highestScore >= 85;

                return (
                  <div 
                    key={mod.id}
                    className={`p-5 rounded-2xl border transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
                      isLocked 
                        ? "bg-slate-50 border-slate-200/65 opacity-80" 
                        : hasPassed
                          ? "bg-emerald-50/20 border-emerald-200 hover:border-emerald-300 shadow-3xs"
                          : "bg-white border-slate-200 hover:border-indigo-200/80 hover:shadow-2xs"
                    }`}
                  >
                    <div className="space-y-2.5 flex-grow min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded ${
                          isLocked 
                            ? "bg-slate-200 text-slate-500" 
                            : "bg-indigo-150 bg-indigo-50 text-indigo-800"
                        }`}>
                          {mod.subject}
                        </span>
                        
                        <span className={`text-[9px] font-mono font-bold ${
                          mod.difficulty === "Advanced" ? "text-rose-600" : mod.difficulty === "Intermediate" ? "text-yellow-600" : "text-emerald-600"
                        }`}>
                          {mod.difficulty}
                        </span>

                        {/* Lock/Unlock Badges */}
                        {isLocked ? (
                          <div className="flex items-center gap-1 text-[8px] font-black bg-rose-50 text-rose-700 px-2 py-0.5 rounded border border-rose-100 uppercase tracking-wide">
                            <Lock className="w-2.5 h-2.5" />
                            <span>LOCKED</span>
                          </div>
                        ) : hasPassed ? (
                          <div className="flex items-center gap-1 text-[8px] font-black bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded uppercase tracking-wide">
                            <CheckCircle2 className="w-2.5 h-2.5" />
                            <span>CLEARED OUTCOME ({highestScore}%)</span>
                          </div>
                        ) : highestScore > 0 ? (
                          <div className="flex items-center gap-1 text-[8px] font-black bg-amber-50 text-amber-700 px-2 py-0.5 rounded border border-amber-100 uppercase tracking-wide">
                            <TrendingUp className="w-2.5 h-2.5" />
                            <span>PRACTICING ({highestScore}%)</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 text-[8px] font-black bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-100 uppercase tracking-wide">
                            <span>READY</span>
                          </div>
                        )}
                      </div>

                      <div>
                        <h4 className="text-sm font-extrabold text-slate-800 mb-1 leading-snug tracking-tight">
                          {mod.title}
                        </h4>
                        <p className="text-[11px] text-slate-400 font-semibold leading-normal">
                          This assessment measures student capability inside the Zimbabwean National Qualification Framework (ZNQF).
                        </p>
                      </div>

                      {/* Requirement banner if locked */}
                      {isLocked && requirementMessage && (
                        <p className="text-[10px] text-rose-600 font-bold bg-rose-50/50 p-2 rounded-xl inline-flex items-center gap-1.5 border border-rose-100 font-mono">
                          <LockKeyhole className="w-3.5 h-3.5" />
                          <span>{requirementMessage}</span>
                        </p>
                      )}
                    </div>

                    <div className="shrink-0 w-full md:w-auto self-stretch md:self-auto flex items-center md:items-stretch justify-end">
                      {isLocked ? (
                        <div className="w-full md:w-44 bg-slate-100 border border-slate-200/60 p-3 rounded-xl flex items-center justify-center gap-2 text-slate-400 font-bold text-xs select-none">
                          <Lock className="w-3.5 h-3.5" />
                          <span>Syllabus Locked</span>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleStartModule(mod.id, isLocked)}
                          className={`w-full md:w-44 py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer shadow-3xs ${
                            hasPassed 
                              ? "bg-slate-100 hover:bg-emerald-600 hover:text-white text-slate-700 border border-slate-200"
                              : "bg-[#0e0f3c] hover:bg-indigo-600 text-white"
                          }`}
                        >
                          <span>{highestScore > 0 ? "Re-enter Trial" : "Begin Challenge"}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        ) : (
          /* Scenario 2: Active module */
          <section className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-sm">
            
            {/* Quiz Header Bar */}
            <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-3 gap-2">
              <div className="min-w-0">
                <span className="text-[8px] font-black text-indigo-600 uppercase tracking-widest font-mono">
                  ACTIVE SYLLABUS CHALLENGE
                </span>
                <h3 className="text-xs sm:text-sm font-black text-slate-800 leading-tight truncate">
                  {activeModule.title}
                </h3>
              </div>
              <button 
                onClick={() => {
                  setActiveModuleId(null);
                }}
                className="text-[10px] text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-full font-bold transition-all active:scale-95 cursor-pointer shrink-0"
              >
                Exit Quiz
              </button>
            </div>

            {/* Quiz ongoing states */}
            {!quizFinished ? (
              <div>
                {/* Progress bar info */}
                <div className="flex justify-between items-center mb-3">
                  <span className="text-[9px] text-[#0e1154] font-black font-mono uppercase">
                    QUESTION {currentQuestionIdx + 1} OF {activeModule.questions.length}
                  </span>
                  <div className="text-[9px] text-emerald-600 font-mono font-bold">
                    <span>Self-Paced Reader Mode</span>
                  </div>
                </div>

                <div className="w-full bg-slate-100 h-1.5 rounded-full mb-6 overflow-hidden">
                  <div 
                    className="bg-[#0e1154] h-1.5 rounded-full transition-all duration-300"
                    style={{ width: `${((currentQuestionIdx + 1) / activeModule.questions.length) * 100}%` }}
                  ></div>
                </div>

                {/* Question box display */}
                <div className="mb-6">
                  <h4 className="text-xs sm:text-sm font-bold text-slate-800 leading-relaxed bg-slate-50 border border-slate-100 p-3 sm:p-4 rounded-xl text-left">
                    {activeModule.questions[currentQuestionIdx].question}
                  </h4>
                </div>

                {/* Multiple choice options */}
                <div className="space-y-2.5 mb-6">
                  {activeModule.questions[currentQuestionIdx].options.map((option, idx) => {
                    const isSelected = selectedAnswers[currentQuestionIdx] === idx;
                    const isCorrectAnswer = idx === activeModule.questions[currentQuestionIdx].correctIndex;
                    
                    let bgBorderClass = "bg-slate-50 border-slate-200 hover:bg-slate-100/60 text-slate-700";
                    if (isSelected) {
                      bgBorderClass = "bg-indigo-50 border-indigo-600 text-indigo-950 shadow-xs";
                    }

                    // If they submitted their solution, show colors green (correct) or red (incorrect)
                    if (hasSubmittedAnswer) {
                      if (isCorrectAnswer) {
                        bgBorderClass = "bg-emerald-50 border-emerald-600 text-emerald-950";
                      } else if (isSelected) {
                        bgBorderClass = "bg-rose-50 border-rose-500 text-rose-950";
                      } else {
                        bgBorderClass = "bg-slate-50 border-slate-200/40 text-slate-400 opacity-60";
                      }
                    }

                    return (
                      <button
                        key={idx}
                        onClick={() => handleOptionChoose(idx)}
                        disabled={hasSubmittedAnswer}
                        className={`w-full p-3 px-4 rounded-xl border text-left transition-all duration-100 font-bold text-xs flex justify-between items-center ${
                          hasSubmittedAnswer ? "cursor-default" : "cursor-pointer active:scale-[0.99]"
                        } ${bgBorderClass}`}
                      >
                        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                          <span className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] shrink-0 ${
                            isSelected ? "bg-indigo-600 text-white" : "bg-slate-200 text-slate-600"
                          } ${hasSubmittedAnswer && isCorrectAnswer ? "bg-emerald-600 text-white" : ""} ${hasSubmittedAnswer && isSelected && !isCorrectAnswer ? "bg-rose-500 text-white" : ""}`}>
                            {String.fromCharCode(65 + idx)}
                          </span>
                          <span className="text-[11px] sm:text-xs leading-tight">{option}</span>
                        </div>

                        {/* Validation elements icons if user has submitted */}
                        {hasSubmittedAnswer && (
                          <div className="shrink-0 ml-2">
                            {isCorrectAnswer ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            ) : isSelected ? (
                              <XCircle className="w-4 h-4 text-rose-500" />
                            ) : null}
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Interactive Explanation Curve */}
                {hasSubmittedAnswer && (
                  <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl mb-6 text-[11px] sm:text-xs text-slate-600 leading-relaxed font-sans animate-fadeIn">
                    <div className="flex items-center gap-1.5 font-bold text-slate-800 mb-1">
                      <Sparkles className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                      <span>Syllabus Explanation:</span>
                    </div>
                    {activeModule.questions[currentQuestionIdx].explanation}
                  </div>
                )}

                {/* Confirm/Next buttons footer */}
                <div className="flex flex-col sm:flex-row justify-between items-center pt-4 border-t border-slate-100 gap-3">
                  <div className="text-[10px] text-slate-400 font-semibold font-mono text-center sm:text-left">
                    {!hasSubmittedAnswer ? (
                      <span>Select an option in safety to test your response and reveal the answer notes.</span>
                    ) : (
                      <span className="text-emerald-700 font-bold">Answer logged. Click "Next Question" below when ready to continue.</span>
                    )}
                  </div>
                  
                  {hasSubmittedAnswer && (
                    <button
                      onClick={handleNextQuestionManual}
                      className="w-full sm:w-auto bg-emerald-650 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1 active:scale-95 shadow-xs"
                    >
                      <span>{currentQuestionIdx < activeModule.questions.length - 1 ? "Next Question" : "Finish Review & Save"}</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ) : (
              /* Scenario 3: Quiz Finished state */
              <div className="text-center py-8 px-2 sm:px-4">
                <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 border border-indigo-100">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                
                <h4 className="text-xs sm:text-sm font-black text-slate-800 uppercase tracking-widest mb-1 font-mono">
                  Syllabus Review Completed
                </h4>
                
                {/* Scoring Logic */}
                {(() => {
                  const correctCount = activeModule.questions.reduce((acc, q, idx) => {
                    return acc + (selectedAnswers[idx] === q.correctIndex ? 1 : 0);
                  }, 0);
                  const totalCount = activeModule.questions.length;
                  const scorePercent = Math.round((correctCount / totalCount) * 100);

                  return (
                    <div className="space-y-4">
                      <div className="text-3xl font-black text-slate-900 font-mono mt-3">
                        {scorePercent}%
                        <span className="text-xs text-slate-400 block font-normal font-sans mt-1">
                          ({correctCount} out of {totalCount} correct)
                        </span>
                      </div>
                      <p className="text-[11px] sm:text-xs font-semibold text-slate-500 mt-1 max-w-sm mx-auto leading-relaxed">
                        {scorePercent >= 85 
                          ? "Fabulous job! You passed the 85% accuracy master threshold and have successfully unlocked the subsequent learning outcomes in your study path!" 
                          : "Splendid effort, but you require an 85% or greater score to unlock the next learning outcome. Review the explanations and retake the challenge to clear the grade!"}
                      </p>

                      <div className={`inline-block px-4 py-2 border rounded-xl text-xs font-extrabold font-sans ${
                        scorePercent >= 85 
                          ? "bg-emerald-50 text-emerald-800 border-emerald-100" 
                          : "bg-amber-50 text-amber-850 text-amber-700 border-amber-100"
                      }`}>
                        {scorePercent >= 85 ? "Syllabus Status: OUTCOME MASTERED 🚀" : "Syllabus Status: GRADE UNMET (≥85% Required to Unlock next Outcomes)"}
                      </div>

                      <div className="pt-6 flex flex-col sm:flex-row justify-center gap-3">
                        <button
                          onClick={() => handleStartModule(activeModule.id, false)}
                          className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
                        >
                          <RotateCcw className="w-4 h-4" />
                          <span>Re-Take Quiz</span>
                        </button>
                        <button
                          onClick={() => setActiveModuleId(null)}
                          className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-slate-900 text-white hover:bg-indigo-600 text-xs font-bold transition-all active:scale-95 cursor-pointer text-center"
                        >
                          Back to Module List
                        </button>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  );
}
