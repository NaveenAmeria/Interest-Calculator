export default function NotificationList({ items }) {
  if (!items.length) return <div style={{ color:"var(--muted)", fontWeight:800 }}>No reminders</div>;

  return (
    <div style={{ display:"grid", gap: 10 }}>
      {items.map(n => (
        <div key={n.id} style={{
          border:"1px solid var(--border)",
          borderRadius: 12,
          padding: 12,
          background: n.type === "OVERDUE" ? "rgba(220,38,38,.06)" : "rgba(47,91,255,.06)"
        }}>
          <div style={{ fontWeight: 900 }}>{n.title}</div>
          <div style={{ color:"var(--muted)", fontWeight: 800, marginTop: 6 }}>{n.message}</div>
        </div>
      ))}
    </div>
  );
}
