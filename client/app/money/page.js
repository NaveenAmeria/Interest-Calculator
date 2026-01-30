"use client";
import { useEffect, useMemo, useState } from "react";
import ProtectedRoute from "../../components/ProtectedRoute";
import Card from "../../components/Card";
import { api } from "../../lib/api";

export default function MoneyPage() {
  const [tx, setTx] = useState([]);

  useEffect(() => {
    (async () => {
      const res = await api.get("/api/transactions");
      setTx(res.data.filter(t => t.status === "ACTIVE"));
    })();
  }, []);

  const upcoming = useMemo(() => {
    const now = new Date();
    return tx
      .map(t => {
        const due = new Date(t.date);
        due.setMonth(due.getMonth() + t.durationMonths);
        return { ...t, due };
      })
      .sort((a,b)=> a.due - b.due)
      .slice(0, 10);
  }, [tx]);

  return (
    <ProtectedRoute>
      <h1>Money</h1>

      <Card>
        <div style={{ fontWeight: 900, marginBottom: 10 }}>Upcoming / Outstanding</div>
        <div style={{ display:"grid", gap: 10 }}>
          {upcoming.map(t => (
            <div key={t._id} style={{ border:"1px solid var(--border)", borderRadius: 12, padding: 12 }}>
              <div style={{ display:"flex", justifyContent:"space-between", gap:10, flexWrap:"wrap" }}>
                <div>
                  <div style={{ fontWeight: 900 }}>{t.name}</div>
                  <div style={{ color:"var(--muted)", fontWeight: 800 }}>
                    {t.type === "TAKEN" ? "To Pay" : "To Receive"} • Due: {t.due.toLocaleDateString()}
                  </div>
                </div>
                <div style={{ fontWeight: 900, color:"var(--brand)" }}>₹ {t.computed?.total}</div>
              </div>
            </div>
          ))}
          {!upcoming.length && <div style={{ color:"var(--muted)", fontWeight:800 }}>No upcoming items</div>}
        </div>
      </Card>
    </ProtectedRoute>
  );
}
