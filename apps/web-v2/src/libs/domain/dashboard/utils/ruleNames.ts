/**
 * Rule source types
 */
export type RuleSource = 
  | 'TSYS DFT256 Capture'
  | 'TSYS ADF Auth'
  | 'TSYS TDDF Settle'
  | 'ACH Returns';

/**
 * Rule definition interface
 */
export interface RuleDefinition {
  code: string;
  name: string;
  source: RuleSource;
}

/**
 * Complete mapping of all rules with their definitions
 */
export const RULE_DEFINITIONS: Record<string, RuleDefinition> = {
  AH001: { code: 'AH001', name: 'Bank Change Rule', source: 'TSYS DFT256 Capture' },
  AH002: { code: 'AH002', name: 'Foreign Card Rule', source: 'TSYS ADF Auth' },
  AH003: { code: 'AH003', name: 'High Trans Rule', source: 'TSYS ADF Auth' },
  AH004: { code: 'AH004', name: 'High $ Batch Rule', source: 'TSYS ADF Auth' },
  AH005: { code: 'AH005', name: 'Dormant account for 90 days settled', source: 'TSYS DFT256 Capture' },
  AH006: { code: 'AH006', name: 'Prepaid Rule', source: 'TSYS ADF Auth' },
  AH007: { code: 'AH007', name: 'Risk thresholds', source: 'TSYS ADF Auth' },
  AH008: { code: 'AH008', name: 'CNP High Ticket', source: 'TSYS ADF Auth' },
  AH009: { code: 'AH009', name: 'CP High Ticket', source: 'TSYS ADF Auth' },
  AH010: { code: 'AH010', name: 'Over tip', source: 'TSYS DFT256 Capture' },
  AH011: { code: 'AH011', name: 'New account high keyed transaction amount', source: 'TSYS DFT256 Capture' },
  AH012: { code: 'AH012', name: 'New account high batch amount', source: 'TSYS DFT256 Capture' },
  AH013: { code: 'AH013', name: 'Duplicate Card Usage by merchant in 30 days', source: 'TSYS DFT256 Capture' },
  AH014: { code: 'AH014', name: 'Processing account high transaction amount', source: 'TSYS DFT256 Capture' },
  AH015: { code: 'AH015', name: 'Processing account high batch amount', source: 'TSYS DFT256 Capture' },
  AH016: { code: 'AH016', name: 'Late Presentment', source: 'TSYS DFT256 Capture' },
  AH017: { code: 'AH017', name: 'New account CNP %', source: 'TSYS ADF Auth' },
  AH018: { code: 'AH018', name: 'High chargeback count and amount', source: 'TSYS TDDF Settle' },
  AH019: { code: 'AH019', name: 'Processing account high $ daily activity', source: 'TSYS ADF Auth' },
  AH020: { code: 'AH020', name: 'Monthly Volume- New accounts', source: 'TSYS ADF Auth' },
  AH021: { code: 'AH021', name: 'Monthly Volume- Processing accounts', source: 'TSYS ADF Auth' },
  AH022: { code: 'AH022', name: 'Refunds without offsetting sales', source: 'TSYS DFT256 Capture' },
  AH023: { code: 'AH023', name: 'Negative Batch', source: 'TSYS DFT256 Capture' },
  AH024: { code: 'AH024', name: 'High dollar amount refund', source: 'TSYS DFT256 Capture' },
  AH025: { code: 'AH025', name: 'Duplicate Card Usage by merchant in 24 hours', source: 'TSYS DFT256 Capture' },
  AH026: { code: 'AH026', name: 'Duplicate BIN Usage by merchant', source: 'TSYS DFT256 Capture' },
  AH027: { code: 'AH027', name: 'Small amount trans', source: 'TSYS ADF Auth' },
  AH028: { code: 'AH028', name: 'Processing account CNP %', source: 'TSYS ADF Auth' },
  AH029: { code: 'AH029', name: 'High dollar percentage refund', source: 'TSYS DFT256 Capture' },
  AH030: { code: 'AH030', name: 'ACH hold', source: 'ACH Returns' },
};

/**
 * Mapping of rule codes to their full descriptive names (backward compatibility)
 */
export const RULE_NAMES: Record<string, string> = Object.fromEntries(
  Object.entries(RULE_DEFINITIONS).map(([code, def]) => [code, def.name])
);

/**
 * Mapping of rule codes to their sources
 */
export const RULE_SOURCES: Record<string, RuleSource> = Object.fromEntries(
  Object.entries(RULE_DEFINITIONS).map(([code, def]) => [code, def.source])
);

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

/**
 * Get the source of a rule by its code
 * @param ruleId - The rule code (e.g., 'AH001')
 * @returns The source or undefined if not found
 */
export function getRuleSource(ruleId: string): RuleSource | undefined {
  return RULE_DEFINITIONS[ruleId]?.source;
}

/**
 * Get the complete rule definition by its code
 * @param ruleId - The rule code (e.g., 'AH001')
 * @returns The rule definition or undefined if not found
 */
export function getRuleDefinition(ruleId: string): RuleDefinition | undefined {
  return RULE_DEFINITIONS[ruleId];
}

