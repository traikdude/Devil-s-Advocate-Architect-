import { GoogleGenAI, Type, Schema } from "@google/genai";
import { AnalysisResponse, ValidationResponse, SynthesisResponse, QuickAnalysisResponse, Attachment } from "../types";

// Define the schema for structured output to ensure we get data for charts and UI
const analysisSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    hotkeyPath: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "The list of hotkeys used in the analysis logic (e.g., D11, R12)."
    },
    criticalAnalysisSummary: {
      type: Type.STRING,
      description: "A concise summary touching on the 8 key aspects of the framework."
    },
    devilsAdvocateView: {
      type: Type.STRING,
      description: "The comprehensive critical examination. This text MUST use markdown bold and italics frequently as requested."
    },
    riskMatrix: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          probability: { type: Type.INTEGER, description: "Scale 1-10" },
          impact: { type: Type.INTEGER, description: "Scale 1-10" },
          category: { type: Type.STRING, enum: ['Strategic', 'Operational', 'Financial', 'Reputational'] }
        },
        required: ["name", "probability", "impact", "category"]
      },
      description: "Extract the top 5-7 distinct risks for visualization."
    },
    riskMitigationPlan: {
      type: Type.STRING,
      description: "Concrete action steps with ownership and timelines."
    },
    decisionSynthesis: {
      type: Type.STRING,
      description: "Balanced recommendation and trade-off assessment."
    },
    confidenceLevel: {
      type: Type.STRING,
      enum: ["High", "Medium", "Low"]
    }
  },
  required: ["hotkeyPath", "criticalAnalysisSummary", "devilsAdvocateView", "riskMatrix", "riskMitigationPlan", "decisionSynthesis", "confidenceLevel"]
};

const validationSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    cognitiveBiasAudit: {
      type: Type.OBJECT,
      properties: {
        biasesDetected: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              present: { type: Type.BOOLEAN },
              details: { type: Type.STRING },
            },
            required: ["name", "present", "details"]
          }
        },
        debiasedRiskAssessment: { type: Type.STRING },
        calibratedConfidence: { type: Type.STRING, enum: ["High", "Medium", "Low"] }
      },
      required: ["biasesDetected", "debiasedRiskAssessment", "calibratedConfidence"]
    },
    strategicValidation: {
      type: Type.OBJECT,
      properties: {
        terrainAssessment: { type: Type.STRING, enum: ["Favorable", "Neutral", "Unfavorable"] },
        timingAssessment: { type: Type.STRING, enum: ["Now", "Wait", "Urgent"] },
        forceAssessment: { type: Type.STRING, enum: ["Superior", "Equal", "Inferior"] },
        conditionsAssessment: { type: Type.STRING, enum: ["Favorable", "Neutral", "Challenging"] },
        strategicImperatives: { type: Type.ARRAY, items: { type: Type.STRING } },
        inactionCosts: {
            type: Type.OBJECT,
            properties: {
                opportunityCost: { type: Type.STRING },
                competitiveCost: { type: Type.STRING },
                momentumCost: { type: Type.STRING },
            },
            required: ["opportunityCost", "competitiveCost", "momentumCost"]
        }
      },
      required: ["terrainAssessment", "timingAssessment", "forceAssessment", "conditionsAssessment", "strategicImperatives", "inactionCosts"]
    },
    validationSynthesis: {
      type: Type.OBJECT,
      properties: {
        cognitiveVerdict: { type: Type.STRING },
        strategicVerdict: { type: Type.STRING },
        legitimateConcerns: { type: Type.ARRAY, items: { type: Type.STRING } },
        concernsOverridden: { type: Type.ARRAY, items: { type: Type.STRING } },
        counterRecommendation: { type: Type.STRING },
        confidence: { type: Type.STRING, enum: ["High", "Medium", "Low"] },
        urgency: { type: Type.STRING, enum: ["Immediate", "Near-term", "Flexible"] }
      },
      required: ["cognitiveVerdict", "strategicVerdict", "legitimateConcerns", "concernsOverridden", "counterRecommendation", "confidence", "urgency"]
    }
  },
  required: ["cognitiveBiasAudit", "strategicValidation", "validationSynthesis"]
};

const synthesisSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    triangulatedAnalysis: {
      type: Type.OBJECT,
      properties: {
        thesisWeight: { type: Type.STRING, description: "Percentage and reasoning" },
        antithesisWeight: { type: Type.STRING, description: "Percentage and reasoning" },
        counterThesisWeight: { type: Type.STRING, description: "Percentage and reasoning" },
        integratedFindings: { type: Type.ARRAY, items: { type: Type.STRING } },
        resolvedConflicts: { type: Type.STRING }
      },
      required: ["thesisWeight", "antithesisWeight", "counterThesisWeight", "integratedFindings", "resolvedConflicts"]
    },
    finalRecommendation: {
      type: Type.OBJECT,
      properties: {
        verdict: { type: Type.STRING, enum: ["GO", "NO-GO", "CONDITIONAL GO", "MODIFY & GO"] },
        confidenceLevel: { type: Type.STRING, enum: ["High", "Medium", "Low"] },
        timingGuidance: { type: Type.STRING, enum: ["Immediate", "Near-term", "Flexible"] },
        resourceGuidance: { type: Type.STRING },
        keyDependencies: { type: Type.ARRAY, items: { type: Type.STRING } },
        criticalCaveats: { type: Type.ARRAY, items: { type: Type.STRING } }
      },
      required: ["verdict", "confidenceLevel", "timingGuidance", "resourceGuidance", "keyDependencies", "criticalCaveats"]
    },
    implementationPath: {
      type: Type.OBJECT,
      properties: {
        actions: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              action: { type: Type.STRING },
              owner: { type: Type.STRING },
              timeline: { type: Type.STRING }
            },
            required: ["action", "owner", "timeline"]
          }
        },
        earlyWarningIndicators: { type: Type.ARRAY, items: { type: Type.STRING } },
        pivotTriggers: { type: Type.ARRAY, items: { type: Type.STRING } },
        successCriteria: { type: Type.ARRAY, items: { type: Type.STRING } }
      },
      required: ["actions", "earlyWarningIndicators", "pivotTriggers", "successCriteria"]
    },
    matrixPosition: {
      type: Type.OBJECT,
      properties: {
        thesisStrength: { type: Type.STRING, enum: ["Strong", "Moderate", "Weak"] },
        riskStrength: { type: Type.STRING, enum: ["Weak risks", "Strong risks"] },
        validationStrength: { type: Type.STRING, enum: ["Validates thesis", "Overrides concerns", "Mixed validation", "Validates concerns"] }
      },
      required: ["thesisStrength", "riskStrength", "validationStrength"]
    }
  },
  required: ["triangulatedAnalysis", "finalRecommendation", "implementationPath", "matrixPosition"]
};

const quickAnalysisSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    summary: { type: Type.STRING },
    topRisk: { type: Type.STRING },
    primaryAlternative: { type: Type.STRING },
    recommendation: { type: Type.STRING },
    hotkeyPath: { 
      type: Type.ARRAY, 
      items: { type: Type.STRING },
      description: "List of hotkeys used, e.g. D11, D14"
    }
  },
  required: ["summary", "topRisk", "primaryAlternative", "recommendation", "hotkeyPath"]
};

// The massive system prompt defining the persona
const SYSTEM_PROMPT = `
You are the "Critical Decision Analysis and Devil's Advocate Framework" AI 👿. 
YOUR OUTPUT MUST ALWAYS CONTAIN EMOJIS IN EVERY SENTENCE.

Your Mission:
Provide comprehensive critical examination of decisions.
Strictly adhere to the "Devil's Advocate" persona: skeptical, rigorous, strategic, and balanced.

Framework Guidelines:
1. Risk Landscape (R)
2. Hidden Assumptions (R2)
3. Opposition Perspectives (C)
4. Alternative Approaches (A)
5. Psychological Factors (P1)
6. Power Dynamics (P2)
7. Mitigation Strategies (M)
8. Decision Synthesis (S)

You must analyze the user's decision input and generate a JSON response matching the schema provided. 
Ensure the "devilsAdvocateView" string is formatted with Markdown, specifically using ***bold italics*** for the core devil's advocate arguments.
Populate the "riskMatrix" with realistic estimations based on your analysis.
`;

const VALIDATION_SYSTEM_PROMPT = `
You are the Strategic Validation Specialist 🛡️. 
You combine Daniel Kahneman's Cognitive Science 🧠 with Sun Tzu's Strategic Wisdom ⚔️.
YOUR OUTPUT MUST ALWAYS CONTAIN EMOJIS IN EVERY SENTENCE.

Your task is to examine a Devil's Advocate analysis and determine which concerns are legitimate vs. which are cognitive distortions or strategic myopia.

Use the following framework:
1. Kahneman Cognitive Validation (System 1 vs 2, Biases like Anchoring, Availability, Loss Aversion).
2. Sun Tzu Strategic Validation (Terrain, Timing, Forces, Deception, Victory without Battle).
3. Counter-Argument Synthesis (Validating legitimate risks vs overriding biased ones).

You will receive:
1. The Original Decision
2. The Devil's Advocate Analysis

Produce a JSON response validating the analysis.
`;

const SYNTHESIS_SYSTEM_PROMPT = `
You are the Dialectical Integration Specialist 🔄.
YOUR OUTPUT MUST ALWAYS CONTAIN EMOJIS IN EVERY SENTENCE.

Your task is to perform the final Triangulated Synthesis of a decision process.
You will receive:
1. THESIS: Original Proposal
2. ANTITHESIS: Devil's Advocate Findings (Risks, Opposing views)
3. COUNTER-THESIS: Strategic Validation Findings (Bias checks, Strategy checks)

You must produce the Final Integrated Recommendation using the I-Framework (Triangulated Synthesis).
Determine the final verdict (GO / NO-GO / MODIFY) based on the "Decision Matrix Framework".
Provide a concrete implementation path.
`;

const QUICK_SYSTEM_PROMPT = `
You are the Quick Companion (Q-Framework) AI ⚡.
YOUR OUTPUT MUST ALWAYS CONTAIN EMOJIS IN EVERY SENTENCE.

Your Mission:
Provide a rapid, 1-page executive brief assessment of a daily decision.
Focus on:
1. Primary Risk Identifier (D111)
2. Primary Alternative Identifier (D131)
3. Quick Risk Mitigation (D14)
4. Final Recommendation (S13)

Be concise, direct, and actionable.
`;

// Helper to construct parts from input + attachments
const buildContents = (decisionInput: string, attachments: Attachment[] = []) => {
  const parts: any[] = [{ text: `Analyze this decision: "${decisionInput}"` }];
  
  // Use a map to track if we have URLs, to enable search if needed
  let hasUrl = false;

  attachments.forEach(att => {
    if (att.type === 'url') {
      parts.push({ text: `Consider this context URL: ${att.content}` });
      hasUrl = true;
    } else if (att.content && att.mimeType) {
       // Gemini expects base64 without the data:mime/type;base64, prefix
       const base64Data = att.content.split(',')[1] || att.content;
       parts.push({
         inlineData: {
           mimeType: att.mimeType,
           data: base64Data
         }
       });
    }
  });

  return { parts, hasUrl };
};

export const analyzeDecision = async (decisionInput: string, attachments: Attachment[] = []): Promise<AnalysisResponse> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const model = ai.models.getGenerativeModel({
      model: "gemini-2.5-flash-latest",
      systemInstruction: SYSTEM_PROMPT,
    });

    const { parts, hasUrl } = buildContents(decisionInput, attachments);

    // If we have URLs, we should ideally use Search Grounding if available, 
    // but for this implementation we rely on the model's ability to parse the URL string 
    // or (if enabled on the key) Search Grounding. 
    // We will add the tools config conditionally if needed, but here we just pass parts.
    const tools = hasUrl ? [{ googleSearch: {} }] : [];

    const result = await model.generateContent({
      contents: {
        role: "user",
        parts: parts
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
        thinkingConfig: { thinkingBudget: 1024 },
        tools: tools,
      }
    });

    const responseText = result.response.text();
    if (!responseText) {
      throw new Error("No response from AI 🛑");
    }

    return JSON.parse(responseText) as AnalysisResponse;

  } catch (error) {
    console.error("Analysis failed:", error);
    throw error;
  }
};

export const validateAnalysis = async (decisionInput: string, analysisOutput: AnalysisResponse): Promise<ValidationResponse> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const model = ai.models.getGenerativeModel({
      model: "gemini-2.5-flash-latest",
      systemInstruction: VALIDATION_SYSTEM_PROMPT,
    });

    const prompt = `
    ORIGINAL DECISION: "${decisionInput}"
    
    DEVIL'S ADVOCATE FINDINGS:
    Summary: ${analysisOutput.criticalAnalysisSummary}
    Devil's Advocate View: ${analysisOutput.devilsAdvocateView}
    Identified Risks: ${JSON.stringify(analysisOutput.riskMatrix)}
    
    Perform the Strategic Validation Assessment (Kahneman + Sun Tzu).
    `;

    const result = await model.generateContent({
      contents: {
        role: "user",
        parts: [{ text: prompt }]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: validationSchema,
        thinkingConfig: { thinkingBudget: 1024 }
      }
    });

    const responseText = result.response.text();
    if (!responseText) {
      throw new Error("No validation response from AI 🛑");
    }

    return JSON.parse(responseText) as ValidationResponse;

  } catch (error) {
    console.error("Validation failed:", error);
    throw error;
  }
};

export const performSynthesis = async (
  decisionInput: string, 
  analysisOutput: AnalysisResponse, 
  validationOutput: ValidationResponse
): Promise<SynthesisResponse> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const model = ai.models.getGenerativeModel({
      model: "gemini-2.5-flash-latest",
      systemInstruction: SYNTHESIS_SYSTEM_PROMPT,
    });

    const prompt = `
    PERFORM DIALECTICAL SYNTHESIS ON:
    
    1. THESIS (Original): "${decisionInput}"
    
    2. ANTITHESIS (Devil's Advocate):
    Risks: ${JSON.stringify(analysisOutput.riskMatrix)}
    Mitigation: ${analysisOutput.riskMitigationPlan}
    
    3. COUNTER-THESIS (Strategic Validation):
    Biases: ${JSON.stringify(validationOutput.cognitiveBiasAudit.biasesDetected)}
    Debiased Risk: ${validationOutput.cognitiveBiasAudit.debiasedRiskAssessment}
    Strategic Imperatives: ${JSON.stringify(validationOutput.strategicValidation.strategicImperatives)}
    Counter-Recommendation: ${validationOutput.validationSynthesis.counterRecommendation}
    
    Generate the Final Integrated Recommendation and Action Plan.
    `;

    const result = await model.generateContent({
      contents: {
        role: "user",
        parts: [{ text: prompt }]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: synthesisSchema,
        thinkingConfig: { thinkingBudget: 1024 }
      }
    });

    const responseText = result.response.text();
    if (!responseText) {
      throw new Error("No synthesis response from AI 🛑");
    }

    return JSON.parse(responseText) as SynthesisResponse;

  } catch (error) {
    console.error("Synthesis failed:", error);
    throw error;
  }
};

export const performQuickAnalysis = async (decisionInput: string, attachments: Attachment[] = []): Promise<QuickAnalysisResponse> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const model = ai.models.getGenerativeModel({
      model: "gemini-2.5-flash-latest",
      systemInstruction: QUICK_SYSTEM_PROMPT,
    });

    const { parts, hasUrl } = buildContents(`Quickly analyze this decision: "${decisionInput}"`, attachments);
    const tools = hasUrl ? [{ googleSearch: {} }] : [];

    const result = await model.generateContent({
      contents: {
        role: "user",
        parts: parts
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: quickAnalysisSchema,
        thinkingConfig: { thinkingBudget: 512 },
        tools: tools,
      }
    });

    const responseText = result.response.text();
    if (!responseText) {
      throw new Error("No response from AI 🛑");
    }

    return JSON.parse(responseText) as QuickAnalysisResponse;

  } catch (error) {
    console.error("Quick Analysis failed:", error);
    throw error;
  }
};

export const sendChatMessage = async (history: { role: string; parts: { text: string }[] }[], message: string): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const chat = ai.chats.create({
      model: "gemini-3-pro-preview",
      config: {
        systemInstruction: `You are the Devil's Advocate Architect Chatbot 👿.
YOUR OUTPUT MUST ALWAYS CONTAIN EMOJIS IN EVERY SENTENCE.
You assist users with understanding critical decision analysis, strategy, and risk mitigation.
You are helpful, strategic, and rigorous.`,
        thinkingConfig: {
            thinkingBudget: 32768
        }
      },
      history: history
    });

    const result = await chat.sendMessage(message);
    // Directly access text property
    return result.text;
  } catch (error) {
    console.error("Chat failed:", error);
    throw error;
  }
};