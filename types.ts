export interface RiskPoint {
  name: string;
  probability: number; // 1-10
  impact: number; // 1-10
  category: 'Strategic' | 'Operational' | 'Financial' | 'Reputational';
}

export interface Attachment {
  id: string;
  type: 'image' | 'video' | 'file' | 'url';
  content: string; // Base64 string for files, URL string for links
  mimeType?: string;
  name: string;
}

export interface AnalysisResponse {
  hotkeyPath: string[];
  criticalAnalysisSummary: string;
  devilsAdvocateView: string; // This needs to be formatted boldly
  riskMatrix: RiskPoint[];
  riskMitigationPlan: string;
  decisionSynthesis: string;
  confidenceLevel: 'High' | 'Medium' | 'Low';
}

export interface QuickAnalysisResponse {
  summary: string;
  topRisk: string;
  primaryAlternative: string;
  recommendation: string;
  hotkeyPath: string[];
}

export interface ValidationResponse {
  cognitiveBiasAudit: {
    biasesDetected: {
      name: string;
      present: boolean;
      details: string;
    }[];
    debiasedRiskAssessment: string;
    calibratedConfidence: 'High' | 'Medium' | 'Low';
  };
  strategicValidation: {
    terrainAssessment: 'Favorable' | 'Neutral' | 'Unfavorable';
    timingAssessment: 'Now' | 'Wait' | 'Urgent';
    forceAssessment: 'Superior' | 'Equal' | 'Inferior';
    conditionsAssessment: 'Favorable' | 'Neutral' | 'Challenging';
    strategicImperatives: string[];
    inactionCosts: {
      opportunityCost: string;
      competitiveCost: string;
      momentumCost: string;
    };
  };
  validationSynthesis: {
    cognitiveVerdict: string;
    strategicVerdict: string;
    legitimateConcerns: string[];
    concernsOverridden: string[];
    counterRecommendation: string;
    confidence: 'High' | 'Medium' | 'Low';
    urgency: 'Immediate' | 'Near-term' | 'Flexible';
  };
}

export interface SynthesisResponse {
  triangulatedAnalysis: {
    thesisWeight: string;
    antithesisWeight: string;
    counterThesisWeight: string;
    integratedFindings: string[];
    resolvedConflicts: string;
  };
  finalRecommendation: {
    verdict: 'GO' | 'NO-GO' | 'CONDITIONAL GO' | 'MODIFY & GO';
    confidenceLevel: 'High' | 'Medium' | 'Low';
    timingGuidance: 'Immediate' | 'Near-term' | 'Flexible';
    resourceGuidance: string;
    keyDependencies: string[];
    criticalCaveats: string[];
  };
  implementationPath: {
    actions: { action: string; owner: string; timeline: string }[];
    earlyWarningIndicators: string[];
    pivotTriggers: string[];
    successCriteria: string[];
  };
  matrixPosition: {
    thesisStrength: 'Strong' | 'Moderate' | 'Weak';
    riskStrength: 'Weak risks' | 'Strong risks';
    validationStrength: 'Validates thesis' | 'Overrides concerns' | 'Mixed validation' | 'Validates concerns';
  };
}

export interface HotkeyDef {
  code: string;
  label: string;
  description: string;
}

export type FrameworkMode = 'quick' | 'advocate' | 'validate' | 'synthesize' | 'full';