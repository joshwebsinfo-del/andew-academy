/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ChemistryStep {
  number: number;
  title: string;
  explanation: string;
  formula?: string;
  calculation?: string;
  result: string;
}

export interface ChemicalEquation {
  reactants: string;
  products: string;
  arrow: string;
  balanced: boolean;
  notes?: string;
}

export interface PracticeQuestion {
  questionText: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
}

export interface ChemistrySolution {
  summary: string;
  topic: string;
  steps: ChemistryStep[];
  finalAnswer: string;
  chemicalEquations?: ChemicalEquation[];
  conceptualTakeaway: string;
  practiceQuestions: PracticeQuestion[];
}

export interface SavedProblem {
  id: string;
  question: string;
  timestamp: string;
  difficultyLevel: string;
  solution: ChemistrySolution;
}

export interface ElementData {
  number: number;
  symbol: string;
  name: string;
  mass: number;
  category: "nonmetal" | "noble-gas" | "alkali-metal" | "alkaline-earth" | "metalloid" | "halogen" | "transition-metal" | "post-transition-metal" | "lanthanide" | "actinide";
  group: number;
  period: number;
  electronegativity?: number;
  configuration?: string;
  state?: "Gas" | "Liquid" | "Solid" | "Synthetic";
  density?: string; // e.g. "0.00008988 g/cm³"
  meltingPoint?: number; // Kelvin
  boilingPoint?: number; // Kelvin
  summary?: string;
}
