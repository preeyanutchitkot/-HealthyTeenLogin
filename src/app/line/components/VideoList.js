"use client";
import React, { useEffect, useState } from "react";
import VideoCard from "./VideoCard";

// ลิงก์วิดีโอตามที่ให้มา (เรียงตามลำดับ)
const VIDEO_LINKS = [
  "https://youtu.be/y3WLXfkmEfI?si=pAscKkfFtsL3tA4W",
  "https://youtu.be/aAAODnFrZ8A?si=n4K3E5UH3W4TKn7e",
  "https://youtu.be/6rrkABJhw9s?si=KNZQDFIY5MfgqoG5",
  "https://youtube.com/shorts/KS9PdZggL1o?si=rKK9qjIblbJr68RA",
  "https://youtu.be/cEzjM1l-6rU?si=Hr1cFdlkIpO3H9wa",
  "https://youtube.com/shorts/F1rQzT02jgk?si=M--gHW6VM2Pmv_-h",
  "https://youtu.be/FF-__85O4NQ?si=Y0dlG-Rq8VvpQO60",
  "https://youtu.be/UCvk7Zv47fs?si=obzTz1HlNZ8EoWgU",
  "https://youtu.be/6X5vEO4Z6qI?si=nYm6w2B_BDuNq0fe",
  "https://youtu.be/4XG3v8DIBHY?si=VCJ4a8uQNawT5R0P",
  "https://youtu.be/kIXOjBGSCvM?si=ZnkJEvRwB4qutXYX",
  "https://youtu.be/RPgXss2H7So?si=z_F6JLvgGSg0i-N6",
  "https://youtu.be/w-nBL0ONIQE?si=WXyjev6lq6Yw6bex",
  "https://youtu.be/dFo2gYnB8BA?si=NdkGn1gH47gkuuF9",
  "https://youtube.com/shorts/RdaL0u6GEz0?si=m4GoTdjxNWF8vrCT",
  "https://youtu.be/2cMIdXIkUV8?si=Ncf8t30-n1fRMmIQ",
];

// ชื่อคลิปตามลำดับเดียวกัน
const TITLES = [
  "กินแบบ 2:1:1 สุขภาพดีไม่มีพุง",
  "น้ำตาลซ่อนอยู่ที่ใด",
  "น้ำตาลตัวร้ายทำลายสุขภาพ",
  "น้ำตาลในเครื่องดื่มต่างๆ มาดูกันหวานกี่ช้อนชา",
  "โซเดียมตัวร้าย ทำลายทั้งไตและหัวใจ",
  "ซดไม่ยั้งระวังโซเดียม",
  "มาตาลดา มากับ สสส. EP6 | ตอน ลดปรุง ลดจิ้ม ลดโซเดียม",
  "มาตาลดา มากับ สสส. EP3 | ตอน ไม่เห็นน้ำตาล ไม่หลั่งน้ำตา",
  "น้ำจิ้มหมูกระทะทะลุโลก",
  "มาตาลดา มากับ สสส. EP4 | ตอน ลดโซเดียม ลดโรค",
  "กิน 3 อย่างนี้ตอนเช้า อายุจะยืนยาว",
  "เทคนิคการกินเพื่อสุขภาพที่ดีระยะยาว",
  "หมอโอ๊ค สมิทธิ์ เผยเคล็ดลับจากฮาร์วาร์ด",
  "การกินให้สุขภาพดี กินลดอายุ เด็กลง 2 ปีภายใน 2 เดือน",
  "5 อาหาร บำรุงสายตา",
  "อยากอายุยืนยาว อาหารเช้าต้องกินแบบนี้",
];

// แยก YouTube ID ให้รองรับทั้ง youtu.be / watch?v= / shorts
function extractYouTubeId(input) {
  try {
    const u = new URL(input.trim());
    if (u.hostname === "youtu.be") {
      return u.pathname.replace("/", "").split("?")[0];
    }
    if (u.hostname.includes("youtube.com") && u.pathname === "/watch") {
      return u.searchParams.get("v");
    }
    if (u.hostname.includes("youtube.com") && u.pathname.startsWith("/shorts/")) {
      return u.pathname.split("/")[2];
    }
    return null;
  } catch {
    return null;
  }
}

function buildVideoList(links, titles) {
  return links
    .map((url, idx) => {
      const youtubeId = extractYouTubeId(url);
      if (!youtubeId) return null;
      return {
        id: youtubeId,
        title: titles[idx] || `วิดีโอสุขภาพ #${idx + 1}`,
        youtubeId,
        url, // เก็บลิงก์ต้นฉบับไว้เปิด (รองรับ Shorts ด้วย)
      };
    })
    .filter(Boolean);
}

export default function VideoList() {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    setVideos(buildVideoList(VIDEO_LINKS, TITLES));
  }, []);

  return (
    <div>
      {videos.map((v) => (
        <VideoCard
          key={v.id}
          thumbnail={`https://img.youtube.com/vi/${v.youtubeId}/hqdefault.jpg`}
          title={v.title}
          onWatch={() => window.open(v.url, "_blank", "noopener,noreferrer")}
        />
      ))}
    </div>
  );
}
