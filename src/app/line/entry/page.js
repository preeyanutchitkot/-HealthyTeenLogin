"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../lib/firebase";

export default function EntryPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("🔥 ENTRY PAGE VERSION: FINAL SESSION SYSTEM");

    const unsub = onAuthStateChanged(auth, async (user) => {
      try {
        const now = Date.now();
        const lastLogin = parseInt(localStorage.getItem("lastLoginAt") || "0", 10);
        const SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000;

        if (user && lastLogin && (now - lastLogin) < SEVEN_DAYS) {
          router.replace("/line/home");
          return;
        }

        if (user) await signOut(auth);

        router.replace("/line/login");

      } catch (err) {
        console.error(err);
        router.replace("/line/login");
      } finally {
        setLoading(false);
      }
    });

    return () => unsub();
  }, [router]);

  return (
    <div style={{
      height: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "column",
      background: "#e9f8ea",
      fontFamily: "Noto Sans Thai, sans-serif",
    }}>
      <img src="/Logo.png" width={120} />
      <h3 style={{ color: "#24a43e", marginTop: 10 }}>Healthy Teen</h3>
    </div>
  );
}
