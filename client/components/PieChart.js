"use client";
import { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

export default function PieChart({ accounts }) {
  const ref = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    if (!ref.current) return;

    const labels = accounts.map(a => a.name);
    const data = accounts.map(a => (a.totals?.given || 0) + (a.totals?.taken || 0));

    if (chartRef.current) chartRef.current.destroy();

    chartRef.current = new Chart(ref.current, {
      type: "pie",
      data: { labels, datasets: [{ data }] },
      options: { responsive: true }
    });

    return () => chartRef.current?.destroy();
  }, [accounts]);

  return <canvas ref={ref} />;
}
