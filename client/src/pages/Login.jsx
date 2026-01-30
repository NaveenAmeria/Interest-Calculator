import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Card from "../components/Card";
import Field from "../components/Field";
import Input from "../components/Input";
import Button from "../components/Button";
import { api } from "../lib/api";
import { setToken } from "../lib/auth";

export default function Login() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");
    try {
      const res = await api.post("/api/auth/login", { email, password });
      setToken(res.data.token);
      nav("/dashboard");
    } catch (e2) {
      setErr(e2?.response?.data?.message || "Login failed");
    }
  }

  return (
    <Card style={{ maxWidth: 420, margin: "28px auto" }}>
      <h1 style={{ marginTop: 0 }}>Login</h1>
      <form onSubmit={onSubmit} className="grid">
        <Field label="Email">
          <Input value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="you@gmail.com" />
        </Field>
        <Field label="Password">
          <Input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="••••••••" />
        </Field>
        {err && <div style={{ color: "#dc2626", fontWeight: 900 }}>{err}</div>}
        <Button type="submit">Login</Button>
        <div style={{ color: "var(--muted)", fontWeight: 800 }}>
          No account? <Link to="/register" style={{ color: "var(--brand)", fontWeight: 900 }}>Register</Link>
        </div>
      </form>
    </Card>
  );
}
