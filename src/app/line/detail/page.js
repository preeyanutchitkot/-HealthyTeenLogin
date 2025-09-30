'use client';

import { Suspense } from 'react';
import DetailContent from './DetailContent';

export default function DetailPage() {
  return (
    <Suspense fallback={<div>กำลังโหลด...</div>}>
      <DetailContent />
    </Suspense>
  );
}
