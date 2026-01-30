import { useEffect, useMemo, useState } from "react";
import Card from "../components/Card";
import StatCard from "../components/StatCard";
import PieChart from "../components/PieChart";
import { api } from "../lib/api";

function round2(x){ return Math.round((x+Number.EPSILON)*100)/100; }

export default function Dashboard() {
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
    let outstandingGiven = 0, outstandingTaken = 0;

    for (const t of tx) {
      if (t.direction === "GIVEN") {
        totalGiven += t.computed?.total || 0;
        interestRecv += t.computed?.interest || 0;
        outstandingGiven += t.outstanding || 0;
      } else {
        totalTaken += t.computed?.total || 0;
        interestPay += t.computed?.interest || 0;
        outstandingTaken += t.outstanding || 0;
      }
    }
    return {
      totalGiven: round2(totalGiven),
      totalTaken: round2(totalTaken),
      interestRecv: round2(interestRecv),
      interestPay: round2(interestPay),
      outstandingGiven: round2(outstandingGiven),
      outstandingTaken: round2(outstandingTaken)
    };
  }, [tx]);

  return (
    <>
      <h1>Dashboard</h1>

      <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
        <StatCard title="Total Given (incl. interest)" value={summary.totalGiven} />
        <StatCard title="Total Taken (incl. interest)" value={summary.totalTaken} />
        <StatCard title="Interest Receivable" value={summary.interestRecv} />
        <StatCard title="Interest Payable" value={summary.interestPay} />
        <StatCard title="Outstanding To Receive" value={summary.outstandingGiven} />
        <StatCard title="Outstanding To Pay" value={summary.outstandingTaken} />
      </div>

      <div className="grid" style={{ marginTop: 14, gridTemplateColumns: "1fr" }}>
        <Card>
          <div style={{ fontWeight: 900, marginBottom: 10 }}>Portfolio Split (Accounts)</div>
          <PieChart accounts={accounts} />
        </Card>
      </div>
    </>
  );
}
