import { createRng, clamp } from './rng.js';
import { generatePersonas } from './personas.js';

export function generateDashboard({ seed = 1, brief = {} } = {}) {
  const rng = createRng(seed + 11);
  const prob = clamp((brief.price ? 78 - (brief.price - 29) * 0.6 : 78) + rng.range(-3, 3), 60, 92);
  const revenue = clamp(4.2 + rng.range(-4, 4) / 10, 2.5, 6);

  const personas = generatePersonas({ seed: seed + 5, count: 5, brief }).map((p, i) => ({
    id: i + 1,
    name: p.name,
    profession: p.profession,
    behaviour: p.behaviour,
    probability: p.purchaseProbability,
    confidence: p.confidence,
    detail: p.painPoint,
    trigger: p.triggers,
    objection: p.objections
  }));

  return {
    executiveSummary: [
      { id: 'validation', label: 'Validation score', value: clamp(prob + 16, 80, 99), suffix: '/100', detail: 'Strong product signal across five market segments.', trend: '+12 pts vs benchmark', accent: '#8b5cf6' },
      { id: 'readiness', label: 'Launch readiness', value: clamp(prob - 1, 70, 95), suffix: '%', detail: 'Customer demand and go-to-market alignment are strong.', trend: 'High readiness', accent: '#14b8a6' },
      { id: 'confidence', label: 'AI confidence', value: clamp(prob - 6, 70, 96), suffix: '%', detail: 'Behavioural predictions are consistent across personas.', trend: 'Low variance', accent: '#22c55e' },
      { id: 'risk', label: 'Risk level', value: clamp(100 - prob - 2, 12, 45), suffix: '%', detail: 'Price and adoption are the primary areas to monitor.', trend: 'Manageable risk', accent: '#f97316' }
    ],
    kpiCards: [
      { id: 'purchase', title: 'Purchase probability', value: prob, unit: '%', trend: '+6%', trendLabel: 'week over week', sparkline: spark(prob, 7, 0.9), accent: '#7c3aed', icon: 'ShoppingCart' },
      { id: 'revenue', title: 'Revenue forecast', value: revenue, unit: 'M', trend: '+18%', trendLabel: 'next quarter', sparkline: spark(revenue, 7, 0.9), accent: '#0ea5e9', icon: 'DollarSign' },
      { id: 'users', title: 'Monthly users', value: clamp(18.4 + rng.range(-4, 6), 8, 40), unit: 'k', trend: '+14%', trendLabel: 'active cohort', sparkline: spark(18.4, 7, 0.85), accent: '#22c55e', icon: 'Users' },
      { id: 'price', title: 'Recommended price', value: brief.price || 29, unit: '$', trend: '+2$', trendLabel: 'premium positioning', sparkline: spark(brief.price || 29, 7, 0.9), accent: '#f97316', icon: 'Tag' },
      { id: 'market', title: 'Market fit score', value: clamp(prob + 3, 65, 95), unit: '%', trend: '+9%', trendLabel: 'strong product-market fit', sparkline: spark(prob + 3, 7, 0.9), accent: '#8b5cf6', icon: 'Sparkles' },
      { id: 'competitor', title: 'Competitor threat', value: clamp(34 + rng.range(-6, 6), 20, 55), unit: '%', trend: '-7%', trendLabel: 'relative position', sparkline: spark(34, 7, 0.95), accent: '#ec4899', icon: 'ShieldAlert' },
      { id: 'satisfaction', title: 'Customer satisfaction', value: clamp(prob - 1, 68, 96), unit: '%', trend: '+4%', trendLabel: 'positive sentiment', sparkline: spark(prob - 1, 7, 0.9), accent: '#22c55e', icon: 'Smile' }
    ],
    chartData: {
      probability: [{ name: 'Launch', value: prob }],
      revenue: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'].map((m, i) => ({ name: m, value: round(revenue * (0.28 + i * 0.12)) })),
      demand: [
        { feature: 'Auto pricing', value: clamp(prob + 8, 70, 96) },
        { feature: 'Persona insights', value: clamp(prob + 4, 65, 92) },
        { feature: 'Scenario builder', value: clamp(prob - 2, 60, 88) },
        { feature: 'Template library', value: clamp(prob - 12, 50, 80) },
        { feature: 'Stakeholder reports', value: clamp(prob - 22, 40, 75) }
      ],
      segments: [
        { name: 'Founders', value: clamp(34 + rng.range(-4, 4), 20, 45) },
        { name: 'Designers', value: clamp(20 + rng.range(-4, 4), 12, 30) },
        { name: 'Freelancers', value: clamp(26 + rng.range(-4, 4), 16, 36) },
        { name: 'Marketers', value: clamp(14 + rng.range(-3, 3), 8, 22) },
        { name: 'Consultants', value: clamp(6 + rng.range(-2, 3), 4, 14) }
      ],
      pricingHeatmap: [
        { tier: 'Starter', grid: [45, 52, 68, 73, 81] },
        { tier: 'Growth', grid: [56, 68, 74, 82, 89] },
        { tier: 'Pro', grid: [64, 72, 82, 88, 94] },
        { tier: 'Enterprise', grid: [72, 81, 90, 96, 99] }
      ],
      sentiment: [
        { name: 'Positive', value: clamp(prob - 12, 45, 70), fill: '#22c55e' },
        { name: 'Neutral', value: 28, fill: '#818cf8' },
        { name: 'Negative', value: clamp(100 - prob - 12, 8, 30), fill: '#f97316' }
      ],
      competitor: [
        { subject: 'Positioning', us: clamp(prob, 70, 96), rival: 74 },
        { subject: 'UX clarity', us: clamp(prob - 4, 66, 92), rival: 69 },
        { subject: 'Price', us: clamp(prob - 12, 55, 85), rival: 63 },
        { subject: 'Support', us: clamp(prob - 7, 62, 90), rival: 72 },
        { subject: 'Feature depth', us: clamp(prob - 2, 68, 94), rival: 77 }
      ]
    },
    personas,
    painAnalysis: {
      objections: [
        { label: 'Price feels high', value: clamp(100 - prob - 4, 55, 95) },
        { label: 'Data privacy unclear', value: clamp(78 + rng.range(-5, 5), 55, 92) },
        { label: 'Too many onboarding steps', value: clamp(63 + rng.range(-5, 5), 45, 82) }
      ],
      requests: [
        { label: 'More SaaS integrations', value: clamp(93 + rng.range(-4, 4), 70, 98) },
        { label: 'Faster setup', value: clamp(prob + 6, 65, 95) },
        { label: 'Real-time dashboards', value: clamp(prob - 2, 60, 90) }
      ],
      complaints: [
        { label: 'Confusing pricing tiers', value: clamp(100 - prob - 6, 45, 88) },
        { label: 'Lack of narrative', value: clamp(67 + rng.range(-6, 6), 45, 85) },
        { label: 'No collaboration tools', value: clamp(55 + rng.range(-6, 6), 40, 80) }
      ],
      loved: [
        { label: 'Persona accuracy', value: clamp(prob + 8, 70, 98) },
        { label: 'Visual clarity', value: clamp(prob + 4, 65, 95) },
        { label: 'Actionable recommendations', value: clamp(prob - 3, 60, 92) }
      ]
    },
    marketOpportunity: [
      { id: 'market', title: 'Market size', value: '$4.1B', description: 'Large segment of early stage founders and knowledge workers.' },
      { id: 'growth', title: 'Growth trend', value: '27% CAGR', description: 'Sustained demand for customer-led product intelligence.' },
      { id: 'expansion', title: 'Expansion potential', value: '4 new regions', description: 'High interest in North America, EMEA, and APAC.' },
      { id: 'business', title: 'Business opportunity', value: 'High', description: 'Validated use cases in finance, marketing, and operations.' },
      { id: 'competition', title: 'Competition index', value: 'Moderate', description: 'A gap exists for premium confidence-driven AI tools.' }
    ],
    risks: [
      { id: 'pricing', title: 'Pricing risk', score: clamp(100 - prob - 2, 40, 90), tag: 'Elevated', color: '#f97316', detail: 'Needs stronger premium framing at purchase.' },
      { id: 'competition', title: 'Competition risk', score: 44, tag: 'Moderate', color: '#8b5cf6', detail: 'Rivals trail on empathy modelling but are price aggressive.' },
      { id: 'retention', title: 'Retention risk', score: 36, tag: 'Low', color: '#22c55e', detail: 'Repeat potential is healthy with better onboarding.' },
      { id: 'adoption', title: 'Adoption risk', score: clamp(100 - prob, 35, 75), tag: 'Manageable', color: '#facc15', detail: 'Early users need easier first-time value.' },
      { id: 'technical', title: 'Technical risk', score: 29, tag: 'Low', color: '#0ea5e9', detail: 'Infrastructure and integrations are stable.' },
      { id: 'overall', title: 'Overall risk', score: clamp(100 - prob - 8, 25, 60), tag: 'Healthy', color: '#22c55e', detail: 'Current signal shows a strong launch posture.' }
    ],
    recommendations: generateRecommendationCards(rng, prob),
    liveFeedMessages: [
      'Analysing customer behaviour and adoption signals...',
      'Evaluating pricing elasticities against real personas...',
      'Generating recommendations for launch messaging...',
      'Comparing competitive positioning in the premium segment...',
      'Synthesising sentiment and objections into a plan...',
      'Estimating retention drivers for the first 90 days...'
    ],
    timelineEvents: [
      { id: 1, label: 'Simulation started', detail: 'AI agents began processing customer signals.' },
      { id: 2, label: 'Personas generated', detail: 'Priority personas were validated and ranked.' },
      { id: 3, label: 'Sentiment analysis complete', detail: 'Emotional reactions were surfaced across segments.' },
      { id: 4, label: 'Pricing analysis complete', detail: 'Price elasticity and willingness were mapped.' },
      { id: 5, label: 'Report generated', detail: 'A launch-ready intelligence profile is available.' }
    ]
  };
}

function generateRecommendationCards(rng, prob) {
  return [
    { id: 1, priority: 'Critical', title: 'Lead with privacy assurance', impact: 'Sales trust', difficulty: 'Medium', timeline: '2 weeks', revenue: '+18%', confidence: `${clamp(prob - 3, 70, 96)}%` },
    { id: 2, priority: 'High', title: 'Package first-win workflows', impact: 'Trial conversion', difficulty: 'Low', timeline: '1 week', revenue: '+14%', confidence: `${clamp(prob - 10, 65, 92)}%` },
    { id: 3, priority: 'High', title: 'Create competitor comparison content', impact: 'Competitive defense', difficulty: 'Medium', timeline: '3 weeks', revenue: '+11%', confidence: `${clamp(prob - 14, 60, 90)}%` },
    { id: 4, priority: 'Medium', title: 'Add a real-time persona dashboard', impact: 'Engagement', difficulty: 'High', timeline: '5 weeks', revenue: '+9%', confidence: `${clamp(prob - 20, 55, 88)}%` },
    { id: 5, priority: 'Medium', title: 'Offer custom onboarding templates', impact: 'Retention', difficulty: 'Low', timeline: '2 weeks', revenue: '+7%', confidence: `${clamp(prob - 15, 55, 90)}%` }
  ];
}

function spark(end, len, factor) {
  const out = [];
  for (let i = 0; i < len; i++) {
    out.push(round(end * Math.pow(i / (len - 1), 1.6) * factor));
  }
  return out;
}

function round(n) {
  return Math.round(n * 10) / 10;
}
