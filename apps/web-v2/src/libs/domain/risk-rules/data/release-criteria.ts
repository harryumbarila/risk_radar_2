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
      'Auto Release: Current CNP (rolling 30 days) rate is lower than CNP rate (avg of previous 3 mo). If this number is lower than the CNP avg (3 mo) + 10% and CNP $ in Batch is less than $2000 → Auto release day 1',
      'Second day occurs: Pop up, CNP trans in question, did you process this trans? If yes, auto release. If no, send to investigator. Memo second day hit on AH001',
      'Day 3: Auto Release if current CNP (rolling 30 days) rate is lower than CNP rate (avg of previous 3 mo), lower than CNP avg (3 mo) + 10%, and CNP $ in Batch is less than $2000. If not, send to investigator, auto memo 3X hit on AH001',
      'Day 4: Auto Release if current CNP (Rolling 30 day avg) rate is lower than CNP rate (avg of previous 3 mo) and lower than CNP avg (3 mo) + 10%. If not, send to investigator, auto memo 4X hit on AH001',
      'Investigator will need the ability to white label this bank change. Possibly allow the ability to white label this rule for 30 days only',
    ],
    parameters: [
      'Current month CNP rate',
      'Avg CNP rate over previous 3 months',
      'CNP $ in todays transactions',
      'Bank change date',
      'Track # of batches post banking change',
    ],
  },
  AH002: {
    releaseType: 'Conditional',
    triggers: [
      'IF card present: foreign card % by $ for rolling 90 days is <15% AND current 30 days (rolling), including this transaction is <15%, release. If not, memo foreign card count, $ and % for 90 days',
      'IF CNP: foreign card % by $ for rolling 90 days is < 10% AND current 30 days (rolling), including this transaction is <10%, release. If not memo foreign card $ , % in memo and send to investigator',
    ],
    parameters: [
      'Foreign Card % by $ for rolling 30 days',
      'Foreign Card % by $ for last 3 months',
      'Foreign card % last 3 months - days',
      'Foreign card transaction count last 3 months',
    ],
  },
  AH003: {
    releaseType: 'Conditional',
    triggers: [
      'No Break in history (Risk Defined) / No EASI',
      'If 12+ MO history and: CP - if less than 15% of the (modified) high trans in last 12 mo, less than 3 CB in year; release. CNP - if less than 10% of the (modified) high trans in last 12 mo, less than 3 CB in year; release',
      'If Less than 12 mo history: CP if less than 25% of the (modified) high trans in last 12 mo, no CB in year; release. CNP if less than 15% of the (modified) high trans in last 12 mo, no CB in year; release',
    ],
    parameters: [
      '12 MO CP % by trans',
      'Modified High Trans 12 mo average (monthly high tickets for 12 mo, remove < $300, remove next lowest and highest, avg)',
      'Total CB in previous 90 days',
    ],
  },
  AH004: {
    releaseType: 'Auto',
    triggers: [
      'Billing files are auto release',
      'If 12 mo history: No break in history (risk defined) / <3 cb in 12 mo',
      'If an individual transaction is greater than or equal to 60% of batch total: Card used before? Amount is within 10% of current amount. And no chargeback on card → Auto release',
    ],
    parameters: [
      'Billing file identified',
      'Break in history indicator (new merchant)',
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
      'If greater than 12 MO on books, and has less than 4 MO no processing in last 12 mo, and HT swiped in today batch and is less than HT modified high ticket over last 12 mo; release. Less than 3 CB in year; release. If not, send to investigator',
      'If investigator released 5X and no CB in 45 days, allow auto release 45 days',
      'Card used before and no CB in year and amount less than $2000; release',
      'Trans less than 1500 and approved over 1500 and swiped and no CB 12 mo; release',
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
      'If more than 6 mo history and avg monthly vol is over 25K and avg swipe rate is over 80% over last 6 mo, release',
      'If more than 6 mo history and avg monthly vol is over 100K, release',
    ],
    parameters: [
      'Prepaid total $ today',
      '# months active history',
      'Avg monthly volume',
      'Avg swipe rate over 6 months',
    ],
  },
  AH007: {
    releaseType: 'Manual Review Only',
    triggers: ['(No auto release triggers defined)'],
    parameters: ['(No auto release parameters defined)'],
  },
  AH008: {
    releaseType: 'Auto',
    triggers: [
      'Scenario 1: no break in processing: Less than 3 CB in 12 mo / no CB on card in question / trans less than modified HT avg +5% 12 mo release',
      'Scenario 2: 12+ mo processing: Break only 1 month / <3 CB 12 mo / no CB on card / trans less than modified HT avg 12 mo release',
      'Scenario 3: 12+ mo processing: Less than 1 break in 12 mo / none / <3 CB 12 mo / card used before at same merchant within 10% of current amount and no CB on card, release',
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
    triggers: [
      'Scenario 1: no break in processing: Less than 3 CB in 12 mo / no CB on card in question / trans less than modified HT avg +5% 12 mo release',
      'Scenario 2: 12+ mo processing: Break only 1 month / <3 CB 12 mo / no CB on card / trans less than modified HT avg 12 mo release',
      'Scenario 3: 12+ mo processing: Less than 1 break in 12 mo / none / <3 CB 12 mo / card used before at same merchant within 10% of current amount and no CB on card, release',
    ],
    parameters: [
      'CNP high-ticket transaction amount (today)',
      'Percent of prior month processing volume (must be > 10%)',
      'Minimum transaction amount: $1,000',
      'EASI flag (label present / not present)',
      'Number of breaks in processing in the last 12 months',
      'Number of chargebacks in the last 12 months',
      'Chargebacks on the transaction/card in question',
      'Modified High Ticket Average (12-month method)',
      'Number of months processing history',
      'Card usage history (card used previously at this merchant)',
      'High-ticket on the same card in the last 12 months at this merchant',
    ],
  },
  AH010: {
    releaseType: 'Auto',
    triggers: [
      'Auto Release Condition: If the dollar value of the tip amount in question is less than 5% over the current month volume → Auto release',
      'Validations: Only fires on the day of the transaction. Calculation is based on the amount settled, NOT the original authorization. Confirm whether any MCC exclusions apply (if removed, documentation required)',
    ],
    parameters: [
      'Total dollar value of over-tip transactions today',
      'Current month volume',
      'MCC code',
    ],
  },
  AH011: {
    releaseType: 'Auto',
    triggers: [
      'Scenario 1: Greater than 12 months on board AND only one break in processing in the last 12 months. No chargebacks in the last 12 months. No chargebacks on the same card. Overall CNP rate less than 10% (based on last 3-month modified average; do NOT count break in processing). Volume greater than $10K → Auto release',
      'Scenario 2: At least 60 days of processing history. No chargebacks. Volume greater than $100K in previous month. Card-present rate greater than 90% → Auto release',
    ],
    parameters: [
      'Total dollar value of keyed transactions today',
      'New merchant flag (Risk-defined)',
      'Number of months on board',
      'Breaks in processing in last 12 months',
      'Chargebacks in last 12 months',
      'Chargebacks on high-ticket keyed card today',
      'CNP rate today',
      'Last 3-month modified CNP average',
      'Current month volume',
      '60 days of consistent processing indicator',
      'Chargebacks in last 60 days',
      'Volume last 2 months',
      'CP rate last 2 months',
    ],
  },
  AH012: {
    releaseType: 'Auto',
    triggers: [
      'Auto Release Conditions: Not month 1 merchant (Risk-defined). Card-present (CP) rate greater than 95% (based on previous month and current month). Volume greater than $200K in previous month processing → Auto release',
    ],
    parameters: [
      'New merchant status (Risk-defined)',
      'Number of months in merchant status',
      'CP rate (current month)',
      'CP rate (previous month)',
      'Volume in previous month',
    ],
  },
  AH013: {
    releaseType: 'Auto',
    triggers: [
      'General Conditions: Non-entertainment MCC. Non-food MCC',
      'Scenario 1 — Card Present (CP): Greater than 6 months of processing history. Card in question is CP. Volume on this card is less than 15% of overall volume in the same time period. No chargebacks on the card. Less than 3 chargebacks overall in last 6 months → Auto release',
      'Scenario 2 — Card Not Present (CNP): Greater than 9 months of processing history. Card in question is CNP. No chargebacks on the card. Volume on this card is less than 10% of overall volume in the same time period → Auto release',
    ],
    parameters: [
      'Number of times the same card was used in rolling 30 days',
      'Total dollar amount of same card use in rolling 30 days',
      'Number of months processing history',
      'Card type in question (CP or CNP)',
      'Volume in rolling 30 days',
      'Chargebacks on the card in question',
      'Chargebacks in last 6 months',
    ],
  },
  AH014: {
    releaseType: 'Auto',
    triggers: [
      'General Conditions: No EASI flag',
      'Primary Auto Release Scenario: Not month 1 merchant (no month 1 auto release). Card-present (CP) transaction. No break in processing in last 12 months (Risk-defined). Fewer than 3 chargebacks in last 12 months AND no chargeback on the transaction in question. Transaction amount is less than Modified High Ticket Average + 5% over last 12 months. Dollar value of transaction is less than 20% of rolling 30-day volume → Auto release',
      'Scenario 2 — Previously Used Card: Not month 1 merchant. If CP and card has been previously used: No chargebacks on the card; Total same-card use over 30 days AND transaction amount on card are less than 20% of volume in same rolling 30 days → Auto release. If CNP and card has been previously used: No chargebacks on the card; Total same-card use over 30 days AND transaction amount on card are less than 15% of volume in same rolling 30 days → Auto release',
      'Scenario 3: Not month 1 merchant. CNP transaction. No break in processing in last 12 months. Fewer than 3 chargebacks in last 12 months AND no chargeback on transaction in question → Auto release',
    ],
    parameters: [
      'Dollar value of high transaction(s) in today\'s batch',
      'CP or CNP indicator for high transaction',
      'EASI identification',
      'Number of months processing',
      'Break in processing in last 12 months',
      'Chargebacks in last 12 months',
      'Modified High Ticket Average',
      'Rolling 30-day volume',
    ],
  },
  AH015: {
    releaseType: 'Auto',
    triggers: [
      'Scenario 1: Do not count auto-bill transactions. Dollar value in batch must be less than 10% of merchant\'s processing in last 30 days (rolling). Merchant must have 6 months consecutive processing (Risk definition of inactive applies). Greater than 90% average CP rate over last 3 months. Batch CP rate greater than 90% → Auto release',
    ],
    parameters: [
      'Today net deposit amount (excluding billing identification)',
      'Total merchant processing in rolling 30 days',
      'Months of consecutive processing (Risk-defined)',
      'CP rate over last 90 days',
      'Batch CP rate',
    ],
  },
  AH016: {
    releaseType: 'Auto',
    triggers: [
      'Late presentment transaction where: Dollar value of the late presentment transaction is ≥ $500. Transaction is 9 days old',
      'Scenario 1 — CNP: If total dollar amount of late presentment transactions for CNP is less than 5% of rolling 30-day volume → Auto release',
      'Scenario 2 — CP: If total dollar amount of late presentment transactions for CP is less than 10% of rolling 30-day volume → Auto release',
    ],
    parameters: [
      'Deposit date',
      'Authorization date',
      'Dollar value of late presentment transaction',
      'CNP rate (rolling 30 days)',
      'CP rate (rolling 30 days)',
    ],
  },
  AH017: {
    releaseType: 'Auto',
    triggers: [
      'Scenario 1: Minimum of 10 total transactions. New merchant status applies. Must have 10 total transactions before rule can generate. Do not count recurring billing transactions. Remove transactions under $5. Recalculate percentage. If CNP% is greater than 5% of approved CNP% AND current month volume is under $1,500 → Auto release. Only fires when transactions cause the violation hit',
    ],
    parameters: [
      'Current month CNP rate',
      'Number of transactions in today\'s batch',
      'Recurring billing identification',
      'Dollar value of transactions in batch',
      'CNP% of transactions',
      'Dollar value of current month processing',
    ],
  },
  AH018: {
    releaseType: 'Manual Review Only',
    triggers: ['No auto release'],
    parameters: ['Chargeback count'],
  },
  AH019: {
    releaseType: 'Auto',
    triggers: [
      'Remove recurring billing transactions. Recalculate volume. If recalculated volume falls under threshold → Auto release',
    ],
    parameters: [
      'Today processing dollar amount',
      'Average processing volume over last 3 months',
      'Recurring billing identification',
    ],
  },
  AH020: {
    releaseType: 'Auto',
    triggers: [
      'Greater than 24 months processing history. Less than 3 chargebacks in last 12 months. Average monthly volume greater than $75K (last month reference). CP average (rolling 30 days) greater than 80% → Auto release',
    ],
    parameters: [
      'Today\'s dollar amount + MTD transactions',
      'Approved monthly volume',
      'New merchant status (Risk-defined)',
      'Chargebacks in last 12 months',
      'Months on board',
      'CP average current month',
      'Average monthly volume',
    ],
  },
  AH021: {
    releaseType: 'Auto',
    triggers: [
      'Greater than 24 months active processing (Risk definition of active processing applies). Less than 3 chargebacks in last 12 months. Average monthly volume greater than $75K. CP average current month greater than 80% → Auto release',
    ],
    parameters: [
      'Today\'s dollar amount + month-to-date volume',
      'Average processing volume over previous 12 months',
      'No chargebacks in last 12 months',
      'Months on board',
      'CP average current month',
    ],
  },
  AH022: {
    releaseType: 'Manual Review Only',
    triggers: ['No auto release'],
    parameters: [
      'Refund identification',
      'Offset sale identification',
      'Dollar value of transaction',
      'Rolling 30-day no-offset total',
    ],
  },
  AH023: {
    releaseType: 'Manual Review Only',
    triggers: ['No auto release. Note: Must validate how files are received / batched operationally'],
    parameters: [
      'Batch dollar value',
      'Processing volume over last 4 days',
    ],
  },
  AH024: {
    releaseType: 'Auto',
    triggers: [
      'If ALL of the following conditions are met: Offset sale exists. No break in processing in last 5 days. No chargebacks in last 30 days. Merchant is not at negative for the current month → Auto release',
    ],
    parameters: [
      'Transaction dollar value',
      'Refund identification',
      'Offset sale identification',
      'Consecutive processing in last 5 days',
      'Chargebacks in last 30 days',
      'Dollar value of last 30 days processing',
    ],
  },
  AH025: {
    releaseType: 'Auto',
    triggers: [
      'MCC-Based Auto Release: If MCC is one of the following: 5811, 5812, 5813, 5814, 5921, 5499, 5411 → Auto release',
      'Volume-Based Auto Release: If same card has been used 6 times or more in one day in previous month (rolling 30 days). Volume on the card is less than 20% of overall volume in same rolling 30 days → Auto release',
    ],
    parameters: [
      'MCC code identification',
      'Transaction type (CP or CNP)',
      'Same card usage in 24-hour period',
      'Dollar value of same card usage in 24 hours',
      'Processing volume over rolling 30 days',
    ],
  },
  AH026: {
    releaseType: 'Auto',
    triggers: [
      'MCC-Based Auto Release: If MCC is one of the following: 5811, 5812, 5813, 5814, 5921, 5499, 5411 → Auto release (Only fires when duplicate BIN occurs in batch)',
      'Scenario 1: Do not count recurring billing transactions',
      'Scenario 2: BIN has been used 10 times or more in previous month (rolling 30 days). Volume on BIN is less than 20% of overall volume in previous rolling 30 days → Auto release',
    ],
    parameters: [
      'MCC code identification',
      'Transaction type (CP or CNP)',
      'Same BIN usage in 24-hour period',
      'Dollar value of same BIN usage in 24 hours',
      'Processing volume over rolling 30 days',
    ],
  },
  AH027: {
    releaseType: 'Auto',
    triggers: [
      'If MCC is one of the following: 5811, 5812, 5813, 5814, 5921, 5499, 5411 → Auto release',
    ],
    parameters: [
      'Dollar value of transactions',
      'Number of transactions under $2 in rolling 24 hours',
      'MCC code identification',
    ],
  },
  AH028: {
    releaseType: 'Auto',
    triggers: [
      'Trigger Condition: Only fires on the day the CNP% crosses the threshold',
      'Scenario 1 — Recurring Billing Adjustment: If batch contains recurring billing transactions, remove them. Recalculate CNP%. If recalculated 30-day CNP% is less than last 3-month average CNP% + 10% → Auto release',
      'Scenario 2 — Low Volume Merchant: If total rolling 30-day volume is under $5K. Average transaction amount under $250. Overall swipe rate greater than 80% → Auto release',
      'Scenario 3 — Low Volume / High CNP but Low Risk: Volume under $20K. CNP% greater than 80%. Average ticket below $100 → Auto release',
      'Scenario 4 — Mature CP Merchant: Merchant greater than 12 months on board. No breaks in processing. Average CP rate greater than 80% (rolling 30 days). No chargebacks in last 12 months. Volume less than $40K (12-month average) → Auto release',
      'Scenario 5 — Frequency Control: If this rule fires for the 5th time within rolling 30 days → Do NOT auto release. Send to investigator. Memo 5th auto release event for AH028',
    ],
    parameters: [
      'Today\'s transaction CNP% + overall CNP%',
      'Last 3-month CNP%',
      'Recurring billing identification',
      'CNP rate (previous 30 days)',
      'CNP rate (current 30 days)',
      'Current month volume',
      'Current month average transaction amount',
      'Swipe rate current month',
      'Number of months on board',
      'Number of breaks in last 12 months',
      'Number of times this rule fired in rolling 30 days',
      'Chargebacks in last 12 months',
      '12-month average volume',
      'Average CP rate',
    ],
  },
  AH029: {
    releaseType: 'Manual Review Only',
    triggers: ['No auto release'],
    parameters: [
      'Dollar value of refund in today\'s batch',
      'Average volume over last 3 months',
    ],
  },
  AH030: {
    releaseType: 'Manual Review Only',
    triggers: ['No auto release'],
    parameters: ['ACH reject identification'],
  },
};

export function getReleaseCriteria(ruleId: string): ReleaseCriteria | undefined {
  return RELEASE_CRITERIA_BY_RULE_ID[ruleId];
}
