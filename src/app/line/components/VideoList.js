"use client";
import React, { useEffect, useState } from "react";
import VideoCard from "./VideoCard";


const dummyVideos = [
  { id: 1, title: "Healthy Teen - Your Health is Priority", youtubeId: "dQw4w9WgXcQ" },
  { id: 2, title: "Healthy Teen - Good Habits", youtubeId: "M7lc1UVf-VE" },
  { id: 3, title: "Improve Kidney Function", youtubeId: "hY7m5jjJ9mM" },
  { id: 4, title: "Healthy Teen - Exercise Tips", youtubeId: "kXYiU_JCYtU" },
  { id: 5, title: "Healthy Teen - Nutrition Guide", youtubeId: "3JZ_D3ELwOQ" },
  { id: 6, title: "Healthy Teen - Sleep Well", youtubeId: "LsoLEjrDogU" }
];

function VideoList() {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    
    setVideos(dummyVideos);
  }, []);

  return (
    <div>
      {videos.map((video) => (
        <VideoCard
          key={video.id}
          thumbnail={`https://img.youtube.com/vi/${video.youtubeId}/0.jpg`}
          title={video.title}
          onWatch={() => window.open(`https://www.youtube.com/watch?v=${video.youtubeId}`, "_blank")}
        />
      ))}
    </div>
  );
}

export default VideoList;
