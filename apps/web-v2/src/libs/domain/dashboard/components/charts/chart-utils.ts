// Utility functions for TSYS charts
import type { FilterState } from '../../filter-bar/filter-bar';

// Generate 40+ rule IDs for testing
export const RULE_IDS = Array.from({ length: 45 }, (_, i) => {
  const num = i + 1;
  return `AH${num.toString().padStart(3, '0')}`;
});

// Short descriptions for rules (for chart display)
export const RULE_DESCRIPTIONS: Record<string, string> = {
  AH001: 'High Amount',
  AH002: 'Rapid Volume',
  AH003: 'Unusual Pattern',
  AH004: 'Geo Risk',
  AH005: 'Card Verify Fail',
  AH006: 'Velocity Exceeded',
  AH007: 'Merchant Risk',
  // Generate descriptions for remaining rules
  ...Object.fromEntries(
    Array.from({ length: 38 }, (_, i) => {
      const num = i + 8;
      const ruleId = `AH${num.toString().padStart(3, '0')}`;
      const descriptions = [
        'Transaction Limit',
        'Frequency Check',
        'Amount Threshold',
        'Location Anomaly',
        'Time Pattern',
        'Device Mismatch',
        'IP Verification',
        'Card Type Risk',
        'Merchant Category',
        'Transaction Size',
        'Velocity Alert',
        'Pattern Detection',
        'Risk Score',
        'Fraud Indicator',
        'Behavior Analysis',
        'Account Status',
        'Payment Method',
        'Currency Check',
        'Country Validation',
        'Time Zone Risk',
        'Device Fingerprint',
        'Session Analysis',
        'Network Check',
        'Historical Pattern',
        'Amount Deviation',
        'Frequency Alert',
        'Location Change',
        'Time Window',
        'Merchant History',
        'Card History',
        'User Behavior',
        'Transaction Flow',
        'Risk Assessment',
        'Pattern Match',
        'Anomaly Detection',
        'Threshold Exceeded',
        'Validation Failed',
        'Security Check',
      ];
      return [ruleId, descriptions[i % descriptions.length]];
    })
  ),
};

// Generate color palette for top 5 rules (strong colors)
const TOP_5_COLORS = [
  '#3b82f6', // Blue
  '#10b981', // Green
  '#f59e0b', // Amber
  '#ef4444', // Red
  '#8b5cf6', // Purple
];

// Generate continuous color scale for remaining rules
const generateColorScale = (count: number): string[] => {
  const colors: string[] = [];
  // Use a gradient from light blue to light purple
  for (let i = 0; i < count; i++) {
    const ratio = i / (count - 1);
    const hue = 200 + (ratio * 60); // Blue to purple
    const saturation = 40 + (ratio * 20); // 40-60%
    const lightness = 70 - (ratio * 10); // 70-60%
    colors.push(`hsl(${hue}, ${saturation}%, ${lightness}%)`);
  }
  return colors;
};

// Subtle, consistent color palette for rules (non-saturated)
export const RULE_COLORS: Record<string, string> = {
  ...Object.fromEntries(
    RULE_IDS.map((ruleId, index) => {
      if (index < 5) {
        return [ruleId, TOP_5_COLORS[index]];
      }
      const scaleColors = generateColorScale(RULE_IDS.length - 5);
      return [ruleId, scaleColors[index - 5]];
    })
  ),
};

// Calculate number of days from date range filter
export const getDaysFromDateRange = (filters: FilterState): number => {
  if (filters.dateRange === 'custom') {
    if (filters.customStartDate && filters.customEndDate) {
      const start = new Date(filters.customStartDate);
      const end = new Date(filters.customEndDate);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 to include both start and end
      return diffDays;
    }
    return 7; // Default to 7 days if custom dates not set
  }
  return parseInt(filters.dateRange) || 7;
};

// Determine chart type based on date range
export const getChartType = (days: number): 'bar' | 'area' => {
  if (days <= 14) return 'bar';
  return 'area';
};

// Determine aggregation level based on date range (for data generation)
export const getAggregationLevel = (days: number): 'daily' | 'weekly' | 'monthly' => {
  if (days <= 14) return 'daily';
  if (days <= 45) return 'weekly';
  return 'monthly';
};

// Determine date grouping format
export const getDateGrouping = (days: number): 'daily' | 'weekly' | 'monthly' => {
  if (days <= 14) return 'daily';
  if (days <= 45) return 'weekly';
  return 'monthly';
};

// Format date for weekly grouping
export const formatWeeklyDate = (startDate: Date, endDate: Date): string => {
  const startStr = startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  const endStr = endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  if (startDate.getMonth() === endDate.getMonth() && startDate.getFullYear() === endDate.getFullYear()) {
    return `${startStr}–${endStr}`;
  }
  return `${startStr}–${endStr}`;
};

// Format date for monthly grouping
export const formatMonthlyDate = (date: Date, shortFormat: boolean = false): string => {
  if (shortFormat) {
    // Format: "Aug '25"
    const month = date.toLocaleDateString('en-US', { month: 'short' });
    const year = date.getFullYear().toString().slice(-2);
    return `${month} '${year}`;
  }
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
};

// Apply rolling average smoothing (visual only, doesn't modify original data)
export const applySmoothing = (
  data: Array<Record<string, any>>,
  windowSize: number
): Array<Record<string, any>> => {
  if (windowSize <= 1 || data.length <= windowSize) return data;
  
  const smoothed = data.map((item, index) => {
    const smoothedItem: Record<string, any> = { ...item };
    
    // Calculate window bounds
    const start = Math.max(0, index - Math.floor(windowSize / 2));
    const end = Math.min(data.length, start + windowSize);
    const window = data.slice(start, end);
    
    // Calculate average for each rule
    RULE_IDS.forEach((ruleId) => {
      const sum = window.reduce((acc, w) => acc + (w[ruleId] || 0), 0);
      smoothedItem[ruleId] = Math.round(sum / window.length);
    });
    
    // Recalculate total
    smoothedItem.total = RULE_IDS.reduce((sum, ruleId) => sum + (smoothedItem[ruleId] || 0), 0);
    
    return smoothedItem;
  });
  
  return smoothed;
};

// Generate mock data with rule participation over time
export const generateRuleParticipationData = (
  days: number = 14,
  baseCount: number = 1000,
  aggregation: 'daily' | 'weekly' | 'monthly' = 'daily'
) => {
  const data = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  if (aggregation === 'daily') {
    // Daily aggregation
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      
      const dayData: Record<string, any> = {
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        dateValue: date.toISOString().split('T')[0],
        dateObj: new Date(date),
      };
      
      let total = 0;
      RULE_IDS.forEach((ruleId, index) => {
        // Top 5 rules get higher participation
        const multiplier = index < 5 ? (6 - index) * 0.15 : (Math.random() * 0.05 + 0.01);
        const count = Math.floor(baseCount * multiplier);
        dayData[ruleId] = count;
        total += count;
      });
      
      dayData.total = total;
      data.push(dayData);
    }
  } else if (aggregation === 'weekly') {
    // Weekly aggregation
    const weeks = Math.ceil(days / 7);
    for (let i = weeks - 1; i >= 0; i--) {
      const weekStart = new Date(today);
      weekStart.setDate(today.getDate() - (i * 7) - 6); // Start of week
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6); // End of week
      
      const weekData: Record<string, any> = {
        date: formatWeeklyDate(weekStart, weekEnd),
        dateValue: weekStart.toISOString().split('T')[0],
        dateObj: weekStart,
        dateRange: { start: weekStart, end: weekEnd },
      };
      
      let total = 0;
      RULE_IDS.forEach((ruleId, index) => {
        const multiplier = index < 5 ? (6 - index) * 0.15 : (Math.random() * 0.05 + 0.01);
        const count = Math.floor(baseCount * 7 * multiplier);
        weekData[ruleId] = count;
        total += count;
      });
      
      weekData.total = total;
      data.push(weekData);
    }
  } else {
    // Monthly aggregation
    const months = Math.ceil(days / 30);
    const useShortFormat = days > 180; // Use short format for > 6 months
    for (let i = months - 1; i >= 0; i--) {
      const monthStart = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const monthEnd = new Date(today.getFullYear(), today.getMonth() - i + 1, 0);
      const monthData: Record<string, any> = {
        date: formatMonthlyDate(monthStart, useShortFormat),
        dateValue: monthStart.toISOString().split('T')[0],
        dateObj: monthStart,
        dateRange: { start: monthStart, end: monthEnd },
      };
      
      let total = 0;
      RULE_IDS.forEach((ruleId, index) => {
        const multiplier = index < 5 ? (6 - index) * 0.15 : (Math.random() * 0.05 + 0.01);
        const count = Math.floor(baseCount * 30 * multiplier);
        monthData[ruleId] = count;
        total += count;
      });
      
      monthData.total = total;
      data.push(monthData);
    }
  }
  
  return data;
};

// Calculate percentage
export const calculatePercentage = (value: number, total: number): number => {
  if (total === 0) return 0;
  return Math.round((value / total) * 100 * 10) / 10;
};

// Calculate x-axis label interval to show max 6-7 ticks
export const getXAxisInterval = (dataLength: number): number => {
  if (dataLength <= 7) return 0; // Show all
  if (dataLength <= 14) return 1; // Show every other
  // For longer ranges, show approximately 6-7 ticks
  return Math.floor(dataLength / 6);
};

// Get x-axis configuration based on data length and grouping
export const getXAxisConfig = (dataLength: number, grouping: 'daily' | 'weekly' | 'monthly' = 'daily') => {
  const interval = getXAxisInterval(dataLength);
  
  return {
    angle: 0, // Never rotate
    interval: interval,
    tick: { fontSize: 11, fill: '#6b7280' },
    axisLine: { stroke: '#e5e7eb' },
    tickLine: { stroke: '#e5e7eb' },
  };
};

// Get smoothing window size based on date range
export const getSmoothingWindow = (days: number): number => {
  if (days > 90) return 14;
  if (days > 30) return 7;
  return 0; // No smoothing
};

// Calculate top N rules by average participation
export const getTopRules = (
  data: Array<Record<string, any>>,
  ruleIds: string[],
  topN: number = 5
): string[] => {
  // Calculate average participation for each rule
  const ruleAverages = ruleIds.map((ruleId) => {
    const sum = data.reduce((acc, item) => acc + (item[ruleId] || 0), 0);
    const avg = sum / data.length;
    const total = data.reduce((acc, item) => acc + (item.total || 0), 0);
    const avgTotal = total / data.length;
    const percentage = calculatePercentage(avg, avgTotal);
    return { ruleId, percentage, avg };
  });

  // Sort by percentage descending
  ruleAverages.sort((a, b) => b.percentage - a.percentage);

  // Return top N rule IDs
  return ruleAverages.slice(0, topN).map((r) => r.ruleId);
};
