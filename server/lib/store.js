import { runsCollection, docToRun } from './db.js';
import { hashString } from './rng.js';
import { stages } from './seed.js';
import { generatePersonas, generateSimulation } from './personas.js';
import { generateDashboard } from './dashboard.js';
import { generateRecommendations } from './recommendations.js';
import { generateReport } from './report.js';

let counter = 0;

const DEFAULT_BRIEF = {
  name: 'Pulse',
  audience: 'Freelancers',
  price: 29,
  category: 'Finance software',
  description: 'Financial clarity for ambitious freelancers.'
};

async function persist(run) {
  const col = await runsCollection();
  await col.updateOne(
    { _id: run.id },
    {
      $set: {
        status: run.status,
        stageIndex: run.stageIndex,
        progress: run.progress,
        stages: run.stages,
        data: run.data,
        seed: run.seed
      }
    }
  );
}

export async function createRun(brief = {}) {
  const id = `run_${Date.now().toString(36)}_${(++counter).toString(36)}`;
  const product = { ...DEFAULT_BRIEF, ...brief };
  const seed = hashString(`${product.name}:${product.audience}:${product.price}:${id}`);
  const doc = {
    _id: id,
    createdAt: new Date().toISOString(),
    status: 'queued',
    stageIndex: 0,
    progress: 0,
    seed,
    product,
    stages: stages.map((name, i) => ({ name, state: i === 0 ? 'processing' : 'pending' })),
    data: null
  };
  const col = await runsCollection();
  await col.insertOne(doc);
  processRun(id);
  return docToRun(doc);
}

function processRun(id) {
  let i = 0;
  const tick = setInterval(async () => {
    i += 1;
    const run = await getRun(id);
    if (!run) {
      clearInterval(tick);
      return;
    }
    if (i >= stages.length) {
      clearInterval(tick);
      run.data = buildData(run);
      run.status = 'complete';
      run.progress = 100;
      run.stageIndex = stages.length;
      run.stages = run.stages.map((s) => ({ ...s, state: 'complete' }));
      await persist(run);
      return;
    }
    run.stageIndex = i;
    run.progress = Math.round((i / stages.length) * 100);
    run.stages = run.stages.map((s, si) => ({
      ...s,
      state: si < i ? 'complete' : si === i ? 'processing' : 'pending'
    }));
    await persist(run);
  }, 600);
  return tick;
}

export function buildData(run) {
  const opts = { seed: run.seed, brief: run.product };
  return {
    personas: generatePersonas({ ...opts, count: 40 }),
    simulation: generateSimulation(opts),
    dashboard: generateDashboard(opts),
    recommendations: generateRecommendations(opts),
    report: generateReport(opts),
    summary: {
      personaCount: 12480,
      interactions: 25400,
      purchaseProbability: run.product.price ? Math.round(Math.min(97, Math.max(45, 78 - (run.product.price - 29) * 0.6))) : 78,
      launchReadiness: Math.round(Math.min(95, Math.max(60, 86 - (run.product.price - 29) * 0.3))),
      marketFit: 78,
      confidence: 93
    }
  };
}

export async function getRun(id) {
  const col = await runsCollection();
  const doc = await col.findOne({ _id: id });
  return doc ? docToRun(doc) : null;
}

export async function listRuns() {
  const col = await runsCollection();
  const docs = await col.find({}).sort({ createdAt: -1 }).toArray();
  return docs.map(docToRun);
}

export async function resolveRun(runId) {
  if (runId) {
    const run = await getRun(runId);
    if (run) return run;
  }
  const col = await runsCollection();
  const latest = await col.findOne({}, { sort: { createdAt: -1 } });
  if (latest) return docToRun(latest);
  return createRun(DEFAULT_BRIEF);
}

export async function seedRun(seed = 1) {
  const run = await createRun(DEFAULT_BRIEF);
  run.seed = seed;
  await persist(run);
  return run;
}
