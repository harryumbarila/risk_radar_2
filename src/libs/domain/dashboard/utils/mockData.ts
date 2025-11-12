export type RiskLevel = 'high' | 'medium' | 'low';
export type Source = 'TSYS' | 'Fluidpay' | 'Paya' | 'Other';

export interface MockAlert {
  id: string;
  date: string; // ISO
  hour: number; // 0-23
  merchantId: string;
  merchantName: string;
  ruleId: string; // AH001..AH016 | GEO | VOL | MOTO...
  risk: RiskLevel;
  source: Source;
}

export interface MockKpis {
  merchantsAtRiskToday: number;
  autoHoldToday: number;
  weeklyChangePct: number;
  topRule: { ruleId: string; count: number };
  avgResolutionHours: number;
  chargebacks30d: number;
}

const merchantNames = [
  'Global Tech Solutions',
  'Oceanview Logistics',
  'Sunshine Pharmacy',
  'Digital Assets Exchange',
  'City Supermarket',
  'QuickWire Transfers',
  'Business Equipment Pro',
  'Luxury Boutique',
  'Downtown Hotel',
  'Global Shipping Co',
  'Metro Financial Services',
  'Coastal Trading Group',
  'Mountain View Retail',
  'Urban Commerce Hub',
  'Pacific Digital Solutions',
  'Central Market Place',
  'Elite Business Network',
  'Prime Retail Group',
  'Advanced Payment Systems',
  'Strategic Commerce Partners',
];

const ruleIds = [
  'AH001',
  'AH002',
  'AH003',
  'AH004',
  'AH005',
  'AH006',
  'AH007',
  'AH008',
  'AH009',
  'AH010',
  'AH011',
  'AH012',
  'AH013',
  'AH014',
  'AH015',
  'AH016',
  'GEO',
  'VOL',
  'MOTO',
];

// Deterministic seed for consistent random generation
class SeededRandom {
  private seed: number;

  constructor(seed: number) {
    this.seed = seed;
  }

  next(): number {
    this.seed = (this.seed * 9301 + 49297) % 233280;
    return this.seed / 233280;
  }
}

function generateMerchantId(index: number): string {
  return `MID${String(index + 1).padStart(6, '0')}`;
}

function pickWeighted<T>(items: T[], weights: number[], random: SeededRandom): T {
  const total = weights.reduce((sum, w) => sum + w, 0);
  let rand = random.next() * total;
  for (let i = 0; i < items.length; i++) {
    const weight = weights[i] ?? 0;
    rand -= weight;
    if (rand <= 0) {
      const item = items[i];
      if (item !== undefined) return item;
    }
  }
  const lastItem = items[items.length - 1];
  if (lastItem === undefined) {
    throw new Error('Items array is empty');
  }
  return lastItem;
}

export function generateMockAlerts(count: number = 2500): MockAlert[] {
  const alerts: MockAlert[] = [];
  const random = new SeededRandom(12345); // Fixed seed for determinism
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  // Rule weights - some rules appear more frequently
  const ruleWeights = [
    0.05, 0.05, 0.12, 0.05, 0.05, 0.05, 0.12, 0.05, 0.05, 0.05, 0.05, 0.05,
    0.05, 0.05, 0.05, 0.05, 0.08, 0.08, 0.05,
  ];

  // Source weights: TSYS 45%, Fluidpay 35%, Paya 15%, Other 5%
  const sourceWeights = [0.45, 0.35, 0.15, 0.05];
  const sources: Source[] = ['TSYS', 'Fluidpay', 'Paya', 'Other'];

  // Risk weights: 20% high, 40% medium, 40% low
  const riskWeights = [0.2, 0.4, 0.4];
  const risks: RiskLevel[] = ['high', 'medium', 'low'];

  const merchantCount = Math.min(400, Math.floor(count / 6));

  // Generate alerts for the last 30 days with clear distribution
  // Strategy: 
  // - Last 7 days: 40% of alerts (most recent activity)
  // - Days 8-14: 30% of alerts (medium activity)
  // - Days 15-30: 30% of alerts (older activity)
  // This ensures visible differences when filtering by date range
  for (let i = 0; i < count; i++) {
    let daysAgo: number;
    const rand = random.next();
    
    if (rand < 0.4) {
      // 40% in last 7 days (0-6 days ago) - most recent
      daysAgo = Math.floor(random.next() * 7);
    } else if (rand < 0.7) {
      // 30% in days 8-14 (7-13 days ago) - medium
      daysAgo = 7 + Math.floor(random.next() * 7);
    } else {
      // 30% in days 15-30 (14-29 days ago) - older
      daysAgo = 14 + Math.floor(random.next() * 16);
    }
    
    const date = new Date(today.getTime() - daysAgo * 24 * 60 * 60 * 1000);
    // Set time to a random hour within the day
    const hour = Math.floor(random.next() * 24);
    date.setHours(hour, Math.floor(random.next() * 60), Math.floor(random.next() * 60), 0);

    const merchantIndex = Math.floor(random.next() * merchantCount);
    const merchantId = generateMerchantId(merchantIndex);
    const merchantName =
      merchantNames[merchantIndex % merchantNames.length] +
      (merchantIndex >= merchantNames.length ? ` ${Math.floor(merchantIndex / merchantNames.length) + 1}` : '');

    const ruleId = pickWeighted(ruleIds, ruleWeights, random);
    const risk = pickWeighted(risks, riskWeights, random);
    const source = pickWeighted(sources, sourceWeights, random);

    alerts.push({
      id: `alert-${i + 1}`,
      date: date.toISOString(),
      hour,
      merchantId,
      merchantName,
      ruleId,
      risk,
      source,
    });
  }

  // Ensure we have at least 20-30 alerts for today with good distribution
  const todayAlertsCount = alerts.filter(
    (a) => new Date(a.date).getTime() >= today.getTime()
  ).length;

  if (todayAlertsCount < 20) {
    // Add more today's alerts
    for (let i = 0; i < 30 - todayAlertsCount; i++) {
      const hour = Math.floor(random.next() * Math.min(now.getHours() + 1, 24));
      const merchantIndex = Math.floor(random.next() * Math.min(50, merchantCount));
      const merchantId = generateMerchantId(merchantIndex);
      const merchantName =
        merchantNames[merchantIndex % merchantNames.length] +
        (merchantIndex >= merchantNames.length ? ` ${Math.floor(merchantIndex / merchantNames.length) + 1}` : '');

      const ruleId = pickWeighted(ruleIds, ruleWeights, random);
      // Bias today's alerts towards high/medium risk for more realistic metrics
      const riskBias = random.next();
      const risk: RiskLevel = riskBias < 0.3 ? 'high' : riskBias < 0.7 ? 'medium' : 'low';
      const source = pickWeighted(sources, sourceWeights, random);

      alerts.push({
        id: `alert-today-${i + 1}`,
        date: today.toISOString(),
        hour,
        merchantId,
        merchantName,
        ruleId,
        risk,
        source,
      });
    }
  }

  return alerts.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

export function calculateKpis(alerts: MockAlert[]): MockKpis {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
  const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

  // Today's alerts
  const todayAlerts = alerts.filter(
    (a) => new Date(a.date) >= today && new Date(a.date) < new Date(today.getTime() + 24 * 60 * 60 * 1000)
  );

  // Merchants at risk today (unique merchants with high/medium risk)
  const merchantsAtRiskToday = new Set(
    todayAlerts.filter((a) => a.risk === 'high' || a.risk === 'medium').map((a) => a.merchantId)
  ).size;

  // Auto hold today (high risk alerts)
  const autoHoldToday = todayAlerts.filter((a) => a.risk === 'high').length;

  // Weekly change
  const thisWeekAlerts = alerts.filter((a) => new Date(a.date) >= weekAgo);
  const lastWeekStart = new Date(weekAgo.getTime() - 7 * 24 * 60 * 60 * 1000);
  const lastWeekAlerts = alerts.filter(
    (a) => new Date(a.date) >= lastWeekStart && new Date(a.date) < weekAgo
  );
  const thisWeekCount = thisWeekAlerts.length;
  const lastWeekCount = lastWeekAlerts.length;
  const weeklyChangePct =
    lastWeekCount > 0 ? ((thisWeekCount - lastWeekCount) / lastWeekCount) * 100 : 0;

  // Top rule
  const ruleCounts = new Map<string, number>();
  alerts.forEach((a) => {
    ruleCounts.set(a.ruleId, (ruleCounts.get(a.ruleId) || 0) + 1);
  });
  let topRule = { ruleId: 'AH001', count: 0 };
  ruleCounts.forEach((count, ruleId) => {
    if (count > topRule.count) {
      topRule = { ruleId, count };
    }
  });

  // Average resolution hours (mock: 2-48 hours based on risk)
  // Use a deterministic calculation based on alert ID and risk level
  const resolvedAlerts = alerts.filter((a) => a.risk === 'high' || a.risk === 'medium');
  const random = new SeededRandom(54321); // Different seed for resolution time
  const totalHours = resolvedAlerts.reduce((sum, a, idx) => {
    const seed = parseInt(a.id.replace(/\D/g, '')) || idx;
    const localRandom = new SeededRandom(seed);
    if (a.risk === 'high') {
      return sum + (12 + localRandom.next() * 12); // 12-24h
    }
    return sum + (24 + localRandom.next() * 24); // 24-48h
  }, 0);
  const avgResolutionHours = resolvedAlerts.length > 0 ? totalHours / resolvedAlerts.length : 28.5; // Default to 28.5h if no alerts

  // Chargebacks last 30 days (mock: ~2% of high risk alerts)
  const highRiskLast30d = alerts.filter(
    (a) => a.risk === 'high' && new Date(a.date) >= thirtyDaysAgo
  );
  const chargebacks30d = Math.floor(highRiskLast30d.length * 0.02);

  return {
    merchantsAtRiskToday,
    autoHoldToday,
    weeklyChangePct: Math.round(weeklyChangePct * 10) / 10,
    topRule,
    avgResolutionHours: Math.round(avgResolutionHours * 10) / 10,
    chargebacks30d,
  };
}

