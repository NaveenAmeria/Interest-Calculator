import Card from "./Card";
import Button from "./Button";
import Input from "./Input";
import { useState } from "react";
import { api } from "../lib/api";

function fmtDate(d) {
  const x = new Date(d);
  return x.toLocaleDateString();
}

export default function TransactionTable({ tx, onChanged }) {
  const [payAmount, setPayAmount] = useState({});
  const [payDate, setPayDate] = useState({});
  const [uploading, setUploading] = useState(null);

  async function addPayment(id) {
    const amount = Number(payAmount[id] || 0);
    const date = payDate[id] || new Date().toISOString().slice(0, 10);
    if (!amount || amount <= 0) return;
    await api.post(`/api/transactions/${id}/payments`, { amount, date, note: "" });
    setPayAmount(prev => ({ ...prev, [id]: "" }));
    onChanged?.();
  }

  async function uploadScreenshot(id, file) {
    if (!file) return;
    setUploading(id);
    const fd = new FormData();
    fd.append("file", file);
    await api.post(`/api/transactions/${id}/screenshot`, fd, { headers: { "Content-Type": "multipart/form-data" } });
    setUploading(null);
    onChanged?.();
  }

  return (
    <Card>
      <div style={{ fontWeight: 900, marginBottom: 10 }}>Transactions</div>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ textAlign: "left", color: "var(--brand)" }}>
              <th style={th}>Date</th>
              <th style={th}>Name</th>
              <th style={th}>Principal</th>
              <th style={th}>Rate</th>
              <th style={th}>Months</th>
              <th style={th}>Type</th>
              <th style={th}>Interest</th>
              <th style={th}>Total</th>
              <th style={th}>Paid</th>
              <th style={th}>Outstanding</th>
              <th style={th}>Due</th>
              <th style={th}>Account</th>
              <th style={th}>Screenshot</th>
              <th style={th}>Payments</th>
            </tr>
          </thead>
          <tbody>
            {tx.map(t => (
              <tr key={t._id} style={{ borderTop: "1px solid var(--border)" }}>
                <td style={td}>{fmtDate(t.date)}</td>
                <td style={td}>{t.name}</td>
                <td style={td}>₹ {t.principal}</td>
                <td style={td}>{t.rateAnnual}%</td>
                <td style={td}>{t.durationMonths}</td>
                <td style={td}>{t.direction}</td>
                <td style={td}>₹ {t.computed?.interest}</td>
                <td style={td}>₹ {t.computed?.total}</td>
                <td style={td}>₹ {t.paymentsTotal}</td>
                <td style={td}>₹ {t.outstanding}</td>
                <td style={td}>{t.dueDate ? fmtDate(t.dueDate) : "-"}</td>
                <td style={td}>{t.accountId?.name || "-"}</td>
                <td style={td}>
                  {t.screenshot?.url ? (
                    <a href={t.screenshot.url} target="_blank" rel="noreferrer" style={{ color: "var(--brand)", fontWeight: 900 }}>
                      View
                    </a>
                  ) : "-"}
                  <div style={{ marginTop: 6 }}>
                    <input type="file" accept="image/*" onChange={(e)=>uploadScreenshot(t._id, e.target.files?.[0])} />
                    {uploading === t._id && <div style={{ color: "var(--muted)", fontWeight: 800 }}>Uploading...</div>}
                  </div>
                </td>
                <td style={td}>
                  <div style={{ display: "grid", gap: 6 }}>
                    <Input type="date" value={payDate[t._id] || ""} onChange={(e)=>setPayDate(p=>({...p,[t._id]: e.target.value}))} />
                    <Input type="number" placeholder="Payment amount" value={payAmount[t._id] || ""} onChange={(e)=>setPayAmount(p=>({...p,[t._id]: e.target.value}))} />
                    <Button variant="ghost" onClick={() => addPayment(t._id)}>Add Payment</Button>
                  </div>
                </td>
              </tr>
            ))}
            {!tx.length && <tr><td style={td} colSpan={14}>No transactions</td></tr>}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

const th = { padding: "10px 8px", fontWeight: 900, whiteSpace: "nowrap" };
const td = { padding: "10px 8px", color: "var(--muted)", fontWeight: 700, verticalAlign: "top" };
