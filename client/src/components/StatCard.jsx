import Card from "./Card";

export default function StatCard({ title, value }) {
  return (
    <Card>
      <div style={{ color: "var(--brand)", fontWeight: 900 }}>{title}</div>
      <div style={{ marginTop: 8, fontSize: 18, fontWeight: 900 }}>₹ {value}</div>
    </Card>
  );
}
