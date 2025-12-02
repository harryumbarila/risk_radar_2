// Utility functions for TSYS charts

// Rule IDs that appear in the charts
export const RULE_IDS = ['AH001', 'AH002', 'AH003', 'AH004', 'AH005', 'AH006', 'AH007'];

// Subtle, consistent color palette for rules (non-saturated)
export const RULE_COLORS: Record<string, string> = {
  AH001: '#93c5fd', // Light blue
  AH002: '#a7f3d0', // Light green
  AH003: '#fde68a', // Light yellow
  AH004: '#fbcfe8', // Light pink
  AH005: '#c4b5fd', // Light purple
  AH006: '#fed7aa', // Light orange
  AH007: '#bfdbfe', // Light indigo
};

// Generate mock data with rule participation over time
export const generateRuleParticipationData = (
  days: number = 14,
  baseCount: number = 1000
) => {
  const data = [];
  const today = new Date();
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    
    const dayData: Record<string, any> = {
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      dateValue: date.toISOString().split('T')[0],
    };
    
    let total = 0;
    // Generate counts for each rule
    RULE_IDS.forEach((ruleId) => {
      const count = Math.floor(Math.random() * (baseCount / RULE_IDS.length)) + 
                    Math.floor(baseCount / (RULE_IDS.length * 2));
      dayData[ruleId] = count;
      total += count;
    });
    
    dayData.total = total;
    data.push(dayData);
  }
  
  return data;
};

// Calculate percentage
export const calculatePercentage = (value: number, total: number): number => {
  if (total === 0) return 0;
  return Math.round((value / total) * 100 * 10) / 10;
};

