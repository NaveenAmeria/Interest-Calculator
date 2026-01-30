import { useEffect, useMemo, useState } from "react";
import Card from "../components/Card";
import { api } from "../lib/api";

export default function Money() {
  const [tx, setTx] = useState([]);

  useEffect(() => {
    (async () => {
      const res = await api.get("/api/transactions");
      setTx(res.data.filter(t => t.status === "ACTIVE"));
    })();
  }, []);

  const upcoming = useMemo(() => {
    return [...tx]
      .map(t => ({ ...t, due: t.dueDate ? new Date(t.dueDate) : null }))
      .sort((a,b) => (a.due?.getTime() || 0) - (b.due?.getTime() || 0))
      .slice(0, 15);
  }, [tx]);

  return (
    <>
      <h1>Money</h1>
      <Card>
        <div style={{ fontWeight: 900, marginBottom: 10 }}>Upcoming / Outstanding</div>
        <div className="grid">
          {upcoming.map(t => (
            <div key={t._id} style={{ border: "1px solid var(--border)", borderRadius: 14, padding: 12, background: "white" }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
                <div>
                  <div style={{ fontWeight: 900 }}>{t.name}</div>
                  <div style={{ color: "var(--muted)", fontWeight: 800, marginTop: 6 }}>
                    {t.direction === "TAKEN" ? "To Pay" : "To Receive"} • Due: {t.due ? t.due.toLocaleDateString() : "-"}
                  </div>
                </div>
                <div style={{ fontWeight: 900, color: "var(--brand)" }}>₹ {t.outstanding}</div>
              </div>
            </div>
          ))}
          {!upcoming.length && <div style={{ color: "var(--muted)", fontWeight: 800 }}>No upcoming items</div>}
        </div>
      </Card>
    </>
  );
}
