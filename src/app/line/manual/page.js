"use client";
import Image from "next/image";

const manualImages = [
  "/m1.png",
  "/mm2.png",
  "/m3.png",
  "/m4.png",
  "/m5.png",
  "/m6.png",
  "/m7.png",
  "/m8.png",
  "/m9.png",
  "/mm10.png",
];

export default function ManualPage() {
  return (
    <div
      style={{
        width: "100vw",
        minHeight: "100vh",
        background: "#fff",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: 0,
        margin: 0,
      }}
    >
      {manualImages.map((src, idx) => (
        <Image
          key={src}
          src={src}
          alt={`คู่มือหน้า ${idx + 1}`}
          width={1920}
          height={2715}
          style={{
            width: "100vw",
            height: "auto",
            display: "block",
            margin: 0,
            padding: 0,
          }}
          priority={idx === 0}
        />
      ))}
    </div>
  );
}