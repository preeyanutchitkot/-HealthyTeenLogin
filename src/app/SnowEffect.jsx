"use client";

import { useEffect } from "react";
import "./snow.css";

export default function SnowEffect() {
  useEffect(() => {
    function createSnowflake() {
      const snowflake = document.createElement("div");
      snowflake.classList.add("snowflake");

      const wind = Math.random() > 0.5 ? "left" : "right";
      snowflake.classList.add(wind);

      const img = document.createElement("img");
      img.src = "/snow.svg";
      img.classList.add("snowflake-img");

      const size = Math.random() * 15 + 15;
      img.style.width = size + "px";
      img.style.height = size + "px";

      snowflake.appendChild(img);

      snowflake.style.left = Math.random() * 100 + "%";


      snowflake.style.animationDuration = Math.random() * 8 + 8 + "s";

      document.body.appendChild(snowflake);

      setTimeout(() => snowflake.remove(), 16000);
    }

    const interval = setInterval(createSnowflake, 450);

    return () => clearInterval(interval);
  }, []);

  return null;
}
