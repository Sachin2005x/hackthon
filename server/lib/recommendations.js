import { createRng, clamp } from './rng.js';

export function generateRecommendations({ seed = 1, brief = {} } = {}) {
  const rng = createRng(seed + 21);
  const prob = clamp((brief.price ? 78 - (brief.price - 29) * 0.6 : 78) + rng.range(-3, 3), 60, 92);

  return {
    summaryCards: [
      { id: 'product', title: 'Product readiness', value: clamp(prob + 6, 70, 96), unit: '%', detail: 'Feature maturity and staging are aligned for early adopters.', trend: '+14 pts', accent: '#7c3aed', icon: 'ShieldCheck' },
      { id: 'market', title: 'Market fit', value: clamp(prob - 1, 65, 94), unit: '%', detail: 'Customer demand signals are strong across priority segments.', trend: '+11 pts', accent: '#38bdf8', icon: 'TrendingUp' },
      { id: 'risk', title: 'Business risk', value: clamp(100 - prob - 4, 12, 50), unit: '%', detail: 'Risk exposure is low with current go-to-market assumptions.', trend: '-9 pts', accent: '#f97316', icon: 'AlertTriangle' },
      { id: 'confidence', title: 'AI confidence', value: clamp(prob + 9, 70, 98), unit: '%', detail: 'Model certainty remains high across persona behaviours.', trend: '+7 pts', accent: '#22c55e', icon: 'Sparkles' }
    ],
    recommendations: [
      rec(rng, prob, 1, 'Activate a privacy-first trust path', 'Critical', 'Trust signal lift', 'Medium', '2 weeks', '+18%', 'Early adopter personas signal that privacy reassurance is the most important purchase trigger in the premium segment. Reinforcing trust at first contact lowers initial drop-off.', 'Design a dedicated trust section, add security proof points, and run a privacy-first A/B test on the landing flow.', '#fb7185'),
      rec(rng, prob, 2, 'Package first-win workflows', 'High', 'Conversion lift', 'Low', '1 week', '+14%', 'Personas consistently want a fast signal that the product delivers value immediately. A first-win workflow reduces friction and gives buyers a clear reason to commit.', 'Create a simplified onboarding funnel that highlights the first key insight in under 60 seconds.', '#60a5fa'),
      rec(rng, prob, 3, 'Launch competitor comparison content', 'High', 'Competitive defense', 'Medium', '3 weeks', '+12%', 'Prospective buyers compare alternatives before they commit. Clear differentiation in marketing content helps reduce churn from pricing and feature uncertainty.', 'Publish a comparison guide that shows where the product wins on accuracy, speed, and premium customer intelligence.', '#60a5fa'),
      rec(rng, prob, 4, 'Build a persona-led onboarding experience', 'Medium', 'Engagement boost', 'High', '4 weeks', '+10%', 'Users want onboarding that feels tailored to their context. Persona-driven onboarding improves early retention by matching the product narrative to customer needs.', 'Map the top five persona journeys and surface the most relevant features in the first onboarding cycle.', '#f59e0b'),
      rec(rng, prob, 5, 'Enable self-serve analytics for early customers', 'Medium', 'Retention gain', 'Medium', '5 weeks', '+9%', 'Buyers who can explore their own insights feel more ownership over the product. Self-serve analytics keep customers engaged beyond the first purchase.', 'Add a lightweight analytics dashboard with key persona metrics and usage signals for trial users.', '#f59e0b'),
      rec(rng, prob, 6, 'Optimize pricing tiers with clear value brackets', 'Critical', 'Price acceptance', 'High', '3 weeks', '+16%', 'Pricing confusion is a top barrier. Better tier clarity and explicit value brackets increase buyer confidence and reduce hesitation at checkout.', 'Rework tier copy with explicit outcomes, persona use cases, and a clear rationale for each package.', '#fb7185'),
      rec(rng, prob, 7, 'Pilot premium ecosystem bundles', 'Medium', 'Average revenue', 'Medium', '6 weeks', '+11%', 'High-intent personas respond well to bundled promise of multiple benefits. Bundles can lift average deal size if the included features solve a cohesive problem set.', 'Test a bundle that combines product intelligence, pricing insights, and onboarding templates for premium buyers.', '#f59e0b'),
      rec(rng, prob, 8, 'Create customer success rituals', 'Low', 'Long-term loyalty', 'Low', '4 weeks', '+7%', 'Low-risk customers value routine and guidance. Consistent success rituals help them realize sustained value and improve advocacy.', 'Develop onboarding checkpoints, follow-up nudges, and success playbooks for new customers.', '#22c55e')
    ],
    actionChecklist: [
      { id: 'reduce-price', label: 'Reduce price', completed: false },
      { id: 'offline-mode', label: 'Add Offline Mode', completed: false },
      { id: 'improve-onboarding', label: 'Improve Onboarding', completed: false },
      { id: 'focus-students', label: 'Focus Students', completed: false },
      { id: 'increase-marketing', label: 'Increase Marketing', completed: false }
    ]
  };
}

function rec(rng, prob, id, title, priority, impact, difficulty, timeline, revenue, reasoning, nextAction, accent) {
  return {
    id,
    title,
    priority,
    impact,
    confidence: clamp(prob + rng.range(-8, 6), 65, 97),
    revenue,
    difficulty,
    timeline,
    reasoning,
    nextAction,
    accent
  };
}
