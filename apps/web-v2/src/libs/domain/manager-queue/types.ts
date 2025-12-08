export interface ManagerQueueItem {
  id: string;
  dbaName: string;
  mid: string;
  reasonForReview: string;
  riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  assignedAnalyst: string | null;
  processor: string;
  exceptionsTriggered: number;
  triggeredRules: string[]; // Array of rule IDs (e.g., ['AH001', 'AH003', 'AH005'])
  status: 'Pending' | 'In-Review' | 'Completed';
  submittedOn: string;
  lastActivity: string;
  mcc?: string;
}

export interface AnalystWorkload {
  analyst: string;
  assignedItems: number;
  escalations: number;
  averageReviewTime: string;
  onHoldItems: number;
  slaBreaches: number;
}

export interface ManagerQueueFilters {
  dateRange: 'today' | '7' | '14' | '30' | 'custom';
  customStartDate?: string;
  customEndDate?: string;
  analyst: 'all' | string;
  queueType: 'all' | 'needs-review' | 'escalations' | 'pending-assignment';
  processor: 'all' | 'TSYS' | 'FSP';
  mcc: string;
  mid: string;
}

export interface OverviewCardData {
  title: string;
  count: number;
  trend: number; // percentage change vs previous week
  trendDirection: 'up' | 'down' | 'neutral';
  subtitle?: string;
}

