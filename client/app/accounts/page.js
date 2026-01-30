"use client";
import { useEffect, useState } from "react";
import ProtectedRoute from "../../components/ProtectedRoute";
import Card from "../../components/Card";
import Input from "../../components/Input";
import Button from "../../components/Button";
import { api } from "../../lib/api";
import AccountTable from "../../components/AccountTable";

export default function AccountsPage() {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [address, setAddress] = useState("");
  const [accounts, setAccounts] = useState([]);

  async function load() {
    const res = await api.get("/api/accounts");
    setAccounts(res.data);
  }

  useEffect(() => { load(); }, []);

  async function addAccount() {
    if (!name.trim()) return;
    await api.post("/api/accounts", { name, contact, address });
    setName(""); setContact(""); setAddress("");
    await load();
  }

  return (
    <ProtectedRoute>
      <h1>Accounts</h1>

      <Card>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(220px, 1fr))", gap: 12 }}>
          <div><div style={{ color:"var(--muted)", fontWeight:800, marginBottom:6 }}>Name</div>
            <Input value={name} onChange={e=>setName(e.target.value)} placeholder="Shiva" />
          </div>
          <div><div style={{ color:"var(--muted)", fontWeight:800, marginBottom:6 }}>Contact</div>
            <Input value={contact} onChange={e=>setContact(e.target.value)} placeholder="+91..." />
          </div>
          <div><div style={{ color:"var(--muted)", fontWeight:800, marginBottom:6 }}>Address</div>
            <Input value={address} onChange={e=>setAddress(e.target.value)} placeholder="13/D, Street..." />
          </div>
        </div>

        <div style={{ marginTop: 12 }}>
          <Button onClick={addAccount}>Add Account</Button>
        </div>
      </Card>

      <div style={{ marginTop: 14 }}>
        <AccountTable accounts={accounts} />
      </div>
    </ProtectedRoute>
  );
}
