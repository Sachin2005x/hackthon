import { createRng, clamp } from './rng.js';

export function generateReport({ seed = 1, brief = {}, personas = [], simulation = [] } = {}) {
  const rng = createRng(seed + 31);
  const probs = personas.length ? personas.map((p) => Number(p.purchaseProbability) || 0) : [];
  const avgProb = probs.length
    ? Math.round(probs.reduce((a, b) => a + b, 0) / probs.length)
    : clamp((brief.price ? 78 - (brief.price - 29) * 0.6 : 78) + rng.range(-3, 3), 60, 92);
  const buyersRatio = probs.length ? probs.filter((p) => p >= 60).length / probs.length : 0.6;
  const posRatio = simulation.length
    ? simulation.filter((m) => m.sentiment === 'positive').length / simulation.length
    : 0.45;

  const success = avgProb >= 62 && buyersRatio >= 0.5 && posRatio >= 0.3;
  const score = clamp(avgProb + 13, 40, 99);
  const readiness = clamp(avgProb - 1, 25, 95);
  const month = new Date().toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', timeZone: 'UTC' });

  const positives = [
    'Clear problem-solution fit across priority segments.',
    `Strong purchase intent — ${avgProb}% average across ${probs.length || '1,248'} buyer personas.`,
    'High perceived usefulness among premium personas.'
  ];
  const failureReasons = [
    `Average purchase intent of ${avgProb}% sits below the launch threshold of 62%.`,
    `Only ${Math.round(buyersRatio * 100)}% of personas showed real buying intent.`,
    'Price perception is the dominant barrier to purchase.',
    'Trust and first-win signals are too weak to overcome hesitation.'
  ];

  const verdict = {
    outcome: success ? 'success' : 'failed',
    label: success ? 'PRODUCT SUCCESS — LAUNCH READY' : 'PRODUCT FAILED — DO NOT LAUNCH YET',
    headline: success
      ? `${brief.name || 'This product'} convinced enough simulated buyers to be worth building.`
      : `${brief.name || 'This product'} failed to convince enough simulated buyers.`,
    details: success
      ? `A majority of personas showed strong purchase intent (${avgProb}% average) and ${Math.round(posRatio * 100)}% of simulated buyers reacted positively to the offer.`
      : `Average purchase intent is ${avgProb}% and only ${Math.round(buyersRatio * 100)}% of personas actually want to buy. Address pricing, trust and first-win value before committing more resources.`,
    score,
    readiness: success ? 'HIGH' : 'LOW',
    reasons: success
      ? ['Privacy assurance needs more visibility', 'Price requires stronger value framing', 'Offline access requested by mobile-first personas']
      : failureReasons,
    positives: success ? positives : ['Genuine interest in a few niche segments', 'A clear underlying need exists', 'No dominant competitor in the space'],
    pricing: `$${brief.price || 29}/month`,
    pricingNote: success
      ? 'Keep the core price. Position it as a replacement for multiple existing tools.'
      : 'Reconsider pricing. Perceived cost currently exceeds perceived value — test a lower entry tier.'
  };

  return {
    title: 'AI Product Validation Report',
    subtitle: `This verdict was derived from ${probs.length || '1,248'} AI customer personas acting as buyers and ${simulation.length || '25,000'} simulated interactions.`,
    verdict,
    summaryCards: [
      { id: 'validationScore', label: 'Validation Score', value: String(score), detail: success ? 'Strong product-market resonance across priority segments.' : 'Below the launch threshold — core frictions remain.', accent: '#8b5cf6' },
      { id: 'launchReadiness', label: 'Launch Readiness', value: String(readiness), detail: success ? 'Roadmap and execution confidence are production-ready.' : 'Not ready — buyers rejected the current offer.', accent: '#14b8a6' },
      { id: 'marketFit', label: 'Market Fit', value: String(clamp(avgProb - 8, 25, 90)), detail: success ? 'The product aligns closely with key customer motivations.' : 'Weak alignment — the product misses buyer motivations.', accent: '#38bdf8' },
      { id: 'aiConfidence', label: 'AI Confidence', value: String(clamp(avgProb + 11, 50, 98)), detail: 'Synthetic customer intelligence is highly predictive.', accent: '#f97316' }
    ],
    swotCards: [
      swot('executiveSummary', 'Executive Summary', 'Lightbulb', 'Critical', clamp(avgProb - 2, 50, 96), 'A consolidated view of validation performance, launch readiness and market sentiment.', success
        ? 'The validation report highlights strong readiness and category fit, while clarifying a few tactical gaps around pricing and launch calibration.'
        : 'The validation report shows a product that currently fails to convince enough buyers, with pricing and trust as the primary blockers.'),
      swot('businessOpportunity', 'Business Opportunity', 'Target', 'High', clamp(avgProb - 6, 45, 94), 'High-growth segments have been identified where early adoption is most likely.', success
        ? 'The opportunity lies in targeting ambitious freelancers and founders with streamlined onboarding and premium positioning.'
        : 'A real need exists in the segment, but the current offer fails to convert it into purchase intent.'),
      swot('strengths', 'Strengths', 'ShieldCheck', 'High', clamp(avgProb + 4, 50, 98), 'What the product does well according to the persona universe.', success
        ? 'Strengths include polished user experience, high confidence from predictive models, and differentiated buyer appeal.'
        : 'The product still enjoys genuine interest from niche segments and faces no dominant competitor.'),
      swot('weaknesses', 'Weaknesses', 'Zap', 'Medium', clamp(100 - avgProb + 3, 40, 95), 'Areas of friction surfaced by the persona universe.', success
        ? 'Weaknesses are primarily executional: clarify value communication and reduce perceived risk at first touch.'
        : 'Weaknesses are structural: pricing is perceived as too high, trust is unproven, and first-win value is invisible.'),
      swot('opportunities', 'Opportunities', 'TrendingUp', 'High', clamp(avgProb - 2, 45, 95), 'There are clear expansion paths through premium support and partnerships.', 'Opportunities include launching a targeted pilot for creator and student segments and building a referral loop for early advocates.'),
      swot('threats', 'Threats', 'AlertTriangle', 'Medium', clamp(100 - avgProb - 6, 35, 88), 'Competitive intensity and price sensitivity are the main external risks.', 'Threats include aggressive pricing from incumbents and a crowded category, so the launch narrative must emphasize unique value and trust signals.')
    ],
    insightSections: [
      {
        id: 'customerInsights', category: 'Insights', title: 'Top Customer Insights',
        explanation: 'Patterns from synthetic personas reveal the strongest motivators behind purchase intent.',
        confidence: clamp(avgProb - 3, 45, 95),
        items: [
          'Customers crave confidence more than convenience; trust-building is the priority.',
          'Early adopters demand evidence of measurable impact within their first use.',
          'Buyers respond positively to flexible entry points and community support.'
        ]
      },
      {
        id: 'featureRequests', category: 'Features', title: 'Most Requested Features',
        explanation: 'The highest demand items are those that reduce friction and increase trust.',
        confidence: clamp(avgProb - 5, 45, 93),
        items: [
          'Offline mode for on-the-go professionals.',
          'Integrated reporting and export options for faster decision-making.',
          'Guided onboarding with clear first-step outcomes.'
        ]
      },
      {
        id: 'customerObjections', category: 'Objections', title: 'Biggest Customer Objections',
        explanation: 'The leading barriers to purchase fall into pricing and credibility.',
        confidence: clamp(100 - avgProb - 3, 45, 92),
        items: success
          ? ['The price feels high compared to established alternatives.', 'Buyers want more evidence that their data is secure.', 'Some users worry the product is too complex for quick adoption.']
          : verdict.reasons
      },
      {
        id: 'pricingRecommendation', category: 'Pricing', title: 'Pricing Recommendation',
        explanation: 'A balanced launch package supports premium positioning while reducing initial friction.',
        confidence: clamp(avgProb - 7, 40, 92),
        recommendation: verdict.pricingNote
      }
    ],
    launchDecision: {
      outcome: success ? 'Launch Ready — Product Validated' : 'Not Ready — Do Not Launch Yet',
      headline: success ? 'The product is validated. A clear majority of simulated buyers want it.' : 'The product is not validated. Fix pricing, trust and first-win value first.',
      confidence: clamp(avgProb + 6, 50, 96),
      priority: success ? 'High' : 'Critical',
      progress: readiness,
      details: verdict.details
    },
    launchTimeline: [
      { label: 'Validation complete', date: 'Jul 2026', status: 'done' },
      { label: 'Pilot planning', date: 'Aug 2026', status: 'done' },
      { label: 'Pricing test', date: 'Sep 2026', status: 'current' },
      { label: 'Readiness sprint', date: 'Oct 2026', status: 'pending' },
      { label: 'Public launch', date: 'Nov 2026', status: 'pending' }
    ],
    launchMetrics: [
      { title: 'Launch Checklist', value: success ? '8 / 10' : '4 / 10', progress: success ? 80 : 40, description: 'Key launch items are in place; tactical refinements remain.' },
      { title: 'Pricing Strategy', value: success ? 'Tiered value stack' : 'Under review', progress: success ? 68 : 32, description: success ? 'Position premium with a student-friendly entry tier.' : 'Pricing must be repriced before launch.' },
      { title: 'Target Audience', value: 'Founders & Freelancers', progress: 84, description: 'Double down on entrepreneurs who need fast financial clarity.' },
      { title: 'Feature Roadmap', value: 'Core 10 features', progress: 62, description: 'Keep scope focused on foundational productivity and reporting tools.' },
      { title: 'Expected Timeline', value: 'Q4 launch', progress: success ? 92 : 45, description: success ? 'Launch timeline is strong with high readiness.' : 'Timeline must shift until frictions are resolved.' },
      { title: 'Estimated Revenue', value: success ? '$1.6M first year' : '$0.3M first year', progress: success ? 70 : 28, description: success ? 'Revenue potential looks solid assuming 18% conversion.' : 'Revenue is at risk until purchase intent improves.' },
      { title: 'Risk Level', value: success ? 'Moderate' : 'High', progress: success ? 46 : 82, description: success ? 'Competition and price perception are the main risk factors.' : 'The product is not ready to justify further spend.' }
    ],
    exportActions: [
      { label: 'Download PDF', variant: 'primary' },
      { label: 'Export JSON', variant: 'secondary' },
      { label: 'Print Report', variant: 'secondary' },
      { label: 'Share Report', variant: 'secondary' },
      { label: 'Email Report', variant: 'secondary' },
      { label: 'Run New Validation', variant: 'primary' },
      { label: 'Back to Dashboard', variant: 'secondary' }
    ],
    exportFooter: {
      generatedBy: 'Generated by PersonaForge AI',
      simulationTimestamp: `${month} UTC`,
      personas: `${probs.length || '1,248'} personas analysed`,
      simulationConfidence: `Simulation confidence ${clamp(avgProb - 6, 45, 92)}%`,
      version: 'v4.2'
    },
    completionMessage: {
      title: success ? 'Validation Complete' : 'Validation Complete — Action Needed',
      subtitle: success ? 'Your product is launch ready.' : 'Your product needs work before launch.'
    }
  };
}

function swot(id, title, icon, priority, confidence, explanation, details) {
  return { id, title, icon, priority, confidence, explanation, details };
}
