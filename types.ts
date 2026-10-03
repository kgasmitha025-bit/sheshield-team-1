export type Language = 'en' | 'ta';

export type RiskLevel = 'low' | 'medium' | 'high';

export interface AnalysisResult {
  success: boolean;
  isDemoAnalysis?: boolean;
    confidence?: number;
  riskLevel: RiskLevel;
  riskScore: number;
  category: string;
  summaryTitle: string;
  summaryDesc: string;
  reasons: string[];
  timestamp?: string;
  suggestedSections?: string[];
}

export interface EvidenceItem {
  id: string;
  type: 'image' | 'text';
  title: string;
  content: string; // text message or file name / description
  previewUrl?: string;
  timestamp: string;
  riskLevel: RiskLevel;
  riskScore: number;
  category: string;
  reasons: string[];
  accusedInfo?: string;
  platform?: string;
  notes?: string;
}

export interface LegalStatute {
  code: string;
  titleEn: string;
  titleTa: string;
  descriptionEn: string;
  descriptionTa: string;
  penaltyEn: string;
  penaltyTa: string;
  badge: string;
}

