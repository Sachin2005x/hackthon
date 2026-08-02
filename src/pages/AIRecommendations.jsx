import { useEffect, useState } from 'react';
import { ExecutiveSummary } from '../components/phase7/ExecutiveSummary';
import { RecommendationList } from '../components/phase7/RecommendationList';
import { DecisionSimulator } from '../components/phase7/DecisionSimulator';
import { ActionCentre } from '../components/phase7/ActionCentre';
import localData from '../data/phase7Data.json';
import { api, getRunId } from '../api/client';

export default function AIRecommendations() {
  const [data, setData] = useState(localData);

  useEffect(() => {
    let alive = true;
    (async () => {
      const id = await getRunId();
      if (!id || !alive) return;
      try {
        const d = await api(`/validations/${id}/recommendations`);
        if (alive && d && d.recommendations) setData(d);
      } catch {}
    })();
    return () => { alive = false; };
  }, []);

  return (
    <section className="page phase7-page">
      <header className="phase7-header">
        <span className="label">Phase 7</span>
        <h1>AI Strategic Recommendations</h1>
        <p className="phase7-subtitle">
          Recommendations are generated from thousands of AI personas, scoring product readiness, market fit, business risk, and confidence.
        </p>
      </header>

      <ExecutiveSummary cards={data.summaryCards} />
      <DecisionSimulator />
      <ActionCentre checklist={data.actionChecklist} />
      <RecommendationList items={data.recommendations} />
    </section>
  );
}
