export enum Screen {
  Login,
  Dashboard,
  Analysis,
  AuditTrail,
  KnowledgeBase,
  Settings,
}

export type NavigateTo = (screen: Screen) => void;

export type Severity = 'critical' | 'warning';

export type FindingStatus = 'active' | 'resolved' | 'dismissed';

export interface Finding {
  id: string;
  title: string;
  severity: Severity;
  sourceSnippet: string;
  recommendation: string;
  status: FindingStatus;
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
  documentContent: string;
}

export interface User {
    name: string;
    email: string;
    avatar?: string; // For social logins
}

export type UserRole = 'Administrator' | 'Legal Reviewer' | 'Member';

export interface WorkspaceUser {
    id: string;
    name: string;
    email: string;
    role: UserRole;
}

export type FeedbackReason = "Not relevant to this project" | "This is a false positive" | "This is an accepted business risk";

export interface TourStep {
    selector: string;
    title: string;
    content: string;
    position?: 'top' | 'bottom' | 'left' | 'right';
}

export type AuditLogAction = 'User Login' | 'User Logout' | 'Social Login' | 'Analysis Run' | 'Document Upload' | 'Auto-Fix' | 'Finding Resolved' | 'Finding Dismissed';

export interface AuditLog {
    id: string;
    timestamp: string;
    user: string;
    action: AuditLogAction;
    details: string;
}

export interface KnowledgeSource {
    id: string;
    title: string;
    content: string;
}

export interface DismissalRule {
    id: string;
    findingTitle: string;
    reason: FeedbackReason;
    timestamp: string;
}