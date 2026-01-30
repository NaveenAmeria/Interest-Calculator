"use client";
import { useEffect, useState } from "react";
import ProtectedRoute from "../../components/ProtectedRoute";
import Card from "../../components/Card";
import Input from "../../components/Input";
import Select from "../../components/Select";
import Button from "../../components/Button";
import { api } from "../../lib/api";
import TransactionTable from "../../components/TransactionTable";

export default function TransactionsPage() {
  const [accounts, setAccounts] = useState([]);
  const [tx, setTx] = useState([]);

  const [date, setDate] = useState("");
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [rateAnnual, setRateAnnual] = useState("");
  const [durationMonths, setDurationMonths] = useState("");
  const [type, setType] = useState("GIVEN");
  const [frequency, setFrequency] = useState("MONTHLY");
  const [interestType, setInterestType] = useState("SIMPLE");
  const [accountId, setAccountId] = useState("");

  async function load() {
    const [aRes, tRes] = await Promise.all([api.get("/api/accounts"), api.get("/api/transactions")]);
    setAccounts(aRes.data);
    setTx(tRes.data);
  }

  useEffect(() => { load(); }, []);

  async function addTx() {
    await api.post("/api/transactions", {
      date, name,
      amount: Number(amount),
      rateAnnual: Number(rateAnnual),
      durationMonths: Number(durationMonths),
      type,
      frequency,
      interestType,
      accountId: accountId || null
    });
    setDate(""); setName(""); setAmount(""); setRateAnnual(""); setDurationMonths("");
    setAccountId("");
    await load();
  }

  return (
    <ProtectedRoute>
      <h1>Transactions</h1>

      <Card>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(220px, 1fr))", gap: 12 }}>
          <Field label="Date"><Input type="date" value={date} onChange={e=>setDate(e.target.value)} /></Field>
          <Field label="Name"><Input value={name} onChange={e=>setName(e.target.value)} placeholder="Person/Company" /></Field>
          <Field label="Amount"><Input type="number" value={amount} onChange={e=>setAmount(e.target.value)} /></Field>

          <Field label="Interest Rate (% per year)"><Input type="number" value={rateAnnual} onChange={e=>setRateAnnual(e.target.value)} /></Field>
          <Field label="Type">
            <Select value={type} onChange={e=>setType(e.target.value)}>
              <option value="GIVEN">Given (Lent)</option>
              <option value="TAKEN">Taken (Borrowed)</option>
            </Select>
          </Field>
          <Field label="Frequency">
            <Select value={frequency} onChange={e=>setFrequency(e.target.value)}>
              <option value="MONTHLY">Monthly</option>
              <option value="YEARLY">Yearly</option>
            </Select>
          </Field>

          <Field label="Duration (months)"><Input type="number" value={durationMonths} onChange={e=>setDurationMonths(e.target.value)} /></Field>
          <Field label="Interest Type">
            <Select value={interestType} onChange={e=>setInterestType(e.target.value)}>
              <option value="SIMPLE">Simple</option>
              <option value="COMPOUND">Compound</option>
            </Select>
          </Field>

          <Field label="Link Account">
            <Select value={accountId} onChange={e=>setAccountId(e.target.value)}>
              <option value="">None</option>
              {accounts.map(a => <option key={a._id} value={a._id}>{a.name}</option>)}
            </Select>
          </Field>
        </div>

        <div style={{ marginTop: 12 }}>
          <Button onClick={addTx}>Add Transaction</Button>
        </div>
      </Card>

      <div style={{ marginTop: 14 }}>
        <TransactionTable tx={tx} />
      </div>
    </ProtectedRoute>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <div style={{ color:"var(--muted)", fontWeight:800, marginBottom:6 }}>{label}</div>
      {children}
    </div>
  );
}
