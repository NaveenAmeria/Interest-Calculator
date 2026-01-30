"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Card from "../../../components/Card";
import Input from "../../../components/Input";
import Button from "../../../components/Button";
import { api } from "../../../lib/api";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  async function onRegister(e) {
    e.preventDefault();
    setErr("");
    try {
      await api.post("/api/auth/register", { name, email, password });
      router.push("/login");
    } catch (e) {
      setErr(e?.response?.data?.message || "Register failed");
    }
  }

  return (
    <Card style={{ maxWidth: 420, margin: "30px auto" }}>
      <h1 style={{ marginTop: 0 }}>Register</h1>
      <form onSubmit={onRegister} style={{ display: "grid", gap: 12 }}>
        <div><div style={{ color:"var(--muted)", fontWeight:700, marginBottom:6 }}>Name</div>
          <Input value={name} onChange={e=>setName(e.target.value)} placeholder="Yogesh" />
        </div>
        <div><div style={{ color:"var(--muted)", fontWeight:700, marginBottom:6 }}>Email</div>
          <Input value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@gmail.com" />
        </div>
        <div><div style={{ color:"var(--muted)", fontWeight:700, marginBottom:6 }}>Password</div>
          <Input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••" />
        </div>
        {err && <div style={{ color:"crimson", fontWeight:700 }}>{err}</div>}
        <Button type="submit">Create</Button>
        <a href="/login" style={{ color:"var(--brand)", fontWeight:800 }}>Back to login</a>
      </form>
    </Card>
  );
}
