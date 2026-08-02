import { clamp } from './rng.js';

const defaults = {
  price: 49,
  subscription: 'Tiered',
  audience: 'Startup founders',
  marketing: 18000,
  features: 8,
  launchMonth: 'September',
  competitor: 58,
  cac: 42,
  monthlyUsers: 1200
};

export function predictScenario(input = {}) {
  const s = { ...defaults, ...input };
  const p = Number(s.price);
  const m = Number(s.marketing);
  const f = Number(s.features);
  const c = Number(s.competitor);
  const cac = Number(s.cac);
  const u = Number(s.monthlyUsers);

  const purchase = Math.round(clamp(76 - (p - 49) * 0.28 + (m - 18000) / 1800 + f * 1.1 - c * 0.12, 18, 97));
  const revenue = Math.round(clamp((u * p * purchase) / 100 / 1000, 3, 250));
  const fit = Math.round(clamp(62 + f * 1.7 + m / 1500 - p * 0.16 - c * 0.08, 25, 96));
  const readiness = Math.round(clamp(54 + f * 1.3 + m / 2000 - c * 0.1, 20, 95));
  const satisfaction = Math.round(clamp(66 + f * 1.5 - p * 0.12 + (s.subscription === 'Freemium' ? 5 : 0), 30, 96));
  const retention = Math.round(clamp(82 - c * 0.12 - p * 0.09 + f * 0.9, 32, 94));
  const risk = Math.round(clamp(68 + c * 0.2 + p * 0.16 + cac * 0.15 - f * 1.1 - m / 2500, 12, 89));
  const breakeven = Math.round(clamp(19 - p * 0.06 - m / 6000 + u / 2300, 3, 24));
  const competition = Math.round(clamp(c + p * 0.08 - m / 3000, 10, 94));
  const growth = Math.round(clamp(48 + m / 1200 + f * 1.3 - c * 0.13, 18, 95));
  const series = Array.from({ length: 7 }, (_, i) => ({
    month: `M${i + 1}`,
    revenue: Math.round(revenue * (0.42 + i * 0.1)),
    fit: Math.round(fit - (6 - i)),
    demand: Math.round(purchase * (0.55 + i * 0.065))
  }));

  return { purchase, revenue, fit, readiness, satisfaction, retention, risk, breakeven, competition, growth, series, inputs: s };
}
