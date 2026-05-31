import { ELEMENTS_DATA } from "../data/elements";

// Create a fast lookup map of elements to their atomic weights
const ELEMENT_WEIGHTS: Record<string, { name: string; mass: number }> = {};

// Populate from the high-res 1-36 database
ELEMENTS_DATA.forEach((el) => {
  ELEMENT_WEIGHTS[el.symbol] = { name: el.name, mass: el.mass };
});

// Supplement with common heavier elements to make the calculator extremely robust
const HEAVIER_ELEMENTS: Record<string, { name: string; mass: number }> = {
  Rb: { name: "Rubidium", mass: 85.468 },
  Sr: { name: "Strontium", mass: 87.62 },
  Y: { name: "Yttrium", mass: 88.906 },
  Zr: { name: "Zirconium", mass: 91.224 },
  Nb: { name: "Niobium", mass: 92.906 },
  Mo: { name: "Molybdenum", mass: 95.95 },
  Tc: { name: "Technetium", mass: 98 },
  Ru: { name: "Ruthenium", mass: 101.07 },
  Rh: { name: "Rhodium", mass: 102.915 },
  Pd: { name: "Palladium", mass: 106.42 },
  Ag: { name: "Silver", mass: 107.868 },
  Cd: { name: "Cadmium", mass: 112.414 },
  In: { name: "Indium", mass: 114.818 },
  Sn: { name: "Tin", mass: 118.71 },
  Sb: { name: "Antimony", mass: 121.76 },
  Te: { name: "Tellurium", mass: 127.6 },
  I: { name: "Iodine", mass: 126.904 },
  Xe: { name: "Xenon", mass: 131.293 },
  Cs: { name: "Caesium", mass: 132.905 },
  Ba: { name: "Barium", mass: 137.327 },
  La: { name: "Lanthanum", mass: 138.905 },
  Ce: { name: "Cerium", mass: 140.116 },
  Pr: { name: "Praseodymium", mass: 140.908 },
  Nd: { name: "Neodymium", mass: 144.242 },
  Pm: { name: "Promethium", mass: 145 },
  Sm: { name: "Samarium", mass: 150.36 },
  Eu: { name: "Europium", mass: 151.964 },
  Gd: { name: "Gadolinium", mass: 157.25 },
  Tb: { name: "Terbium", mass: 158.925 },
  Dy: { name: "Dysprosium", mass: 162.5 },
  Ho: { name: "Holmium", mass: 164.93 },
  Er: { name: "Erbium", mass: 167.259 },
  Tm: { name: "Thulium", mass: 168.934 },
  Yb: { name: "Ytterbium", mass: 173.054 },
  Lu: { name: "Lutetium", mass: 174.967 },
  Hf: { name: "Hafnium", mass: 178.49 },
  Ta: { name: "Tantalum", mass: 180.948 },
  W: { name: "Tungsten", mass: 183.84 },
  Re: { name: "Rhenium", mass: 186.207 },
  Os: { name: "Osmium", mass: 190.23 },
  Ir: { name: "Iridium", mass: 192.217 },
  Pt: { name: "Platinum", mass: 195.084 },
  Au: { name: "Gold", mass: 196.967 },
  Hg: { name: "Mercury", mass: 200.592 },
  Tl: { name: "Thallium", mass: 204.38 },
  Pb: { name: "Lead", mass: 207.2 },
  Bi: { name: "Bismuth", mass: 208.98 },
  Po: { name: "Polonium", mass: 209 },
  At: { name: "Astatine", mass: 210 },
  Rn: { name: "Radon", mass: 222 },
  Fr: { name: "Francium", mass: 223 },
  Ra: { name: "Radium", mass: 226 },
  Ac: { name: "Actinium", mass: 227 },
  Th: { name: "Thorium", mass: 232.038 },
  Pa: { name: "Protactinium", mass: 231.036 },
  U: { name: "Uranium", mass: 238.029 },
};

Object.assign(ELEMENT_WEIGHTS, HEAVIER_ELEMENTS);

export interface ComponentElementBreakdown {
  symbol: string;
  name: string;
  atomicMass: number;
  count: number;
  totalMass: number;
  percentage: number;
}

export interface MolarMassResult {
  formula: string;
  totalMolarMass: number;
  elements: ComponentElementBreakdown[];
  isValid: boolean;
  error?: string;
}

/**
 * Parses a chemical formula (including parentheses) and computes its molar mass.
 */
export function calculateMolarMass(rawFormula: string): MolarMassResult {
  const formula = rawFormula.replace(/\s+/g, ""); // Remove all whitespaces
  if (!formula) {
    return { formula: "", totalMolarMass: 0, elements: [], isValid: false, error: "Please enter a formula." };
  }

  // Basic validity check: balanced parentheses
  let openCount = 0;
  for (const char of formula) {
    if (char === "(") openCount++;
    if (char === ")") {
      openCount--;
      if (openCount < 0) {
        return { formula, totalMolarMass: 0, elements: [], isValid: false, error: "Malformed parenthesis bounds." };
      }
    }
  }
  if (openCount !== 0) {
    return { formula, totalMolarMass: 0, elements: [], isValid: false, error: "Unclosed parentheses detected." };
  }

  try {
    const counts: Record<string, number> = {};
    const regex = /([A-Z][a-z]*)(\d*)|(\()|(\))(\d*)/g;
    const stack: Record<string, number>[] = [{}];

    let match;
    let matchFound = false;

    while ((match = regex.exec(formula)) !== null) {
      matchFound = true;
      const [_, element, countStr, openParen, closeParen, multiplierStr] = match;

      if (element) {
        const count = countStr ? parseInt(countStr, 10) : 1;
        const current = stack[stack.length - 1];
        current[element] = (current[element] || 0) + count;
      } else if (openParen) {
        stack.push({});
      } else if (closeParen) {
        const current = stack.pop();
        if (!current) continue;
        const multiplier = multiplierStr ? parseInt(multiplierStr, 10) : 1;
        const parent = stack[stack.length - 1];
        for (const [el, val] of Object.entries(current)) {
          parent[el] = (parent[el] || 0) + val * multiplier;
        }
      }
    }

    if (!matchFound) {
      return { formula, totalMolarMass: 0, elements: [], isValid: false, error: "Invalid formula symbols." };
    }

    // Merge any outstanding items on the stack
    const finalCounts = stack[0];
    while (stack.length > 1) {
      const current = stack.pop();
      if (current) {
        for (const [el, val] of Object.entries(current)) {
          finalCounts[el] = (finalCounts[el] || 0) + val;
        }
      }
    }

    // Calculate elements breakdown
    const elementsBreakdown: ComponentElementBreakdown[] = [];
    let totalMolarMass = 0;
    const unrecognized: string[] = [];

    for (const [symbol, count] of Object.entries(finalCounts)) {
      const details = ELEMENT_WEIGHTS[symbol];
      if (!details) {
        unrecognized.push(symbol);
        continue;
      }

      const totalMass = details.mass * count;
      totalMolarMass += totalMass;

      elementsBreakdown.push({
        symbol,
        name: details.name,
        atomicMass: details.mass,
        count,
        totalMass,
        percentage: 0, // Calculated after total mass is locked in
      });
    }

    if (unrecognized.length > 0) {
      return {
        formula,
        totalMolarMass: 0,
        elements: [],
        isValid: false,
        error: `Unknown element symbol: ${unrecognized.join(", ")}`,
      };
    }

    if (elementsBreakdown.length === 0) {
      return { formula, totalMolarMass: 0, elements: [], isValid: false, error: "Please enter a valid chemical compound." };
    }

    // Assign final percentages
    elementsBreakdown.forEach((el) => {
      el.percentage = (el.totalMass / totalMolarMass) * 100;
    });

    // Sort by descending mass contribution
    elementsBreakdown.sort((a, b) => b.totalMass - a.totalMass);

    return {
      formula,
      totalMolarMass,
      elements: elementsBreakdown,
      isValid: true,
    };
  } catch (err: any) {
    return {
      formula,
      totalMolarMass: 0,
      elements: [],
      isValid: false,
      error: "Error compiling molecular parsing stack.",
    };
  }
}
