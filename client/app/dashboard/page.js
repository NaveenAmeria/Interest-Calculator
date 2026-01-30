"use client";
import { useEffect, useMemo, useState } from "react";
import ProtectedRoute from "../../components/ProtectedRoute";
import Card from "../../components/Card";
import { api } from "../../lib/api";
import PieChart from "../../components/PieChart";

function StatCard({ title, value }) {
  return (
    <Card>
      <div style={{ color:"var(--brand)", fontWeight: 900 }}>{title}</div>
      <div style={{ marginTop: 8, fontSize: 18, fontWeight: 900 }}>₹ {value}</div>
    </Card>
  );
}

export default function DashboardPage() {
  const [tx, setTx] = useState([]);
  const [accounts, setAccounts] = useState([]);

  useEffect(() => {
    (async () => {
      const [tRes, aRes] = await Promise.all([
        api.get("/api/transactions"),
        api.get("/api/accounts")
      ]);
      setTx(tRes.data);
      setAccounts(aRes.data);
    })();
  }, []);

  const summary = useMemo(() => {
    let totalGiven = 0, totalTaken = 0, interestRecv = 0, interestPay = 0;
    for (const t of tx) {
      if (t.type === "GIVEN") { totalGiven += t.computed.total; interestRecv += t.computed.interest; }
      else { totalTaken += t.computed.total; interestPay += t.computed.interest; }
    }
    return {
      totalGiven: round2(totalGiven),
      totalTaken: round2(totalTaken),
      interestRecv: round2(interestRecv),
      interestPay: round2(interestPay)
    };
  }, [tx]);

  return (
    <ProtectedRoute>
      <h1>Dashboard</h1>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(220px, 1fr))", gap: 14 }}>
        <StatCard title="Total Given (Including Interest)" value={summary.totalGiven} />
        <StatCard title="Total Taken (Including Interest)" value={summary.totalTaken} />
        <StatCard title="Interest Receivable" value={summary.interestRecv} />
        <StatCard title="Interest Payable" value={summary.interestPay} />
      </div>

      <div style={{ marginTop: 18, display:"grid", gridTemplateColumns:"1fr", gap:14 }}>
        <Card>
          <div style={{ fontWeight: 900, marginBottom: 10 }}>Portfolio Split (Accounts)</div>
          <PieChart accounts={accounts} />
        </Card>
      </div>
    </ProtectedRoute>
  );
}

function round2(x){ return Math.round((x+Number.EPSILON)*100)/100; }
