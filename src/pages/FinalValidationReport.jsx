import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import localData from '../data/phase9Data.json';
import { api, getRunId } from '../api/client';
import { ReportIntro } from '../components/phase9/ReportIntro';
import { ValidationSummaryCard } from '../components/phase9/ValidationSummaryCard';
import { ReportSectionCard } from '../components/phase9/ReportSectionCard';
import { ReportInsightSection } from '../components/phase9/ReportInsightSection';
import { LaunchDecisionCard } from '../components/phase9/LaunchDecisionCard';
import { LaunchDetailCard } from '../components/phase9/LaunchDetailCard';
import { ExportCentre } from '../components/phase9/ExportCentre';

export default function FinalValidationReport() {
  const [data, setData] = useState(localData);

  useEffect(() => {
    let alive = true;
    (async () => {
      const id = await getRunId();
      if (!id || !alive) return;
      try {
        const d = await api(`/validations/${id}/report`);
        if (alive && d && d.summaryCards) setData(d);
      } catch {}
    })();
    return () => { alive = false; };
  }, []);

  return (
    <section className="page phase9-page">
      <ReportIntro title={data.title} subtitle={data.subtitle} />

      <motion.div className="phase9-summary-grid" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.05 }}>
        {data.summaryCards.map((card) => (
          <ValidationSummaryCard key={card.id} label={card.label} value={card.value} detail={card.detail} accent={card.accent} />
        ))}
      </motion.div>

      <motion.div className="phase9-report-grid" initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.08 }}>
        <div className="phase9-swot-grid">
          {data.swotCards.map((section) => (
            <ReportSectionCard key={section.id} section={section} />
          ))}
        </div>

        <div className="phase9-insight-grid">
          {data.insightSections.map((section) => (
            <ReportInsightSection key={section.id} section={section} />
          ))}
        </div>
      </motion.div>

      <motion.div className="phase9-launch-grid" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
        <LaunchDecisionCard decision={data.launchDecision} timeline={data.launchTimeline} />

        <div className="phase9-launch-details">
          {data.launchMetrics.map((item) => (
            <LaunchDetailCard key={item.title} item={item} />
          ))}
        </div>
      </motion.div>

      <ExportCentre actions={data.exportActions} footer={data.exportFooter} />

      <motion.section className="phase9-completion-banner" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.45, delay: 0.12 }}>
        <h2>{data.completionMessage.title}</h2>
        <p>{data.completionMessage.subtitle}</p>
      </motion.section>
    </section>
  );
}
