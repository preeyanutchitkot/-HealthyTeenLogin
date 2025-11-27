
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../lib/firebase";

export default function EntryPage() {
  const router = useRouter();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

useEffect(() => {
  if (!hydrated) return;

    const unsub = onAuthStateChanged(auth, (user) => {
    const last = Number(localStorage.getItem("lastLoginAt") || 0);
    const now = Date.now();

    const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;

    if (user && now - last < THIRTY_DAYS) {
      router.replace("/line/home");
    } else {
      router.replace("/line/login");
    }
  });

  return () => unsub();
}, [hydrated, router]);


  return (
    <div style={{
      height: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background: "#e9f8ea"
    }}>
      <img src="/Logo.png" width={120}/>
    </div>
  );
}
