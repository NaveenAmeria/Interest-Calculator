import Card from "./Card";
import Button from "./Button";
import { api } from "../lib/api";

export default function NotificationList({ items, onChanged }) {
  if (!items.length) return <Card><div style={{ color: "var(--muted)", fontWeight: 800 }}>No reminders</div></Card>;

  async function markRead(id) {
    await api.patch(`/api/notifications/${id}/read`);
    onChanged?.();
  }

  return (
    <div className="grid">
      {items.map(n => (
        <Card key={n._id} style={{ background: n.type === "OVERDUE" ? "rgba(220,38,38,.06)" : "rgba(47,91,255,.06)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
            <div>
              <div style={{ fontWeight: 900 }}>{n.title}</div>
              <div style={{ color: "var(--muted)", fontWeight: 800, marginTop: 6 }}>{n.message}</div>
              <div style={{ color: "var(--muted)", fontWeight: 700, marginTop: 6 }}>
                {new Date(n.createdAt).toLocaleString()} {n.read ? "• Read" : "• Unread"}
              </div>
            </div>
            {!n.read && <Button variant="ghost" onClick={() => markRead(n._id)}>Mark Read</Button>}
          </div>
        </Card>
      ))}
    </div>
  );
}
