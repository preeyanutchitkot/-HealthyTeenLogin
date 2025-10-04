'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Noto_Sans_Thai } from 'next/font/google';

const notoSansThai = Noto_Sans_Thai({
  subsets: ['thai', 'latin'],
  weight: ['400', '500', '700'],
});

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div>กำลังโหลด...</div>}>
      <ResetPasswordContent />
    </Suspense>
  );
}

function ResetPasswordContent() {
  const router = useRouter();
  const params = useSearchParams();
  const email = params.get('email') || '';

  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();
    setMsg('');

    if (!email) {
      setMsg('❌ ไม่พบอีเมล');
      return;
    }
    if (newPw !== confirmPw) {
      setMsg('❌ รหัสผ่านไม่ตรงกัน');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, newPassword: newPw }),
      });

      const data = await res.json();
      if (data.success) {
        setMsg('เปลี่ยนรหัสผ่านสำเร็จ! กำลังกลับไปหน้าเข้าสู่ระบบ...');
        setTimeout(() => router.replace('/'), 2000);
      } else {
        setMsg('❌ ' + (data.message || 'ไม่สามารถเปลี่ยนรหัสผ่านได้'));
      }
    } catch (err) {
      console.error(err);
      setMsg('❌ เกิดข้อผิดพลาด');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={notoSansThai.className}
      style={{ padding: '40px 20px', maxWidth: 400, margin: '0 auto' }}
    >
      <h2 style={{ color: '#3ABB47', textAlign: 'center' }}>ตั้งรหัสผ่านใหม่</h2>
      <p style={{ textAlign: 'center', color: '#666' }}>
        สำหรับบัญชี <b>{email}</b>
      </p>

      <form onSubmit={handleReset}>
        <input
          type="password"
          value={newPw}
          onChange={(e) => setNewPw(e.target.value)}
          placeholder="รหัสผ่านใหม่"
          required
          autoComplete="new-password"
          style={{
            width: '100%',
            padding: '14px 16px',
            borderRadius: 12,
            border: '1.5px solid #ddd',
            marginTop: 16,
          }}
        />
        <input
          type="password"
          value={confirmPw}
          onChange={(e) => setConfirmPw(e.target.value)}
          placeholder="ยืนยันรหัสผ่านใหม่"
          required
          autoComplete="new-password"
          style={{
            width: '100%',
            padding: '14px 16px',
            borderRadius: 12,
            border: '1.5px solid #ddd',
            marginTop: 16,
          }}
        />

        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            marginTop: 16,
            padding: '14px 0',
            borderRadius: 12,
            border: 'none',
            background: '#3ABB47',
            color: '#fff',
            fontWeight: 700,
          }}
        >
          {loading ? 'กำลังเปลี่ยนรหัสผ่าน...' : 'ยืนยัน'}
        </button>
      </form>

      {msg && (
        <p
          style={{
            textAlign: 'center',
            marginTop: 16,
            color: msg.startsWith('✅')
              ? '#22C55E'
              : msg.startsWith('⚠️')
              ? '#F59E0B'
              : '#EF4444',
          }}
        >
          {msg}
        </p>
      )}
    </div>
  );
}
