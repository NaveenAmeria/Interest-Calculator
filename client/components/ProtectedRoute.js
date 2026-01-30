"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getToken } from "../lib/auth";

export default function ProtectedRoute({ children }) {
  const router = useRouter();

  useEffect(() => {
    const t = getToken();
    if (!t) router.push("/login");
  }, [router]);

  return children;
}
