import React from 'react';
import Header from '@/app/line/components/header';
import CalorieAlertCard from '@/app/line/components/CalorieAlertCard';

export default function NotificationPage() {
  return (
    <div>
      <Header title="ปริมาณแคลลอรี่วันนี้" cartoonImage="/8.png" />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', alignItems: 'center', marginTop: '32px' }}>
        <CalorieAlertCard
          level="over"
          title="ปริมาณแคลอรี่ของคุณเกินกำหนด"
          calorie={2500}
          maxCalorie={2400}
          icon={<img src="/full.png" alt="full" style={{ width: 80 }} />}
        />
        <CalorieAlertCard
          level="normal"
          title="ปริมาณแคลอรี่ของคุณพอดี"
          calorie={800}
          maxCalorie={2400}
          icon={<img src="/enough.png" alt="enough" style={{ width: 80 }} />}
        />
        <CalorieAlertCard
          level="near"
          title="วันนี้ปริมาณแคลอรี่ของคุณใกล้เต็ม"
          calorie={1200}
          maxCalorie={2400}
          icon={<img src="/nearfull.png" alt="nearfull" style={{ width: 80 }} />}
        />
      </div>
    </div>
  );
}