"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Card from "../../../components/Card";
import Input from "../../../components/Input";
import Button from "../../../components/Button";
import { api } from "../../../lib/api";
import { setToken } from "../../../lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  async function onLogin(e) {
    e.preventDefault();
    setErr("");
    try {
      const res = await api.post("/api/auth/login", { email, password });
      setToken(res.data.token);
      router.push("/dashboard");
    } catch (e) {
      setErr(e?.response?.data?.message || "Login failed");
    }
  }

  return (
    <Card style={{ maxWidth: 420, margin: "30px auto" }}>
      <h1 style={{ marginTop: 0 }}>Login</h1>
      <form onSubmit={onLogin} style={{ display: "grid", gap: 12 }}>
        <div>
          <div style={{ color: "var(--muted)", fontWeight: 700, marginBottom: 6 }}>Email</div>
          <Input value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@gmail.com" />
        </div>
        <div>
          <div style={{ color: "var(--muted)", fontWeight: 700, marginBottom: 6 }}>Password</div>
          <Input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••" />
        </div>
        {err && <div style={{ color: "crimson", fontWeight: 700 }}>{err}</div>}
        <Button type="submit">Login</Button>
        <a href="/register" style={{ color:"var(--brand)", fontWeight: 800 }}>Create account</a>
      </form>
    </Card>
  );
}
