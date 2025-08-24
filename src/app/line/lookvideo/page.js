import React from 'react';
import Header from '../components/header';
import VideoList from '../components/VideoList';

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