"use client";
import { useEffect, useState } from "react";
import ProtectedRoute from "../../components/ProtectedRoute";
import Card from "../../components/Card";
import { api } from "../../lib/api";
import NotificationList from "../../components/NotificationList";

export default function NotificationsPage() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    (async () => {
      const res = await api.get("/api/notifications");
      setItems(res.data);
    })();
  }, []);

  return (
    <ProtectedRoute>
      <h1>Notifications</h1>
      <Card>
        <NotificationList items={items} />
      </Card>
    </ProtectedRoute>
  );
}
