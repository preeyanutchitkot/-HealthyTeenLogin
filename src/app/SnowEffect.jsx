"use client";

import { useEffect } from "react";
import "./snow.css";

export default function SnowEffect() {
  useEffect(() => {
    function createSnowflake() {
      const snowflake = document.createElement("div");
      snowflake.classList.add("snowflake");
      snowflake.innerHTML = "❄";
      snowflake.style.left = Math.random() * 100 + "%";
      snowflake.style.animationDuration = Math.random() * 3 + 2 + "s";
      snowflake.style.opacity = Math.random();
      snowflake.style.fontSize = Math.random() * 10 + 10 + "px";
      document.body.appendChild(snowflake);

      setTimeout(() => snowflake.remove(), 5000);
    }

    const interval = setInterval(createSnowflake, 200);
    return () => clearInterval(interval);
  }, []);

  return null; // ไม่มี UI
}
