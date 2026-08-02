import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { buildRoutes } from './routes.js';
import { createRun } from './lib/store.js';
import { connectDB } from './lib/db.js';

try {
  process.loadEnvFile?.();
} catch {
  /* no .env present — rely on existing environment variables */
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 4000;

const app = express();
app.use(cors());
app.use(express.json({ limit: '2mb' }));

app.use('/api', buildRoutes());

app.use('/api', (req, res) => {
  res.status(404).json({ error: 'Not found' });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

const ROOT = path.resolve(__dirname, '..');
const distDir = path.join(ROOT, 'dist');
app.use(express.static(distDir, { index: false }));
app.get(['/', '/index.html'], (req, res) => res.sendFile(path.join(ROOT, 'index.html')));
app.get(['/persona.html', '/persona'], (req, res) => res.sendFile(path.join(ROOT, 'persona.html')));
app.get(['/workspace.html'], (req, res) => res.sendFile(path.join(ROOT, 'workspace.html')));
app.use((req, res, next) => {
  if (req.path.startsWith('/api/')) return next();
  res.sendFile(path.join(distDir, 'index.html'), (err) => {
    if (err) res.status(200).send('PersonaForge API is running. Frontend not built yet — run `npm run build` and serve again.');
  });
});

async function start() {
  await connectDB();
  await createRun();

  app.listen(PORT, () => {
    console.log(`PersonaForge API listening on http://localhost:${PORT}`);
  });
}

start().catch((err) => {
  console.error('Startup failed:', err.message);
  process.exit(1);
});
