import { useEffect, useState } from "react";
import Card from "../components/Card";
import Field from "../components/Field";
import Input from "../components/Input";
import Button from "../components/Button";
import AccountTable from "../components/AccountTable";
import { api } from "../lib/api";

export default function Accounts() {
  const [accounts, setAccounts] = useState([]);
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [address, setAddress] = useState("");

  async function load() {
    const res = await api.get("/api/accounts");
    setAccounts(res.data);
  }

  useEffect(() => { load(); }, []);

  async function add() {
    if (!name.trim()) return;
    await api.post("/api/accounts", { name, contact, address, tags: [] });
    setName(""); setContact(""); setAddress("");
    await load();
  }

  return (
    <>
      <h1>Accounts</h1>

      <Card>
        <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
          <Field label="Name"><Input value={name} onChange={(e)=>setName(e.target.value)} /></Field>
          <Field label="Contact"><Input value={contact} onChange={(e)=>setContact(e.target.value)} /></Field>
          <Field label="Address"><Input value={address} onChange={(e)=>setAddress(e.target.value)} /></Field>
        </div>
        <div style={{ marginTop: 12 }}>
          <Button onClick={add}>Add Account</Button>
        </div>
      </Card>

      <div style={{ marginTop: 14 }}>
        <AccountTable accounts={accounts} />
      </div>
    </>
  );
}
