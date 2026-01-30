"use client";
import { usePathname, useRouter } from "next/navigation";
import { clearToken, getToken } from "../lib/auth";

const items = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/calculator", label: "Calculator" },
  { href: "/transactions", label: "Transactions" },
  { href: "/accounts", label: "Accounts" },
  { href: "/notifications", label: "Notifications" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/money", label: "Money" }
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const loggedIn = typeof window !== "undefined" && !!getToken();

  return (
    <div style={{ background: "white", borderBottom: "1px solid var(--border)" }}>
      <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ fontWeight: 900, color: "var(--brand)", fontSize: 18 }}>
          Interest Calculator
        </div>

        <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
          {items.map(i => (
            <a
              key={i.href}
              href={i.href}
              style={{
                padding: "8px 10px",
                borderRadius: 10,
                background: pathname === i.href ? "rgba(47,91,255,.12)" : "transparent",
                color: pathname === i.href ? "var(--brand)" : "var(--muted)",
                fontWeight: 700
              }}
            >
              {i.label}
            </a>
          ))}

          {loggedIn ? (
            <button
              onClick={() => { clearToken(); router.push("/login"); }}
              style={{ border: "1px solid var(--border)", background: "white", padding: "8px 10px", borderRadius: 10, cursor: "pointer" }}
            >
              Logout
            </button>
          ) : (
            <a href="/login" style={{ fontWeight: 800, color: "var(--brand)" }}>Login</a>
          )}
        </div>
      </div>
    </div>
  );
}
