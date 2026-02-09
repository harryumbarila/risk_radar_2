/**
 * Release criteria per rule (read-only). Displayed in rule detail Parameters tab.
 */
export interface ReleaseCriteria {
  releaseType: 'Conditional' | 'Auto' | 'Never';
  /** Bullet points for "Auto-Release Allowed When" (or single line for Never). */
  conditions: string[];
  /** Optional "If Not Met" text (e.g. AH001). */
  ifNotMet?: string;
}

export const RELEASE_CRITERIA_BY_RULE_ID: Record<string, ReleaseCriteria> = {
  AH001: {
    releaseType: 'Conditional',
    conditions: [
      'Current month CNP rate < 12-month historical average',
      'No EASI flags present',
    ],
    ifNotMet: 'Await merchant confirmation → Manual review if unresolved',
  },
  AH002: {
    releaseType: 'Conditional',
    conditions: [
      'Card-present transactions',
      'Foreign card % below merchant threshold',
      'No EASI',
    ],
  },
  AH003: {
    releaseType: 'Conditional',
    conditions: [
      'No break in 12-month history',
      'CP % exceeds modified high-transaction baseline',
      'No EASI',
    ],
  },
  AH004: {
    releaseType: 'Auto',
    conditions: [
      'Billing file present',
      'No break in history',
      'No EASI',
    ],
  },
  AH005: {
    releaseType: 'Auto',
    conditions: [
      'Account >12 months on books',
      '<3 chargebacks in last 12 months',
      'No EASI',
    ],
  },
  AH006: {
    releaseType: 'Conditional',
    conditions: [
      'Prepaid % below threshold',
      'Below historical prepaid % average',
      'No EASI',
    ],
  },
  AH007: {
    releaseType: 'Never',
    conditions: ['Not allowed under any circumstance'],
  },
  AH008: {
    releaseType: 'Conditional',
    conditions: ['No break in history', 'No EASI'],
  },
  AH009: {
    releaseType: 'Conditional',
    conditions: ['No break in history', 'No EASI'],
  },
  AH010: {
    releaseType: 'Conditional',
    conditions: [
      'Tip behavior aligns with historical pattern',
      'No EASI',
    ],
  },
  AH011: {
    releaseType: 'Conditional',
    conditions: ['No break in history', 'No EASI'],
  },
  AH012: {
    releaseType: 'Conditional',
    conditions: ['No break in history', 'No EASI'],
  },
  AH013: {
    releaseType: 'Conditional',
    conditions: [
      'Usage returns to historical pattern',
      'No EASI',
    ],
  },
  AH014: {
    releaseType: 'Conditional',
    conditions: ['No break in history', 'No EASI'],
  },
  AH015: {
    releaseType: 'Conditional',
    conditions: ['No break in history', 'No EASI'],
  },
  AH016: {
    releaseType: 'Conditional',
    conditions: [
      'Presentment behavior aligns with historical norms',
      'No EASI',
    ],
  },
  AH017: {
    releaseType: 'Conditional',
    conditions: [
      'Current CNP % below threshold',
      'No EASI',
    ],
  },
  AH018: {
    releaseType: 'Conditional',
    conditions: [
      'Chargebacks align with historical trend',
      'No EASI',
    ],
  },
  AH019: {
    releaseType: 'Conditional',
    conditions: [
      'Activity aligns with historical pattern',
      'No EASI',
    ],
  },
  AH020: {
    releaseType: 'Conditional',
    conditions: [
      'Volume aligns with historical behavior',
      'No EASI',
    ],
  },
  AH021: {
    releaseType: 'Conditional',
    conditions: [
      'Volume aligns with historical behavior',
      'No EASI',
    ],
  },
  AH022: {
    releaseType: 'Conditional',
    conditions: [
      'Refund behavior aligns with historical norms',
      'No EASI',
    ],
  },
  AH023: {
    releaseType: 'Conditional',
    conditions: [
      'Negative settlement aligns with expected settlement behavior',
      'No EASI',
    ],
  },
  AH024: {
    releaseType: 'Conditional',
    conditions: [
      'Refund amount aligns with historical pattern',
      'No EASI',
    ],
  },
  AH025: {
    releaseType: 'Conditional',
    conditions: [
      'Repeat usage aligns with business model',
      'No EASI',
    ],
  },
  AH026: {
    releaseType: 'Conditional',
    conditions: [
      'BIN usage aligns with historical pattern',
      'No EASI',
    ],
  },
  AH027: {
    releaseType: 'Conditional',
    conditions: [
      'Small-amount volume aligns with expected activity',
      'No EASI',
    ],
  },
  AH028: {
    releaseType: 'Conditional',
    conditions: [
      'CNP % aligns with historical pattern',
      'No EASI',
    ],
  },
  AH029: {
    releaseType: 'Conditional',
    conditions: [
      'Refund % aligns with historical behavior',
      'No EASI',
    ],
  },
  AH030: {
    releaseType: 'Conditional',
    conditions: [
      'ACH return behavior aligns with historical pattern',
      'No additional risk flags present',
    ],
  },
};

export function getReleaseCriteria(ruleId: string): ReleaseCriteria | undefined {
  return RELEASE_CRITERIA_BY_RULE_ID[ruleId];
}
