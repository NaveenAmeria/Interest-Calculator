import { useEffect, useState } from "react";
import Button from "../components/Button";
import NotificationList from "../components/NotificationList";
import { api } from "../lib/api";

export default function Notifications() {
  const [items, setItems] = useState([]);

  async function load() {
    const res = await api.get("/api/notifications");
    setItems(res.data);
  }

  async function generate() {
    await api.post("/api/notifications/generate");
    await load();
  }

  useEffect(() => { load(); }, []);

  return (
    <>
      <h1>Notifications</h1>
      <div style={{ marginBottom: 12 }}>
        <Button variant="ghost" onClick={generate}>Generate Now</Button>
      </div>
      <NotificationList items={items} onChanged={load} />
    </>
  );
}
