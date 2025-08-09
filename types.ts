
export enum Screen {
  Login,
  Dashboard,
  AuditTrail,
  KnowledgeBase,
  Settings,
  Upload,
  AnalysisInProgress,
  Report,
  Improving,
  ImprovedReport,
}

export type NavigateTo = (screen: Screen) => void;

export type Severity = 'critical' | 'warning';

export interface Finding {
  id: string;
  title: string;
  severity: Severity;
  sourceSnippet: string;
  recommendation: string;
}

export interface AnalysisReport {
  title: string;
  resilienceScore: number;
  findings: Finding[];
  summary: {
    critical: number;
    warning: number;
    checks: number;
  };
}

export interface User {
    name: string;
    email: string;
}