/**
 * Release criteria per rule (read-only). Displayed in rule detail Parameters tab.
 */
export interface ReleaseCriteria {
  releaseType: string;
  /** Auto Release Triggers */
  triggers: string[];
  /** Auto Release Parameters */
  parameters: string[];
}

export const RELEASE_CRITERIA_BY_RULE_ID: Record<string, ReleaseCriteria> = {
  AH001: {
    releaseType: 'Conditional',
    triggers: [
      'Release when current CNP rate (rolling 30 days) is below the 3-month average CNP rate + 10%, and CNP $ in batch < $2,000',
      'Day 1: auto release if criteria are met',
      'Day 2: prompt merchant to confirm the CNP transaction; Yes → release, No → investigator; add memo "Day 2 hit"',
      'Day 3: same criteria; if not met → investigator; memo "3X hit"',
      'Day 4: same criteria; if not met → investigator; memo "4X hit"',
      'Investigator needs ability to whitelist bank-change behavior (possibly 30 days)',
    ],
    parameters: [
      'Current month CNP rate',
      'Avg CNP rate over previous 3 months',
      'CNP $ in today\'s transactions',
      'Bank change date',
      '# of batches since bank change',
    ],
  },
  AH002: {
    releaseType: 'Conditional',
    triggers: [
      'Card Present: auto release if foreign % by $ for: last 90 days (rolling) is < 15%, and current 30 days (rolling, incl. this transaction) is < 15%. If not met → memo foreign counts/$ (90 days)',
      'Card Not Present: auto release if foreign % by $ for: last 90 days is < 10%, and current 30 days (rolling, incl. this transaction) is < 10%. If not met → memo foreign $/% and send to investigator',
      'Notes include an unfinished "IF CNP-" line (needs Risk clarification)',
    ],
    parameters: [
      'Foreign card % by $ (rolling 30 days)',
      'Foreign card % by $ (last 3 months)',
      'Foreign card % (last 3 months – days)',
      'Foreign card transaction count (last 3 months)',
    ],
  },
  AH003: {
    releaseType: 'Conditional',
    triggers: [
      'Requires no break in history (Risk-defined) and no EASI',
      'If 12+ months history: CP transaction: release if < 15% of modified high transaction avg (12 mo) and < 3 chargebacks/year; CNP transaction: release if < 10% of modified high transaction avg (12 mo) and < 3 chargebacks/year',
      'If < 12 months history: CP transaction: release if < 25% of modified high transaction avg (12 mo) and no chargebacks; CNP transaction: release if < 15% of modified high transaction avg (12 mo) and no chargebacks',
    ],
    parameters: [
      '12-month CP % (by transactions)',
      '12-month CNP % (by transactions)',
      'Modified high transaction average (12 mo): (monthly high tickets, remove < $300, remove next lowest and highest, compute avg)',
      'Total chargebacks in previous 90 days',
    ],
  },
  AH004: {
    releaseType: 'Auto',
    triggers: [
      'Billing files → auto release',
      'If 12-month history: No break in history (Risk-defined); < 3 chargebacks in last 12 months',
      'If a single transaction is ≥ 60% of batch total: card used before? prior card amount within +10% of current amount; no chargebacks on that card → Auto release',
    ],
    parameters: [
      'Billing file identified',
      'Break in history indicator (Risk "new merchant")',
      'Chargebacks in last 90 days',
      'High transaction in batch',
      'Batch total',
      'Card used before and amount comparison',
      'Chargeback history on that card',
    ],
  },
  AH005: {
    releaseType: 'Auto',
    triggers: [
      'If > 12 months on books and < 4 months "no processing" in last 12 months: Swiped high ticket today is < modified HT avg and < 3 chargebacks (12 mo) → auto release',
      'If investigator released 5X and no chargebacks in 45 days → auto release rule applies for next 45 days',
      'Card used before + no chargebacks (12 mo) + transaction < $2,000 → auto release',
      'Transaction < $1,500 and approved > $1,500 and swiped + no chargebacks (12 mo) → auto release',
    ],
    parameters: [
      'Account age (>12 mo)',
      'New merchant status (Risk)',
      '# months processing in last 12',
      'Swiped high ticket today',
      'Modified high ticket average',
      '# chargebacks last 12 mo',
      '# times released previously',
      '# chargebacks last 45 days',
      'Card used before (and comparisons)',
      'Transaction amount, approval amount',
    ],
  },
  AH006: {
    releaseType: 'Auto',
    triggers: [
      'If > 6 months history AND avg monthly volume > $25K AND avg swipe rate > 80% → auto release',
      'If > 6 months history AND avg monthly volume > $100K → auto release',
    ],
    parameters: [
      'Total prepaid $ (today)',
      '# months active history',
      'Avg monthly volume',
      'Avg swipe rate over 6 months',
    ],
  },
  AH007: {
    releaseType: 'Manual Review Only',
    triggers: ['None (not defined)'],
    parameters: ['None (not defined)'],
  },
  AH008: {
    releaseType: 'Auto',
    triggers: [
      'Scenario 1 (no break in processing): < 3 chargebacks in 12 mo; no chargebacks on card in question; transaction < modified HT avg + 5% (12 mo) → auto release',
      'Scenario 2 (12+ mo processing; break only 1 month): < 3 CB in 12 mo; no CB on card; transaction < modified HT avg (12 mo) → release',
      'Scenario 3 (12+ mo processing; ≤1 break in last 12 or none): < 3 CB in 12 mo; card used before at same merchant within 10% of current amount; no CB on that card → release',
    ],
    parameters: [
      'Modified high ticket average (12 mo)',
      'Breaks in processing (definition)',
      'Chargebacks (12 mo)',
      'Card usage history + amount comparison',
      'Transaction amount',
      'New merchant indicator',
      'EASI indicator',
    ],
  },
  AH009: {
    releaseType: 'Auto',
    triggers: ['Same structure as AH008, but for card-present ticket scenarios'],
    parameters: [
      'Modified high ticket average (12 mo)',
      'Breaks in processing',
      'Chargebacks (12 mo)',
      'Card usage history',
      'Transaction amount',
      'New merchant indicator',
      'EASI indicator',
    ],
  },
  AH010: {
    releaseType: 'Auto',
    triggers: ['If tip is within acceptable behavior thresholds based on merchant history (per trigger text)'],
    parameters: [
      'Tip amount / tip %',
      'Ticket amount',
      'Historical tipping pattern',
    ],
  },
  AH011: {
    releaseType: 'Auto',
    triggers: ['Auto release conditions defined in triggers (per rule row)'],
    parameters: [
      'Keyed transaction amount',
      'Account age',
      'Historical baseline for new accounts',
    ],
  },
  AH012: {
    releaseType: 'Auto',
    triggers: ['Auto release conditions defined in triggers (per rule row)'],
    parameters: [
      'Batch amount',
      'Account age',
      'Historical baseline for new accounts',
    ],
  },
  AH013: {
    releaseType: 'Auto',
    triggers: ['Auto release conditions defined in triggers (per rule row)'],
    parameters: [
      'Duplicate usage count',
      'Time window (30 days)',
      'Ticket amounts / distribution',
    ],
  },
  AH014: {
    releaseType: 'Auto',
    triggers: ['Auto release conditions defined in triggers (per rule row)'],
    parameters: [
      'Transaction amount',
      'Historical averages/peaks',
    ],
  },
  AH015: {
    releaseType: 'Auto',
    triggers: ['Auto release conditions defined in triggers (per rule row)'],
    parameters: [
      'Batch amount',
      'Historical averages/peaks',
    ],
  },
  AH016: {
    releaseType: 'Auto',
    triggers: ['Auto release conditions defined in triggers (per rule row)'],
    parameters: [
      'Presentment delay',
      'Historical presentment pattern',
    ],
  },
  AH017: {
    releaseType: 'Auto',
    triggers: ['Auto release conditions defined in triggers (per rule row)'],
    parameters: [
      'CNP %',
      'Account age',
      'Volume and ticket stats',
    ],
  },
  AH018: {
    releaseType: 'Auto',
    triggers: ['Auto release conditions defined in triggers (per rule row)'],
    parameters: [
      'Chargeback count / $',
      'Time window',
      'Volume comparisons',
    ],
  },
  AH019: {
    releaseType: 'Auto',
    triggers: ['Auto release conditions defined in triggers (per rule row)'],
    parameters: [
      'Daily volume',
      'Historical daily averages',
    ],
  },
  AH020: {
    releaseType: 'Auto',
    triggers: ['Auto release conditions defined in triggers (per rule row)'],
    parameters: [
      'Monthly volume',
      'Account age',
      'Historical ramp expectations',
    ],
  },
  AH021: {
    releaseType: 'Auto',
    triggers: ['Auto release conditions defined in triggers (per rule row)'],
    parameters: [
      'Monthly volume',
      'Historical monthly averages',
    ],
  },
  AH022: {
    releaseType: 'Auto',
    triggers: ['Auto release conditions defined in triggers (per rule row)'],
    parameters: [
      'Refund amount/count',
      'Sales volume',
      'Refund ratio',
    ],
  },
  AH023: {
    releaseType: 'Auto',
    triggers: ['Auto release conditions defined in triggers (per rule row)'],
    parameters: [
      'Net batch amount',
      'Refund activity',
    ],
  },
  AH024: {
    releaseType: 'Auto',
    triggers: ['Auto release conditions defined in triggers (per rule row)'],
    parameters: [
      'Refund $',
      'Historical refund levels',
    ],
  },
  AH025: {
    releaseType: 'Auto',
    triggers: ['Auto release conditions defined in triggers (per rule row)'],
    parameters: [
      'Duplicate count',
      '24-hour window',
      'Ticket distribution',
    ],
  },
  AH026: {
    releaseType: 'Auto',
    triggers: ['Auto release conditions defined in triggers (per rule row)'],
    parameters: [
      'BIN count/distribution',
      'Time window',
    ],
  },
  AH027: {
    releaseType: 'Auto',
    triggers: ['Auto release conditions defined in triggers (per rule row)'],
    parameters: [
      'Small-ticket count',
      'Avg ticket',
      'Volume patterns',
    ],
  },
  AH028: {
    releaseType: 'Auto (with escalation)',
    triggers: [
      'Fires only on the day the CNP % crosses the threshold',
      'Scenario 1: remove recurring billing transactions; recompute; if CNP % (30 days) < 3-mo avg +10% → release',
      'Scenario 2: if rolling 30-day volume < $5K AND avg ticket < $250 AND swipe rate > 80% → release',
      'Scenario 3: if volume < $20K AND CNP% > 80% AND avg ticket < $100 → release',
      'Scenario 4: if merchant > 12 mo with no breaks AND avg CP rate > 80% AND no CB (12 mo) AND volume < $40K (12-mo avg) → release',
      'Scenario 5: if this is the 5th auto-hold within 30 days (even if previously auto-released): do not release, send to investigator; memo "5th auto release for AH28"',
    ],
    parameters: [
      'Today\'s CNP% + overall CNP%',
      'Last 3-mo CNP%',
      'Recurring billing identification',
      '30-day CNP rate and avg',
      'Current month volume $',
      'Avg transaction amount',
      'Swipe rate',
      'Months onboard + breaks in last 12 mo',
      '# times rule fired in rolling 30 days',
    ],
  },
  AH029: {
    releaseType: 'Auto',
    triggers: ['Auto release conditions defined in triggers (per rule row)'],
    parameters: [
      'Refund %',
      'Refund $',
      'Sales volume',
    ],
  },
  AH030: {
    releaseType: 'Auto',
    triggers: ['Auto release conditions defined in triggers (per rule row)'],
    parameters: [
      'ACH amount / frequency',
      'Time window metrics',
    ],
  },
};

export function getReleaseCriteria(ruleId: string): ReleaseCriteria | undefined {
  return RELEASE_CRITERIA_BY_RULE_ID[ruleId];
}
