import { createRng, clamp } from './rng.js';

export function generateReport({ seed = 1, brief = {} } = {}) {
  const rng = createRng(seed + 31);
  const prob = clamp((brief.price ? 78 - (brief.price - 29) * 0.6 : 78) + rng.range(-3, 3), 60, 92);
  const score = clamp(prob + 13, 75, 99);
  const month = new Date().toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', timeZone: 'UTC' });

  return {
    title: 'AI Product Validation Report',
    subtitle: `This report was generated after analysing 1,248 AI customer personas and over 25,000 simulated customer interactions.`,
    summaryCards: [
      { id: 'validationScore', label: 'Validation Score', value: String(score), detail: 'Strong product-market resonance across priority segments.', accent: '#8b5cf6' },
      { id: 'launchReadiness', label: 'Launch Readiness', value: String(clamp(prob - 1, 70, 95)), detail: 'Roadmap and execution confidence are production-ready.', accent: '#14b8a6' },
      { id: 'marketFit', label: 'Market Fit', value: String(clamp(prob - 8, 62, 90)), detail: 'The product aligns closely with key customer motivations.', accent: '#38bdf8' },
      { id: 'aiConfidence', label: 'AI Confidence', value: String(clamp(prob + 11, 72, 98)), detail: 'Synthetic customer intelligence is highly predictive.', accent: '#f97316' }
    ],
    swotCards: [
      swot('executiveSummary', 'Executive Summary', 'Lightbulb', 'Critical', clamp(prob - 2, 70, 96), 'A consolidated view of validation performance, launch readiness and market sentiment.', 'The validation report highlights strong readiness and category fit, while clarifying a few tactical gaps around pricing and launch calibration.'),
      swot('businessOpportunity', 'Business Opportunity', 'Target', 'High', clamp(prob - 6, 66, 94), 'High-growth segments have been identified where early adoption is most likely.', 'The opportunity lies in targeting ambitious freelancers and founders with streamlined onboarding, premium positioning and bundled analytics support.'),
      swot('strengths', 'Strengths', 'ShieldCheck', 'High', clamp(prob + 4, 72, 98), 'The product resonates strongly with personas who value clear workflows and fast time-to-value.', 'Strengths include polished user experience, high confidence from predictive models, and differentiated buyer appeal for premium creative professionals.'),
      swot('weaknesses', 'Weaknesses', 'Zap', 'Medium', clamp(100 - prob - 3, 55, 90), 'Areas of friction have been surfaced around price perception and feature clarity.', 'Weaknesses are primarily executional: clarify value communication, simplify the onboarding path, and reduce perceived risk at first touch.'),
      swot('opportunities', 'Opportunities', 'TrendingUp', 'High', clamp(prob - 2, 66, 95), 'There are clear expansion paths through premium support, partnerships, and UX-driven retention plays.', 'Opportunities include launching a targeted pilot for the student and creator segments, and building a referral loop that rewards early advocates.'),
      swot('threats', 'Threats', 'AlertTriangle', 'Medium', clamp(100 - prob - 6, 55, 88), 'Competitive intensity and price sensitivity are the main external risks.', 'Threats include aggressive pricing from incumbents and a crowded category, so the launch narrative must emphasize unique value and trust signals.')
    ],
    insightSections: [
      {
        id: 'customerInsights', category: 'Insights', title: 'Top Customer Insights',
        explanation: 'Patterns from synthetic personas reveal the strongest motivators behind purchase intent.',
        confidence: clamp(prob - 3, 68, 95),
        items: [
          'Customers crave confidence more than convenience; trust-building is the priority.',
          'Early adopters demand evidence of measurable impact within their first use.',
          'Students and founders respond positively to flexible entry points and community support.'
        ]
      },
      {
        id: 'featureRequests', category: 'Features', title: 'Most Requested Features',
        explanation: 'The highest demand items are those that reduce friction and increase trust.',
        confidence: clamp(prob - 5, 66, 93),
        items: [
          'Offline mode for on-the-go professionals.',
          'Integrated reporting and export options for faster decision-making.',
          'Guided onboarding with clear first-step outcomes.'
        ]
      },
      {
        id: 'customerObjections', category: 'Objections', title: 'Biggest Customer Objections',
        explanation: 'The leading barriers to purchase fall into pricing and credibility.',
        confidence: clamp(100 - prob - 3, 60, 92),
        items: [
          `The price feels high compared to established alternatives.`,
          'Buyers want more evidence that their data is secure and private.',
          'Some users worry the product is too complex for quick adoption.'
        ]
      },
      {
        id: 'pricingRecommendation', category: 'Pricing', title: 'Pricing Recommendation',
        explanation: 'A balanced launch package supports premium positioning while reducing initial friction.',
        confidence: clamp(prob - 7, 62, 92),
        recommendation: `Position the product at $${brief.price || 29}/month with an annual option at 15% off and an introductory freemium tier for students.`
      }
    ],
    launchDecision: {
      outcome: 'Launch After Improvements',
      headline: 'The product is strong, but a focused readiness sprint will maximise launch impact.',
      confidence: clamp(prob - 4, 65, 94),
      priority: 'High',
      progress: clamp(prob - 6, 55, 88),
      details: 'Fine-tune pricing, polish onboarding, and validate key customer objections before releasing to a wider market.'
    },
    launchTimeline: [
      { label: 'Validation complete', date: 'Jul 2026', status: 'done' },
      { label: 'Pilot planning', date: 'Aug 2026', status: 'done' },
      { label: 'Pricing test', date: 'Sep 2026', status: 'current' },
      { label: 'Readiness sprint', date: 'Oct 2026', status: 'pending' },
      { label: 'Public launch', date: 'Nov 2026', status: 'pending' }
    ],
    launchMetrics: [
      { title: 'Launch Checklist', value: '8 / 10', progress: 80, description: 'Key launch items are in place; two tactical refinements remain.' },
      { title: 'Pricing Strategy', value: 'Tiered value stack', progress: 68, description: 'Position premium with a student-friendly entry tier.' },
      { title: 'Marketing Strategy', value: 'Targeted creator acquisition', progress: 74, description: 'Focus on paid partnerships, community campaigns, and referral loops.' },
      { title: 'Target Audience', value: 'Founders & Freelancers', progress: 84, description: 'Double down on entrepreneurs who need fast financial clarity.' },
      { title: 'Feature Roadmap', value: 'Core 10 features', progress: 62, description: 'Keep scope focused on foundational productivity and reporting tools.' },
      { title: 'Expected Timeline', value: 'Q4 launch', progress: 92, description: 'Launch timeline is strong with high readiness for a November pilot.' },
      { title: 'Estimated Revenue', value: '$1.6M first year', progress: 70, description: 'Revenue potential looks solid assuming 18% conversion.' },
      { title: 'Break-even Prediction', value: '6 months', progress: 58, description: 'Assumes efficient acquisition and early premium retention.' },
      { title: 'Risk Level', value: 'Moderate', progress: 46, description: 'Competition and price perception are the main risk factors.' }
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
      personas: '1,248 personas analysed',
      simulationConfidence: `Simulation confidence ${clamp(prob - 6, 62, 92)}%`,
      version: 'v4.2'
    },
    completionMessage: {
      title: 'Validation Complete',
      subtitle: 'Your product is ready for the next decision.'
    }
  };
}

function swot(id, title, icon, priority, confidence, explanation, details) {
  return { id, title, icon, priority, confidence, explanation, details };
}
