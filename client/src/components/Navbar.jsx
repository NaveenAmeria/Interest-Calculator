import { NavLink, useNavigate } from "react-router-dom";
import { clearToken, getToken } from "../lib/auth";

const links = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/calculator", label: "Calculator" },
  { to: "/transactions", label: "Transactions" },
  { to: "/accounts", label: "Accounts" },
  { to: "/notifications", label: "Notifications" },
  { to: "/portfolio", label: "Portfolio" },
  { to: "/money", label: "Money" }
];

export default function Navbar() {
  const nav = useNavigate();
  const loggedIn = !!getToken();

  return (
    <div style={{ background: "white", borderBottom: "1px solid var(--border)" }}>
      <div className="container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
        <div style={{ fontWeight: 900, color: "var(--brand)", fontSize: 18 }}>Interest Calculator</div>

        <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
          {links.map(l => (
            <NavLink
              key={l.to}
              to={l.to}
              style={({ isActive }) => ({
                padding: "8px 10px",
                borderRadius: 12,
                fontWeight: 800,
                color: isActive ? "var(--brand)" : "var(--muted)",
                background: isActive ? "rgba(47,91,255,.12)" : "transparent"
              })}
            >
              {l.label}
            </NavLink>
          ))}

          {loggedIn ? (
            <button
              onClick={() => { clearToken(); nav("/login"); }}
              style={{ padding: "8px 10px", borderRadius: 12, border: "1px solid var(--border)", background: "white", cursor: "pointer", fontWeight: 800 }}
            >
              Logout
            </button>
          ) : (
            <NavLink to="/login" style={{ fontWeight: 900, color: "var(--brand)" }}>Login</NavLink>
          )}
        </div>
      </div>
    </div>
  );
}
