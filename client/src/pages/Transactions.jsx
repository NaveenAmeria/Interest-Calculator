import { useEffect, useState } from "react";
import Card from "../components/Card";
import Field from "../components/Field";
import Input from "../components/Input";
import Select from "../components/Select";
import Button from "../components/Button";
import TransactionTable from "../components/TransactionTable";
import { api } from "../lib/api";

export default function Transactions() {
  const [accounts, setAccounts] = useState([]);
  const [tx, setTx] = useState([]);

  const [date, setDate] = useState("");
  const [name, setName] = useState("");
  const [principal, setPrincipal] = useState("");
  const [rateAnnual, setRateAnnual] = useState("");
  const [durationMonths, setDurationMonths] = useState("");
  const [frequency, setFrequency] = useState("MONTHLY");
  const [interestType, setInterestType] = useState("SIMPLE");
  const [direction, setDirection] = useState("GIVEN");
  const [accountId, setAccountId] = useState("");
  const [modeOfPayment, setModeOfPayment] = useState("");
  const [notes, setNotes] = useState("");

  async function load() {
    const [aRes, tRes] = await Promise.all([
      api.get("/api/accounts"),
      api.get("/api/transactions")
    ]);
    setAccounts(aRes.data);
    setTx(tRes.data);
  }

  useEffect(() => { load(); }, []);

  async function addTx() {
    await api.post("/api/transactions", {
      date,
      name,
      principal: Number(principal),
      rateAnnual: Number(rateAnnual),
      durationMonths: Number(durationMonths),
      frequency,
      interestType,
      direction,
      accountId: accountId || null,
      modeOfPayment,
      notes
    });
    setDate(""); setName(""); setPrincipal(""); setRateAnnual(""); setDurationMonths("");
    setModeOfPayment(""); setNotes(""); setAccountId("");
    await load();
  }

  return (
    <>
      <h1>Transactions</h1>

      <Card>
        <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
          <Field label="Date"><Input type="date" value={date} onChange={(e)=>setDate(e.target.value)} /></Field>
          <Field label="Name"><Input value={name} onChange={(e)=>setName(e.target.value)} /></Field>
          <Field label="Principal"><Input type="number" value={principal} onChange={(e)=>setPrincipal(e.target.value)} /></Field>

          <Field label="Rate (% per year)"><Input type="number" value={rateAnnual} onChange={(e)=>setRateAnnual(e.target.value)} /></Field>
          <Field label="Duration (months)"><Input type="number" value={durationMonths} onChange={(e)=>setDurationMonths(e.target.value)} /></Field>
          <Field label="Direction">
            <Select value={direction} onChange={(e)=>setDirection(e.target.value)}>
              <option value="GIVEN">Given (Lent)</option>
              <option value="TAKEN">Taken (Borrowed)</option>
            </Select>
          </Field>

          <Field label="Interest Type">
            <Select value={interestType} onChange={(e)=>setInterestType(e.target.value)}>
              <option value="SIMPLE">Simple</option>
              <option value="COMPOUND">Compound</option>
            </Select>
          </Field>

          <Field label="Frequency">
            <Select value={frequency} onChange={(e)=>setFrequency(e.target.value)}>
              <option value="MONTHLY">Monthly</option>
              <option value="YEARLY">Yearly</option>
            </Select>
          </Field>

          <Field label="Link Account">
            <Select value={accountId} onChange={(e)=>setAccountId(e.target.value)}>
              <option value="">None</option>
              {accounts.map(a => <option key={a._id} value={a._id}>{a.name}</option>)}
            </Select>
          </Field>

          <Field label="Mode of payment"><Input value={modeOfPayment} onChange={(e)=>setModeOfPayment(e.target.value)} placeholder="Cash/UPI/Bank..." /></Field>
          <Field label="Notes"><Input value={notes} onChange={(e)=>setNotes(e.target.value)} placeholder="Optional..." /></Field>
        </div>

        <div style={{ marginTop: 12 }}>
          <Button onClick={addTx}>Add Transaction</Button>
        </div>
      </Card>

      <div style={{ marginTop: 14 }}>
        <TransactionTable tx={tx} onChanged={load} />
      </div>
    </>
  );
}
