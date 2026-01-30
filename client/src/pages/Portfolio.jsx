import { useEffect, useMemo, useState } from "react";
import Card from "../components/Card";
import { api } from "../lib/api";

function round2(x){ return Math.round((x+Number.EPSILON)*100)/100; }

export default function Portfolio() {
  const [accounts, setAccounts] = useState([]);

  useEffect(() => {
    (async () => {
      const res = await api.get("/api/accounts");
      setAccounts(res.data);
    })();
  }, []);

  const totalExposure = useMemo(() => {
    return round2(accounts.reduce((s, a) => s + (a.totals?.given || 0) + (a.totals?.taken || 0), 0));
  }, [accounts]);

  return (
    <>
      <h1>Portfolio</h1>
      <Card>
        <div style={{ fontWeight: 900 }}>Total Exposure</div>
        <div style={{ marginTop: 6, fontSize: 22, fontWeight: 900, color: "var(--brand)" }}>₹ {totalExposure}</div>
      </Card>

      <div className="grid" style={{ marginTop: 14 }}>
        {accounts.map(a => (
          <Card key={a._id}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
              <div>
                <div style={{ fontWeight: 900 }}>{a.name}</div>
                <div style={{ color: "var(--muted)", fontWeight: 800 }}>{a.contact || "-"}</div>
              </div>
              <div style={{ fontWeight: 900 }}>
                ₹ {round2((a.totals?.given || 0) + (a.totals?.taken || 0))}
              </div>
            </div>
          </Card>
        ))}
        {!accounts.length && <Card><div style={{ color: "var(--muted)", fontWeight: 800 }}>No accounts yet</div></Card>}
      </div>
    </>
  );
}
