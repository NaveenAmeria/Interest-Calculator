import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
ChartJS.register(ArcElement, Tooltip, Legend);

export default function PieChart({ accounts }) {
  const labels = accounts.map(a => a.name);
  const values = accounts.map(a => (a.totals?.given || 0) + (a.totals?.taken || 0));

  const data = {
    labels,
    datasets: [{ data: values }]
  };

  return <Pie data={data} />;
}
