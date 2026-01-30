import { useMemo, useState } from "react";
import Card from "../components/Card";
import Field from "../components/Field";
import Input from "../components/Input";
import Select from "../components/Select";

function round2(x){ return Math.round((x+Number.EPSILON)*100)/100; }

export default function Calculator() {
  const [principal, setPrincipal] = useState(100000);
  const [rateAnnual, setRateAnnual] = useState(10);
  const [durationMonths, setDurationMonths] = useState(10);
  const [frequency, setFrequency] = useState("MONTHLY");
  const [interestType, setInterestType] = useState("SIMPLE");

  const computed = useMemo(() => {
    const P = Number(principal || 0);
    const r = Number(rateAnnual || 0);
    const m = Number(durationMonths || 0);

    if (interestType === "SIMPLE") {
      const years = m / 12;
      const I = (P * r * years) / 100;
      return { interest: round2(I), total: round2(P + I) };
    }
    const n = frequency === "MONTHLY" ? 12 : 1;
    const t = m / 12;
    const A = P * Math.pow(1 + (r/100)/n, n*t);
    return { interest: round2(A - P), total: round2(A) };
  }, [principal, rateAnnual, durationMonths, frequency, interestType]);

  return (
    <>
      <h1>Interest Calculator</h1>
      <Card>
        <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
          <Field label="Primary amount">
            <Input type="number" value={principal} onChange={(e)=>setPrincipal(e.target.value)} />
          </Field>
          <Field label="Interest Rate (% per year)">
            <Input type="number" value={rateAnnual} onChange={(e)=>setRateAnnual(e.target.value)} />
          </Field>
          <Field label="Interest period (months)">
            <Input type="number" value={durationMonths} onChange={(e)=>setDurationMonths(e.target.value)} />
          </Field>
          <Field label="Interest frequency">
            <Select value={frequency} onChange={(e)=>setFrequency(e.target.value)}>
              <option value="MONTHLY">Monthly</option>
              <option value="YEARLY">Yearly</option>
            </Select>
          </Field>
          <Field label="Interest type">
            <Select value={interestType} onChange={(e)=>setInterestType(e.target.value)}>
              <option value="SIMPLE">Simple Interest</option>
              <option value="COMPOUND">Compound Interest</option>
            </Select>
          </Field>
        </div>

        <div className="grid" style={{ marginTop: 14, gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
          <Card style={{ background: "rgba(47,91,255,.06)" }}>
            <div style={{ color: "var(--muted)", fontWeight: 900 }}>Net interest</div>
            <div style={{ fontSize: 20, fontWeight: 900, marginTop: 6 }}>₹ {computed.interest}</div>
          </Card>
          <Card style={{ background: "rgba(47,91,255,.06)" }}>
            <div style={{ color: "var(--muted)", fontWeight: 900 }}>Total payable</div>
            <div style={{ fontSize: 20, fontWeight: 900, marginTop: 6 }}>₹ {computed.total}</div>
          </Card>
        </div>
      </Card>
    </>
  );
}
