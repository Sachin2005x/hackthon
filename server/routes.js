import { Router } from 'express';
import { createRun, deleteRun, getRun, listRuns, resolveRun, seedRun } from './lib/store.js';
import { generatePersonas } from './lib/personas.js';
import { predictScenario } from './lib/scenario.js';
import { simulationTimeline } from './lib/seed.js';

export function buildRoutes() {
  const router = Router();

  router.get('/health', (req, res) => {
    res.json({ status: 'ok', service: 'personaforge-api', time: new Date().toISOString() });
  });

  router.get('/mission', (req, res) => {
    res.json({
      agents: [
        { name: 'Persona Synthesiser', role: 'Generating behavioural variance', color: 'violet' },
        { name: 'Signal Interpreter', role: 'Extracting decision patterns', color: 'teal' },
        { name: 'Market Intelligence', role: 'Comparing category signals', color: 'yellow' },
        { name: 'Safety Observer', role: 'Verifying model confidence', color: 'green' }
      ],
      events: [
        'Persona group 04 reached consensus',
        'Price acceptance signal recalibrated',
        'New objection cluster identified',
        'Behaviour model confidence increased',
        'Competitive signal archive refreshed'
      ],
      metrics: [
        { label: 'Inference speed', value: 84, unit: 'ms', trend: '↑ 12% faster' },
        { label: 'Model confidence', value: 94.2, unit: '%', trend: '↑ stable' },
        { label: 'Signal coverage', value: 98.6, unit: '%', trend: '↑ 42 segments' }
      ]
    });
  });

  router.get('/demo', (req, res) => {
    res.json({
      scenes: [
        ['Landing', 'Predict customer behaviour before reality does.', 'Opening the PersonaForge intelligence system.'],
        ['Product Upload', 'Pulse — Financial clarity for freelancers', 'Product brief, pricing model and audience context received.'],
        ['AI Processing', 'Building the customer universe', 'Initialising agents · mapping behaviour · calibrating motivations.'],
        ['Persona Generation', '12,480 AI customers generated', 'Synthesising demographics, psychology and purchase patterns.'],
        ['Simulation Engine', 'Personas are forming opinions', '“I would pay for this if it replaces my reporting stack.”'],
        ['Analytics Dashboard', 'Signal emerging from the noise', 'Purchase likelihood has reached 84%.'],
        ['AI Recommendations', 'Your next best moves', 'Lead with privacy proof. Reframe price as tool replacement.'],
        ['Scenario Lab', 'Testing the strongest launch plan', 'Tiered plan increases market fit to 89%.'],
        ['Final Validation Report', 'Your product is launch ready', 'Validation score 91 · Confidence 94.2%.']
      ]
    });
  });

  router.get('/validations', async (req, res) => {
    res.json(await listRuns());
  });

  router.get('/validations/latest', async (req, res) => {
    res.json(await getRun((await resolveRun()).id));
  });

  router.post('/validations', async (req, res) => {
    const { name, audience, price, category, description } = req.body || {};
    const run = await createRun({ name, audience, price, category, description });
    res.status(201).json({ id: run.id, status: run.status, progress: run.progress, product: run.product, stages: run.stages });
  });

  router.post('/validations/seed', async (req, res) => {
    const { seed } = req.body || {};
    const run = await seedRun(Number(seed) || 1);
    res.status(201).json({ id: run.id, status: run.status, progress: run.progress, product: run.product, seed: run.seed });
  });

  router.get('/validations/:id', async (req, res) => {
    const run = await getRun(req.params.id);
    if (!run) return res.status(404).json({ error: 'Run not found' });
    res.json(run);
  });

  router.delete('/validations/:id', async (req, res) => {
    const ok = await deleteRun(req.params.id);
    if (!ok) return res.status(404).json({ error: 'Run not found' });
    res.json({ ok: true });
  });

  router.get('/validations/:id/personas', async (req, res) => {
    const run = await resolveRun(req.params.id);
    if (!run.data) return res.status(202).json({ status: run.status, stages: run.stages, personas: [] });
    let items = run.data.personas;
    const { search, country, profession, income, type, sensitivity } = req.query;
    const age = req.query.age;
    let filtered = items;
    if (search) filtered = filtered.filter((p) => Object.values(p).join(' ').toLowerCase().includes(search.toLowerCase()));
    if (country) filtered = filtered.filter((p) => p.country === country);
    if (profession) filtered = filtered.filter((p) => p.profession === profession);
    if (income) filtered = filtered.filter((p) => p.income === income);
    if (type) filtered = filtered.filter((p) => p.customerType === type);
    if (sensitivity) filtered = filtered.filter((p) => p.priceSensitivity === sensitivity);
    if (age === '18–30') filtered = filtered.filter((p) => p.age <= 30);
    if (age === '31–40') filtered = filtered.filter((p) => p.age >= 31 && p.age <= 40);
    if (age === '41+') filtered = filtered.filter((p) => p.age >= 41);
    const sort = req.query.sort || 'high';
    filtered = [...filtered].sort((a, b) => {
      if (sort === 'low') return a.purchaseProbability - b.purchaseProbability;
      if (sort === 'confidence') return b.confidence - a.confidence;
      if (sort === 'new') return b.id - a.id;
      if (sort === 'alpha') return a.name.localeCompare(b.name);
      return b.purchaseProbability - a.purchaseProbability;
    });
    res.json({ status: run.status, stages: run.stages, total: items.length, personas: filtered });
  });

  router.post('/validations/:id/personas/generate', async (req, res) => {
    const run = await resolveRun(req.params.id);
    const { count = 40, seed } = req.body || {};
    const personas = generatePersonas({ count, seed: Number(seed) || run.seed, brief: run.product });
    res.json({ count: personas.length, personas });
  });

  router.get('/validations/:id/simulation', async (req, res) => {
    const run = await resolveRun(req.params.id);
    if (!run.data) return res.status(202).json({ status: run.status, stages: run.stages, messages: [], timeline: simulationTimeline });
    res.json({ status: run.status, messages: run.data.simulation, timeline: simulationTimeline });
  });

  router.get('/validations/:id/dashboard', async (req, res) => {
    const run = await resolveRun(req.params.id);
    if (!run.data) return res.status(202).json({ status: run.status, stages: run.stages });
    res.json(run.data.dashboard);
  });

  router.get('/validations/:id/recommendations', async (req, res) => {
    const run = await resolveRun(req.params.id);
    if (!run.data) return res.status(202).json({ status: run.status, stages: run.stages });
    res.json(run.data.recommendations);
  });

  router.get('/validations/:id/report', async (req, res) => {
    const run = await resolveRun(req.params.id);
    if (!run.data) return res.status(202).json({ status: run.status, stages: run.stages });
    res.json(run.data.report);
  });

  router.post('/scenario/predict', (req, res) => {
    res.json(predictScenario(req.body || {}));
  });

  return router;
}
