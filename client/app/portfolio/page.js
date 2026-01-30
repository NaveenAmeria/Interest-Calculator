"use client";
import { useEffect, useState } from "react";
import ProtectedRoute from "../../components/ProtectedRoute";
import Card from "../../components/Card";
import { api } from "../../lib/api";

export default function PortfolioPage() {
  const [accounts, setAccounts] = useState([]);

  useEffect(() => {
    (async () => {
      const res = await api.get("/api/accounts");
      setAccounts(res.data);
    })();
  }, []);

  const total = accounts.reduce((s,a)=> s + (a.totals?.given||0) + (a.totals?.taken||0), 0);

  return (
    <ProtectedRoute>
      <h1>Portfolio</h1>

      <Card>
        <div style={{ fontWeight: 900 }}>Total Exposure</div>
        <div style={{ marginTop: 6, fontSize: 20, fontWeight: 900 }}>₹ {round2(total)}</div>
      </Card>

      <div style={{ marginTop: 14, display:"grid", gap: 12 }}>
        {accounts.map(a => (
          <Card key={a._id}>
            <div style={{ display:"flex", justifyContent:"space-between", gap: 10, flexWrap:"wrap" }}>
              <div>
                <div style={{ fontWeight: 900 }}>{a.name}</div>
                <div style={{ color:"var(--muted)", fontWeight: 800 }}>{a.contact || "-"}</div>
              </div>
              <div style={{ fontWeight: 900, color:"var(--brand)" }}>
                ₹ {round2((a.totals?.given||0) + (a.totals?.taken||0))}
              </div>
            </div>
          </Card>
        ))}
        {!accounts.length && <Card><div style={{ color:"var(--muted)", fontWeight:800 }}>No accounts yet</div></Card>}
      </div>
    </ProtectedRoute>
  );
}
function round2(x){ return Math.round((x+Number.EPSILON)*100)/100; }
