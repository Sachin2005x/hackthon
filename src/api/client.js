const API_BASE = import.meta.env?.VITE_API_URL || '/api';

export async function api(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options
  });
  if (!res.ok) throw new Error(`API request failed: ${res.status}`);
  return res.json();
}

let cachedRunId = null;

export async function getRunId() {
  if (cachedRunId) return cachedRunId;
  try {
    const runs = await api('/validations');
    if (runs && runs.length) {
      cachedRunId = runs[runs.length - 1].id;
      return cachedRunId;
    }
  } catch {}
  try {
    const latest = await api('/validations/latest');
    if (latest && latest.id) {
      cachedRunId = latest.id;
      return cachedRunId;
    }
  } catch {}
  return null;
}

export async function fetchWithFallback(fetcher, fallback) {
  try {
    const data = await fetcher();
    return { data, fromApi: true };
  } catch {
    return { data: fallback, fromApi: false };
  }
}
