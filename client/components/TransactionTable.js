import Card from "./Card";

export default function TransactionTable({ tx }) {
  return (
    <Card>
      <div style={{ fontWeight: 900, marginBottom: 10 }}>Existing Transactions</div>

      <div style={{ overflowX:"auto" }}>
        <table style={{ width:"100%", borderCollapse:"collapse" }}>
          <thead>
            <tr style={{ textAlign:"left", color:"var(--brand)" }}>
              <th style={th}>Date</th>
              <th style={th}>Name</th>
              <th style={th}>Amount</th>
              <th style={th}>Rate (%)</th>
              <th style={th}>Duration (m)</th>
              <th style={th}>Type</th>
              <th style={th}>Interest</th>
              <th style={th}>Total Payable</th>
              <th style={th}>Account</th>
            </tr>
          </thead>
          <tbody>
            {tx.map(t => (
              <tr key={t._id} style={{ borderTop:"1px solid var(--border)" }}>
                <td style={td}>{fmtDate(t.date)}</td>
                <td style={td}>{t.name}</td>
                <td style={td}>₹ {t.amount}</td>
                <td style={td}>{t.rateAnnual}</td>
                <td style={td}>{t.durationMonths}</td>
                <td style={td}>{t.type}</td>
                <td style={td}>₹ {t.computed?.interest}</td>
                <td style={td}>₹ {t.computed?.total}</td>
                <td style={td}>{t.accountId?.name || "-"}</td>
              </tr>
            ))}
            {!tx.length && <tr><td style={td} colSpan={9}>No transactions</td></tr>}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

const th = { padding:"10px 8px", fontWeight:900 };
const td = { padding:"10px 8px", color:"var(--muted)", fontWeight:700 };

function fmtDate(d) {
  const x = new Date(d);
  return x.toLocaleDateString();
}
