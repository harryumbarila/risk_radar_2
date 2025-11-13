/**
 * Mapping of rule codes to their full descriptive names
 */
export const RULE_NAMES: Record<string, string> = {
  AH001: 'Auto Hold - High Transaction Amount',
  AH002: 'Auto Hold - Rapid Transaction Volume',
  AH003: 'Auto Hold - Unusual Merchant Pattern',
  AH004: 'Auto Hold - Suspicious Geographic Location',
  AH005: 'Auto Hold - Card Verification Failure',
  AH006: 'Auto Hold - Velocity Check Exceeded',
  AH007: 'Auto Hold - Merchant Risk Threshold',
  AH008: 'Auto Hold - Time-Based Anomaly',
  AH009: 'Auto Hold - Duplicate Transaction Detected',
  AH010: 'Auto Hold - Invalid Billing Address',
  AH011: 'Auto Hold - IP Address Mismatch',
  AH012: 'Auto Hold - Device Fingerprint Risk',
  AH013: 'Auto Hold - Account Age Verification',
  AH014: 'Auto Hold - Payment Method Risk',
  AH015: 'Auto Hold - Cross-Border Risk',
  AH016: 'Auto Hold - MCC Code Risk',
  GEO: 'Geographic Location Risk',
  VOL: 'Volume-Based Risk Detection',
  MOTO: 'Mail Order / Telephone Order Risk',
};

/**
 * Get the full name of a rule by its code
 * @param ruleId - The rule code (e.g., 'AH001')
 * @returns The full descriptive name or the code if not found
 */
export function getRuleName(ruleId: string): string {
  return RULE_NAMES[ruleId] || ruleId;
}

/**
 * Get a short display name for a rule (abbreviation)
 * @param ruleId - The rule code (e.g., 'AH001')
 * @returns The rule code as abbreviation
 */
export function getRuleAbbreviation(ruleId: string): string {
  return ruleId;
}

