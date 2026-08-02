import { createRng, clamp } from './rng.js';
import {
  nameSeeds, incomes, behaviours, devices, platforms, brands, techSavviness,
  priceSensitivity, customerTypes, painPoints, goals, decisionSpeeds, psychologies,
  triggers, objections, marketing
} from './seed.js';

export function generatePersonas({ seed = 1, count = 40, brief = {} } = {}) {
  const rng = createRng(seed);
  const pool = rng.shuffled(nameSeeds);
  const base = clamp(brief.price ? 78 - (brief.price - 29) * 0.6 : 78, 45, 95);
  const personas = [];

  for (let i = 0; i < count; i++) {
    const [name, profession, country] = pool[i % pool.length];
    const purchaseProbability = Math.round(clamp(base + rng.range(-14, 16) + (i % 5), 40, 97));
    const confidence = Math.round(clamp(72 + rng.range(0, 25), 60, 99));
    personas.push({
      id: i + 1,
      name,
      age: 23 + rng.range(0, 37),
      gender: i % 3 === 0 ? 'Female' : i % 3 === 1 ? 'Male' : 'Non-binary',
      country,
      profession,
      income: rng.pick(incomes),
      behaviour: rng.pick(behaviours),
      techSavviness: rng.pick(techSavviness),
      priceSensitivity: rng.pick(priceSensitivity),
      purchaseProbability,
      confidence,
      customerType: rng.pick(customerTypes),
      painPoint: rng.pick(painPoints),
      goal: rng.pick(goals),
      device: rng.pick(devices),
      platform: rng.pick(platforms),
      brands: rng.pick(brands),
      decisionSpeed: rng.pick(decisionSpeeds),
      biography: `${name.split(' ')[0]} is a ${profession.toLowerCase()} based in ${country}, balancing ambitious work with a need for simple, trustworthy tools.`,
      motivation: `The promise of immediate financial clarity and fewer disconnected tools makes ${brief.name || 'Pulse'} compelling.`,
      psychology: rng.pick(psychologies),
      triggers: rng.pick(triggers),
      objections: rng.pick(objections),
      marketing: rng.pick(marketing),
      decisionExplanation: `I would likely purchase because ${brief.name || 'Pulse'} fits my monthly software budget and gives me a faster, calmer way to understand my finances.`
    });
  }
  return personas;
}

export function generateSimulation({ seed = 1, brief = {} } = {}) {
  const rng = createRng(seed + 7);
  const topics = ['Value', 'Privacy', 'Features', 'Pricing', 'Competition', 'Support'];
  const personalities = ['Vision-led', 'Analytical', 'Outcome-led', 'Sceptical', 'Pragmatic', 'Practical'];
  const sentiments = ['positive', 'neutral', 'negative'];
  const emotions = { positive: '😍 Interested', neutral: '🤔 Curious', negative: '😟 Concerned' };
  const base = clamp(brief.price ? 78 - (brief.price - 29) * 0.6 : 78, 45, 95);

  const messages = generatePersonas({ seed: seed + 3, count: 8, brief }).map((p, i) => {
    const sentiment = sentiments[i % 3];
    const topic = rng.pick(topics);
    return {
      id: i + 1,
      name: p.name,
      age: p.age,
      role: p.profession,
      income: p.income,
      behaviour: p.behaviour,
      probability: p.purchaseProbability,
      personality: rng.pick(personalities),
      text: pickOpinion(topic, sentiment, brief),
      sentiment,
      emotion: emotions[sentiment],
      confidence: clamp(p.confidence + rng.range(-6, 6), 55, 99),
      topic
    };
  });
  return messages;
}

function pickOpinion(topic, sentiment, brief) {
  const name = brief.name || 'Pulse';
  const value = {
    positive: 'I would pay for this if it replaces my current reporting stack.',
    neutral: 'The value is clear, but I need to understand the full picture first.',
    negative: 'I need to see a clearer first win before I commit.'
  };
  const privacy = {
    positive: 'The privacy story is exactly what I was hoping for.',
    neutral: 'The value is clear, but I need to understand the privacy model first.',
    negative: 'I still have questions about how my data is handled.'
  };
  const features = {
    positive: 'I would want a team plan before committing — this covers my needs.',
    neutral: 'The feature set looks solid but I want to test the core flow.',
    negative: 'I worry the feature set is broader than what I actually need.'
  };
  const pricing = {
    positive: 'Priced fairly for the time it saves me every single week.',
    neutral: 'This feels fair only when the first result is immediate.',
    negative: `$${brief.price || 29} feels expensive without a trial period.`
  };
  const competition = {
    positive: 'This clearly beats the tools I already use.',
    neutral: 'I would compare it with the tools I already pay for before switching.',
    negative: 'My current stack already covers most of this.'
  };
  const support = {
    positive: 'Fast, human support would seal the deal for me.',
    neutral: 'I need evidence that support stays responsive at scale.',
    negative: 'I have been burned by slow support before — show me the proof.'
  };
  const map = { Value: value, Privacy: privacy, Features: features, Pricing: pricing, Competition: competition, Support: support };
  return map[topic][sentiment].replace(/this/, name);
}
