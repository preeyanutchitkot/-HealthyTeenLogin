import React from 'react';
import Header from '@/app/line/components/header';
import VideoList from '@/app/line/components/VideoList';

export default function LookvideoPage() {
  return (
    <div style={{ padding: "16px" }}>
      <Header title="วิดีโอสุขภาพ" cartoonImage="/9.png" />
      <div style={{ marginTop: "24px" }}>
        <VideoList />
      </div>
    </div>
  );
}