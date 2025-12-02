// Utility functions for TSYS charts
import type { FilterState } from '../../filter-bar/filter-bar';

// Rule IDs that appear in the charts
export const RULE_IDS = ['AH001', 'AH002', 'AH003', 'AH004', 'AH005', 'AH006', 'AH007'];

// Short descriptions for rules (for chart display)
export const RULE_DESCRIPTIONS: Record<string, string> = {
  AH001: 'High Amount',
  AH002: 'Rapid Volume',
  AH003: 'Unusual Pattern',
  AH004: 'Geo Risk',
  AH005: 'Card Verify Fail',
  AH006: 'Velocity Exceeded',
  AH007: 'Merchant Risk',
};

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

// Determine aggregation level based on date range
export const getAggregationLevel = (days: number): 'daily' | 'weekly' | 'monthly' => {
  if (days <= 60) return 'daily';
  if (days <= 180) return 'weekly'; // ~6 months
  return 'monthly';
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
      };
      
      let total = 0;
      RULE_IDS.forEach((ruleId) => {
        const count = Math.floor(Math.random() * (baseCount / RULE_IDS.length)) + 
                      Math.floor(baseCount / (RULE_IDS.length * 2));
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
        date: `${weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${weekEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`,
        dateValue: weekStart.toISOString().split('T')[0],
      };
      
      let total = 0;
      RULE_IDS.forEach((ruleId) => {
        const count = Math.floor(Math.random() * (baseCount * 7 / RULE_IDS.length)) + 
                      Math.floor(baseCount * 7 / (RULE_IDS.length * 2));
        weekData[ruleId] = count;
        total += count;
      });
      
      weekData.total = total;
      data.push(weekData);
    }
  } else {
    // Monthly aggregation
    const months = Math.ceil(days / 30);
    for (let i = months - 1; i >= 0; i--) {
      const monthStart = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const monthData: Record<string, any> = {
        date: monthStart.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        dateValue: monthStart.toISOString().split('T')[0],
      };
      
      let total = 0;
      RULE_IDS.forEach((ruleId) => {
        const count = Math.floor(Math.random() * (baseCount * 30 / RULE_IDS.length)) + 
                      Math.floor(baseCount * 30 / (RULE_IDS.length * 2));
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

// Calculate x-axis label rotation and interval based on data length
export const getXAxisConfig = (dataLength: number) => {
  if (dataLength <= 14) {
    return { angle: 0, interval: 0 }; // Show all labels, no rotation
  } else if (dataLength <= 30) {
    return { angle: 0, interval: 1 }; // Show every other label
  } else if (dataLength <= 60) {
    return { angle: -45, interval: 2 }; // Rotate and show every 3rd
  } else {
    return { angle: -45, interval: 'preserveStartEnd' }; // Rotate, show start/end
  }
};
