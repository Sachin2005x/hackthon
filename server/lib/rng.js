export function createRng(seed) {
  let state = (Number(seed) || 1) >>> 0;
  const next = () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 4294967296;
  };
  const range = (min, max) => Math.round(min + next() * (max - min));
  const pick = (arr) => arr[Math.floor(next() * arr.length)];
  const shuffled = (arr) => {
    const copy = arr.slice();
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(next() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  };
  return { next, range, pick, shuffled };
}

export const clamp = (n, min, max) => Math.min(max, Math.max(min, n));

export const hashString = (str) => {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
};
