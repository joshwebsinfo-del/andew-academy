import { useState, useMemo } from "react";
import { Atom, Search } from "lucide-react";
import { ELEMENTS_DATA } from "../data/elements";
import { ElementData } from "../types";

// Element Category styler mapping helper
const getCategoryClass = (category: string) => {
  switch (category) {
    case "nonmetal":
      return "bg-sky-50 text-sky-800 border-sky-200 hover:bg-sky-100";
    case "noble-gas":
      return "bg-purple-100 text-purple-800 border-purple-200 hover:bg-purple-200";
    case "alkali-metal":
      return "bg-orange-100 text-orange-800 border-orange-200 hover:bg-orange-200";
    case "alkaline-earth":
      return "bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-200";
    case "metalloid":
      return "bg-teal-50 text-teal-800 border-teal-200 hover:bg-teal-100";
    case "halogen":
      return "bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100";
    case "transition-metal":
      return "bg-rose-100 text-rose-800 border-rose-200 hover:bg-rose-200";
    case "post-transition-metal":
      return "bg-slate-100 text-slate-800 border-slate-200 hover:bg-slate-200";
    default:
      return "bg-gray-50 text-gray-800 border-gray-200 hover:bg-gray-100";
  }
};

export default function PeriodicDesk() {
  const [periodicSearch, setPeriodicSearch] = useState("");
  const [selectedElement, setSelectedElement] = useState<ElementData | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("list"); // List mode starts as default for superior mobile navigation!

  // --- Filtered Elements logic ---
  const filteredElements = useMemo(() => {
    if (!periodicSearch.trim()) return ELEMENTS_DATA;
    return ELEMENTS_DATA.filter(
      (el) =>
        el.name.toLowerCase().includes(periodicSearch.toLowerCase()) ||
        el.symbol.toLowerCase().includes(periodicSearch.toLowerCase()) ||
        el.category.toLowerCase().includes(periodicSearch.toLowerCase())
    );
  }, [periodicSearch]);

  const searchLookupSet = useMemo(() => {
    return new Set(filteredElements.map((el) => el.number));
  }, [filteredElements]);

  return (
    <div className="space-y-6 animate-fadeIn" id="page-periodic">
      {/* Interactive Periodic Table Block Dashboard */}
      <section className="bg-slate-900 text-white rounded-2xl p-6 shadow-sm space-y-4 text-left" id="periodic-explorer">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <Atom className="w-5 h-5 text-emerald-400 animate-spin" style={{ animationDuration: "12s" }} />
            <h3 className="text-sm font-black text-slate-100 uppercase tracking-widest">
              Interactive Periodic Desk (Elements 1-36)
            </h3>
          </div>
          
          {/* Double View switch toggle for responsive layouts */}
          <div className="flex gap-1 bg-slate-800 p-1 rounded-xl text-[10px] font-black uppercase tracking-wider">
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                viewMode === "grid" ? "bg-emerald-600 text-white font-extrabold" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              📊 Grid View
            </button>
            <button
              type="button"
              onClick={() => setViewMode("list")}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                viewMode === "list" ? "bg-emerald-600 text-white font-extrabold" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              📋 Directory List
            </button>
          </div>
        </div>

        <p className="text-xs text-slate-300 font-medium leading-relaxed">
          Search the interactive desk elements below to view Bohr states, shell classifications and configurator statistics:
        </p>

        {/* Search & Statistics Controls */}
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
          <input
            type="text"
            value={periodicSearch}
            onChange={(e) => setPeriodicSearch(e.target.value)}
            placeholder="Type name, symbol, category (e.g. noble-gas)..."
            className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-10 pr-12 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:bg-slate-850 transition"
            id="periodic-search-input"
          />
          {periodicSearch && (
            <button 
              onClick={() => setPeriodicSearch("")}
              className="absolute right-3.5 top-3.5 text-[9px] hover:text-emerald-400 font-mono text-slate-500 uppercase font-black cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>

        {viewMode === "grid" ? (
          /* Compact scrolling Chemistry Grid */
          <div className="overflow-x-auto custom-scrollbar pb-3 border p-4 rounded-xl border-slate-800 bg-slate-950/40">
            <div 
              className="grid gap-1.5 min-w-[640px] pt-1"
              style={{ display: "grid", gridTemplateColumns: "repeat(18, minmax(0, 1fr))" }}
              id="periodic-grid-layout"
            >
              {ELEMENTS_DATA.map((element) => {
                const isHighlighted = searchLookupSet.has(element.number);
                const isCurrentlySelected = selectedElement && selectedElement.number === element.number;
                
                return (
                  <div
                    key={element.number}
                    onClick={() => setSelectedElement(element)}
                    style={{ gridRow: element.period, gridColumn: element.group }}
                    className={`group relative p-2 rounded border text-center cursor-pointer transition-all ${
                      isCurrentlySelected
                        ? "bg-emerald-600 border-white text-white scale-110 z-10 shadow-md shadow-emerald-500/20"
                        : isHighlighted
                          ? getCategoryClass(element.category)
                          : "bg-slate-800/10 border-slate-800/30 text-slate-600 opacity-20 hover:opacity-40"
                    }`}
                    title={`${element.name} (Atomic Weight: ${element.mass})`}
                    id={`periodic-tile-${element.symbol}`}
                  >
                    <div className="text-[8px] font-mono leading-none flex justify-between font-bold">
                      <span>{element.number}</span>
                    </div>
                    <div className="text-sm font-black tracking-wider leading-normal my-0.5">
                      {element.symbol}
                    </div>
                    <div className="text-[7px] font-mono leading-none truncate block">
                      {element.mass.toFixed(1)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* Interactive tap lists optimized perfectly for narrow screens */
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[300px] overflow-y-auto pr-1" id="periodic-list-layout">
            {filteredElements.map((element) => {
              const isCurrentlySelected = selectedElement && selectedElement.number === element.number;
              const isHighlight = searchLookupSet.has(element.number);
              
              if (!isHighlight) return null;
              
              return (
                <div
                  key={element.number}
                  onClick={() => setSelectedElement(element)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer flex justify-between items-center ${
                    isCurrentlySelected
                      ? "bg-emerald-600 border-white text-white shadow-md shadow-emerald-500/20"
                      : "bg-slate-800/30 hover:bg-slate-800/60 border-slate-800 text-slate-100"
                  }`}
                  id={`periodic-list-item-${element.symbol}`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-10 h-10 rounded-lg flex flex-col items-center justify-center font-bold font-mono text-center leading-none shrink-0 border ${
                      isCurrentlySelected 
                        ? "bg-emerald-700 border-emerald-600 text-white" 
                        : "bg-slate-900 border-slate-800 text-slate-200"
                    }`}>
                      <span className="text-[8px] text-slate-400 font-extrabold">{element.number}</span>
                      <span className="text-sm font-black tracking-wide mt-0.5">{element.symbol}</span>
                    </div>
                    <div className="text-left min-w-0">
                      <h4 className="text-xs font-bold truncate">{element.name}</h4>
                      <p className="text-[9px] text-slate-400 truncate uppercase mt-0.5 tracking-wider font-extrabold text-emerald-400">
                        {element.category.replace("-", " ")}
                      </p>
                    </div>
                  </div>
                  <div className="text-right shrink-0 font-mono text-[10px] pl-2 leading-tight">
                    <div className={isCurrentlySelected ? "text-emerald-100 font-bold" : "text-slate-400"}>{element.mass} g/mol</div>
                    <div className="text-[9px] text-slate-500 mt-1 font-sans">{element.state || "Solid"}</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Selected Element detail Drawer box if selected */}
        {selectedElement ? (
          <div className="bg-slate-900 bg-slate-950/75 rounded-xl p-5 border border-slate-800 text-left animate-fadeIn">
            <div className="flex justify-between items-start mb-3 border-b border-slate-800 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-black font-mono tracking-tight text-emerald-400">{selectedElement.symbol}</span>
                  <span className="text-sm text-slate-300 font-semibold">({selectedElement.name})</span>
                </div>
                <span className="text-[10px] uppercase tracking-wider font-extrabold text-emerald-500">
                  {selectedElement.category.replace("-", " ")}
                </span>
              </div>
              
              <div className="text-right">
                <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-black font-mono">No. {selectedElement.number}</span>
                <div className="text-xs font-mono text-slate-400 mt-1">{selectedElement.mass} g/mol</div>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed mb-4 italic font-medium">
              {selectedElement.summary}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-[11px] border-t border-slate-800/80 pt-4 font-semibold text-slate-300">
              <div className="bg-slate-900/40 p-2.5 rounded-lg border border-slate-800">
                <span className="text-slate-500 block mb-0.5">Electron Config:</span>
                <span className="font-mono text-emerald-450 text-emerald-400 text-xs">{selectedElement.configuration || "N/A"}</span>
              </div>
              <div className="bg-slate-900/40 p-2.5 rounded-lg border border-slate-800">
                <span className="text-slate-500 block mb-0.5">Electronegativity:</span>
                <span className="font-mono text-white text-xs">{selectedElement.electronegativity ?? "None"}</span>
              </div>
              <div className="bg-slate-900/40 p-2.5 rounded-lg border border-slate-800">
                <span className="text-slate-500 block mb-0.5">Physical State (STP):</span>
                <span className="text-white text-xs">{selectedElement.state || "Solid"}</span>
              </div>
              <div className="bg-slate-900/40 p-2.5 rounded-lg border border-slate-800">
                <span className="text-slate-500 block mb-0.5">Element Density:</span>
                <span className="font-mono text-white text-xs">{selectedElement.density || "N/A"}</span>
              </div>
            </div>

            <div className="mt-4 flex justify-end">
              <button 
                onClick={() => setSelectedElement(null)}
                className="text-xs bg-slate-800 hover:bg-slate-700 font-bold px-4 py-1.5 rounded-lg text-slate-300 hover:text-white transition cursor-pointer"
                id="close-element-detail"
              >
                Close Element Details
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-6 bg-slate-950/20 border border-dashed border-slate-800 rounded-xl text-xs text-slate-400 font-semibold">
            💡 Click on any chemistry element tile above to drill down into Detailed Specifications.
          </div>
        )}
      </section>
    </div>
  );
}
