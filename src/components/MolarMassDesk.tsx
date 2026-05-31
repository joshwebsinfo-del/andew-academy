import { useState, useMemo } from "react";
import { Calculator, AlertTriangle, HelpCircle } from "lucide-react";
import { calculateMolarMass } from "../utils/molarMass";

export default function MolarMassDesk() {
  const [molarMassInput, setMolarMassInput] = useState("Fe2O3");

  // --- Live Molar Mass Calculations ---
  const molarMassResult = useMemo(() => {
    return calculateMolarMass(molarMassInput);
  }, [molarMassInput]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fadeIn" id="page-molarmass">
      {/* Sinter & Mineral Mass Calculator */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between text-left" id="calculator-card">
        <div>
          <div className="flex justify-between items-center mb-4 border-b border-slate-100 pb-3">
            <div className="flex items-center gap-1.5">
              <Calculator className="w-5 h-5 text-emerald-600" />
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">
                Agglomeration & Mineral mass Analyzer Desk
              </h3>
            </div>
            <span className="text-[10px] bg-slate-900 text-white px-2 py-0.5 rounded font-black font-mono">OFFLINE ENGINE</span>
          </div>

          <p className="text-xs text-slate-550 text-slate-500 font-medium leading-relaxed mb-4">
            Type any mineral formula or mineral compound. The real-time stoichiometric parsing engine instantly breaks down mass compositions and metal percentage fractions of your ore sample:
          </p>

          <div className="relative mb-4">
            <input
              type="text"
              value={molarMassInput}
              onChange={(e) => setMolarMassInput(e.target.value)}
              placeholder="e.g. Fe2O3, CuFeS2, CaCO3, SiO2, or CaSiO3"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 pr-12 text-sm font-bold text-slate-800 placeholder-slate-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-mono uppercase"
              id="molar-mass-raw-input"
            />
            <div className="absolute right-4 top-3.5 text-xs font-mono text-slate-400 font-black">
              g/mol
            </div>
          </div>

          {/* Calculations Display */}
          <div className="space-y-4">
            {molarMassResult.isValid ? (
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 text-left">
                <div className="flex justify-between items-end mb-3 border-b border-slate-205 pb-2">
                  <span className="text-xs text-slate-400 font-mono tracking-wider font-black uppercase">MINERAL: {molarMassResult.formula}</span>
                  <span className="text-base font-black text-emerald-600 font-mono" id="molar-mass-total-output">
                    {molarMassResult.totalMolarMass.toFixed(4)} <span className="text-xs font-sans font-medium text-slate-400">g/mol</span>
                  </span>
                </div>

                {/* Breakdown elements percent items */}
                <div className="space-y-3">
                  {molarMassResult.elements.map((el) => (
                    <div key={el.symbol} className="text-xs font-medium text-slate-700">
                      <div className="flex justify-between items-center text-xs tracking-tight text-slate-450 mb-1 bg-slate-100 p-1.5 rounded-lg border border-slate-200/50">
                        <span className="font-extrabold text-slate-800 font-mono">{el.symbol} <span className="font-sans text-slate-400 font-normal font-medium">({el.name})</span> × {el.count}</span>
                        <span className="font-mono text-slate-600 font-bold">{el.percentage.toFixed(2)}% • {(el.totalMass).toFixed(3)} g</span>
                      </div>
                      {/* Horizontal bar visualization */}
                      <div className="w-full bg-slate-220 bg-slate-200 rounded-full h-1.5 overflow-hidden mt-1">
                        <div
                          className="bg-emerald-600 h-1.5 rounded-full transition-all duration-350"
                          style={{ width: `${el.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-4 bg-rose-50 border border-rose-100 rounded-xl text-xs text-rose-700 text-left flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-rose-500" />
                <span>{molarMassResult.error || "Awaiting mineral formula entry..."}</span>
              </div>
            )}
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-105 flex items-center justify-between text-[10px] text-slate-400">
          <span>Standard IUPAC Weights</span>
          <span className="font-mono text-slate-400 font-bold">Fe=55.845, Cu=63.546, S=32.06, Ca=40.078</span>
        </div>
      </section>

      {/* Quick Formula Companion Table */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm text-left flex flex-col justify-between" id="reference-compounds-card">
        <div>
          <div className="mb-4 border-b border-slate-100 pb-3 flex items-center gap-1.5">
            <HelpCircle className="w-5 h-5 text-emerald-600" />
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">
              Metallurgical Mineral Library
            </h3>
          </div>
          
          <p className="text-xs text-slate-500 mb-4 font-medium leading-relaxed">
            Click on any common industrial mineral compound below to automatically analyze its atomic composition and percentage of metal fractions:
          </p>

          <div className="grid grid-cols-2 gap-2.5">
            {[
              { formula: "Fe2O3", name: "Hematite", desc: "Red iron ore mineral" },
              { formula: "CuFeS2", name: "Chalcopyrite", desc: "Primary copper ore sulfide" },
              { formula: "CaCO3", name: "Limestone", desc: "Smelting flux agglomerate" },
              { formula: "SiO2", name: "Silica Quartz", desc: "Acidic gangue impurity" },
              { formula: "CaSiO3", name: "Calcium Silicate", desc: "Smelting slag compound" },
              { formula: "Fe3O4", name: "Magnetite", desc: "Magnetic black iron ore" },
              { formula: "PbS", name: "Galena", desc: "Lead sulfide mineral" },
              { formula: "Al2O3", name: "Alumina", desc: "Oxide mineral substrate" }
            ].map((compound) => (
              <button
                key={compound.formula}
                onClick={() => setMolarMassInput(compound.formula)}
                className={`p-3 rounded-xl border text-left transition-all active:scale-[0.97] duration-100 cursor-pointer ${
                  molarMassInput === compound.formula
                    ? "bg-slate-900 border-slate-900 text-white shadow-sm"
                    : "bg-slate-50 border-slate-200 bg-slate-50 hover:bg-slate-100/70 text-slate-700"
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="text-xs font-black font-mono tracking-tight">{compound.formula}</span>
                  <span className={`text-[8px] font-black uppercase tracking-wider ${molarMassInput === compound.formula ? "text-emerald-400" : "text-slate-450"}`}>
                    Analyze
                  </span>
                </div>
                <div className="text-[10px] font-bold mt-1 truncate">{compound.name}</div>
                <div className={`text-[8px] truncate mt-0.5 ${molarMassInput === compound.formula ? "text-slate-300" : "text-slate-400"}`}>{compound.desc}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
          <span>Ref materials update live</span>
          <span className="font-mono text-slate-400 font-bold">Andrew Academy V2.2</span>
        </div>
      </section>
    </div>
  );
}
