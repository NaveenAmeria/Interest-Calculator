import Card from "./Card";

export default function AccountTable({ accounts }) {
  return (
    <Card>
      <div style={{ fontWeight: 900, marginBottom: 10 }}>Existing Accounts</div>

      <div style={{ overflowX: "auto" }}>
        <table style={{ width:"100%", borderCollapse:"collapse" }}>
          <thead>
            <tr style={{ textAlign:"left", color:"var(--brand)" }}>
              <th style={th}>Name</th>
              <th style={th}>Contact</th>
              <th style={th}>Address</th>
              <th style={th}>Total Given</th>
              <th style={th}>Total Taken</th>
            </tr>
          </thead>
          <tbody>
            {accounts.map(a => (
              <tr key={a._id} style={{ borderTop:"1px solid var(--border)" }}>
                <td style={td}>{a.name}</td>
                <td style={td}>{a.contact || "-"}</td>
                <td style={td}>{a.address || "-"}</td>
                <td style={td}>₹ {round2(a.totals?.given || 0)}</td>
                <td style={td}>₹ {round2(a.totals?.taken || 0)}</td>
              </tr>
            ))}
            {!accounts.length && (
              <tr><td style={td} colSpan={5}>No accounts</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

const th = { padding:"10px 8px", fontWeight: 900 };
const td = { padding:"10px 8px", color:"var(--muted)", fontWeight: 700 };
function round2(x){ return Math.round((x+Number.EPSILON)*100)/100; }
