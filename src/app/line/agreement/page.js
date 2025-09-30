'use client';

import { Suspense } from 'react';
import AgreementContent from './AgreementContent';

export default function FgaPage() {
  return (
    <Suspense fallback={<div style={{ padding: 24 }}>Loading...</div>}>
      <AgreementContent />
    </Suspense>
  );
}
