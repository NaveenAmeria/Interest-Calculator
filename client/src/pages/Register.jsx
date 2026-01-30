import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Card from "../components/Card";
import Field from "../components/Field";
import Input from "../components/Input";
import Button from "../components/Button";
import { api } from "../lib/api";

export default function Register() {
  const nav = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");
    try {
      await api.post("/api/auth/register", { name, email, password });
      nav("/login");
    } catch (e2) {
      setErr(e2?.response?.data?.message || "Register failed");
    }
  }

  return (
    <Card style={{ maxWidth: 420, margin: "28px auto" }}>
      <h1 style={{ marginTop: 0 }}>Register</h1>
      <form onSubmit={onSubmit} className="grid">
        <Field label="Name">
          <Input value={name} onChange={(e)=>setName(e.target.value)} placeholder="Yogesh" />
        </Field>
        <Field label="Email">
          <Input value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="you@gmail.com" />
        </Field>
        <Field label="Password">
          <Input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="min 6 chars" />
        </Field>
        {err && <div style={{ color: "#dc2626", fontWeight: 900 }}>{err}</div>}
        <Button type="submit">Create Account</Button>
        <div style={{ color: "var(--muted)", fontWeight: 800 }}>
          Already have an account? <Link to="/login" style={{ color: "var(--brand)", fontWeight: 900 }}>Login</Link>
        </div>
      </form>
    </Card>
  );
}
