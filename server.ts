import express from "express";
import path from "path";
import dns from "dns";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

// Ensure ipv4 resolves first to prevent potential local connection hiccups
dns.setDefaultResultOrder("ipv4first");

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Enable JSON request body parsing
  app.use(express.json());

  // Lazy initialize GoogleGenAI to prevent startup failures if GEMINI_API_KEY is not instantly set
  let aiClient: GoogleGenAI | null = null;
  function getGemini(): GoogleGenAI {
    if (!aiClient) {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error("GEMINI_API_KEY environment variable is missing. Please add it via Settings > Secrets.");
      }
      aiClient = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });
    }
    return aiClient;
  }

  // Schema for chemistry solvers
  const chemistryResponseSchema = {
    type: Type.OBJECT,
    properties: {
      summary: {
        type: Type.STRING,
        description: "A summary of the chemistry principles, concepts, and elements involved."
      },
      topic: {
        type: Type.STRING,
        description: "The detected specific chemistry field/topic (e.g., 'Stoichiometry', 'Acid-Base equilibria', 'Gas laws', 'Thermodynamics', 'Kinetics', 'Electrochemistry', 'Periodic Trends', 'Organic Chemistry')."
      },
      steps: {
        type: Type.ARRAY,
        description: "The detailed, step-by-step mathematical or conceptual instructions to solve the problem.",
        items: {
          type: Type.OBJECT,
          properties: {
            number: { type: Type.INTEGER },
            title: { type: Type.STRING, description: "Short active name of this step (e.g., 'Determine molar ratio', 'Convert mass to moles')." },
            explanation: { type: Type.STRING, description: "Detailed guide explaining what has been done, including relevant scientific definitions." },
            formula: { type: Type.STRING, description: "The core formula used here, if any (e.g. PV = nRT)." },
            calculation: { type: Type.STRING, description: "Explicit step calculations showing the inputs, units, and clear conversion paths." },
            result: { type: Type.STRING, description: "The output of this step with appropriate units and significant figures." }
          },
          required: ["number", "title", "explanation", "result"]
        }
      },
      finalAnswer: {
        type: Type.STRING,
        description: "The final answer with correct units and proper chemical notation/symbols."
      },
      chemicalEquations: {
        type: Type.ARRAY,
        description: "An array of balanced or skeleton equations involved in this problem, if applicable.",
        items: {
          type: Type.OBJECT,
          properties: {
            reactants: { type: Type.STRING, description: "Reactants with coefficients (e.g. 2 H2(g) + O2(g))" },
            products: { type: Type.STRING, description: "Products with coefficients (e.g. 2 H2O(l))" },
            arrow: { type: Type.STRING, description: "Double or single arrow, representing reversibility or unidirectional flow (e.g. '→', '⇌')" },
            balanced: { type: Type.BOOLEAN, description: "True if perfectly balanced." },
            notes: { type: Type.STRING, description: "Brief properties like 'exothermic', 'needs catalyst', etc." }
          },
          required: ["reactants", "products", "arrow", "balanced"]
        }
      },
      conceptualTakeaway: {
        type: Type.STRING,
        description: "A summary explaining the physical meaning, theoretical 'why', and a memory tip or standard student pitfall."
      },
      practiceQuestions: {
        type: Type.ARRAY,
        description: "Two multiple choice questions based on the exact same topic to help student practice.",
        items: {
          type: Type.OBJECT,
          properties: {
            questionText: { type: Type.STRING, description: "The multiple choice chemistry question prompt." },
            options: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Exactly 4 options representing possible answers."
            },
            correctOptionIndex: { type: Type.INTEGER, description: "Index of the correct answer (0, 1, 2, or 3)." },
            explanation: { type: Type.STRING, description: "A friendly explanation of why this option is correct and why other options are pitfalls." }
          },
          required: ["questionText", "options", "correctOptionIndex", "explanation"]
        }
      }
    },
    required: ["summary", "topic", "steps", "finalAnswer", "conceptualTakeaway", "practiceQuestions"]
  };

  // endpoint to solve chemistry questions
  app.post("/api/chemistry/solve", async (req, res) => {
    try {
      const { question, difficultyLevel } = req.body;
      if (!question || typeof question !== "string" || !question.trim()) {
        return res.status(400).json({ error: "Please enter a valid chemistry question." });
      }

      const ai = getGemini();

      const promptSystem = `You are Andrew, an elite Chemistry Professor at Andrew Academy, an interactive chemistry workspace. 
Your goal is to guide students step-by-step through solving chemistry equations, calculations, stoichiometry, nomenclature, trends, and thermodynamic problems.
To make your response extremely user-friendly:
- Keep the language clear, encouraging, warm, and easy to understand.
- Break down any advanced scientific terms or jargon with simple analogies where possible.
- Design explanations that focus on deep comprehension and build confidence.
- Format results cleanly with appropriate chemical formulas and units of measurement.
Always be accurate, warm, and pedagogically sound. Output clean responses obeying the exact requested JSON schema.
If the input question is NOT relevant to chemistry, still fill the JSON format but inside topic say 'General / Non-chemistry' and write a polite, helpful explanation in the 'summary' and 'finalAnswer' explaining that Andrew Academy specialized in Chemistry tutoring, then outline a basic related chemistry concept.`;

      const promptUser = `Solve this chemistry question:
"${question}"

Target understanding level: ${difficultyLevel || "High School / College Entry"}

Break the problem down logically, calculating values step-by-step, including intermediate equations, chemical formulas, and units in the explanation. Include 2 related multiple-choice questions for the user to practice with.`;

      const geminiResponse = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: promptUser,
        config: {
          systemInstruction: promptSystem,
          responseMimeType: "application/json",
          responseSchema: chemistryResponseSchema,
        },
      });

      const responseText = geminiResponse.text;
      if (!responseText) {
        throw new Error("Empty response received from chemistry AI.");
      }

      const solutionData = JSON.parse(responseText.trim());
      res.json(solutionData);
    } catch (error: any) {
      console.error("Chemistry Solver Error:", error);
      res.status(500).json({
        error: error.message || "An exception occurred while solving the problem. Please verify that your API key is correctly configured and try again.",
      });
    }
  });

  // Serve static UI elements and handle SPA routes
  if (process.env.NODE_ENV !== "production") {
    console.log("Starting server in development mode (Vite middleware enabled)...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Starting server in production mode (Serving static dist files)...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Andrew Academy server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Fatal server startup error:", err);
  process.exit(1);
});
