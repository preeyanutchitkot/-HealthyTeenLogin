'use client';

import { Suspense } from 'react';
import VerifyOtpContent from './VerifyOtpContent';

export default function VerifyOTPPage() {
  return (
    <Suspense fallback={<div>กำลังโหลด...</div>}>
      <VerifyOtpContent />
    </Suspense>
  );
}
