'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Noto_Sans_Thai } from 'next/font/google';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import emailjs from '@emailjs/browser';

const notoSansThai = Noto_Sans_Thai({
  subsets: ['thai', 'latin'],
  weight: ['400', '500', '700'],
});

export default function RequestOTPPage() {
  const [email, setEmail] = useState('');
  const [sending, setSending] = useState(false);
  const [msg, setMsg] = useState('');
  const router = useRouter();

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setSending(true);
    setMsg('');

    try {
      const otp = Math.floor(100000 + Math.random() * 900000).toString();

      await addDoc(collection(db, 'email_otps'), {
        email,
        otp,
        createdAt: serverTimestamp(),
        used: false,
      });

      const res = await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID,
        {
          email,
          passcode: otp,
        },
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY
      );

      console.log('EmailJS Sent:', res);
      setMsg('✅ ส่งรหัส OTP ไปยังอีเมลของคุณแล้ว');

      setTimeout(() => {
        router.push(`/line/verify-otp?email=${email}`);
      }, 1500);
    } catch (err) {
      console.error('❌ ส่ง OTP ล้มเหลว:', err);
      setMsg('❌ ส่งรหัสไม่สำเร็จ');
    } finally {
      setSending(false);
    }
  };

  return (
    <div
      className={notoSansThai.className}
      style={{ padding: '40px 20px', maxWidth: 400, margin: '0 auto' }}
    >
      <h2 style={{ color: '#3ABB47', textAlign: 'center' }}>
        เข้าสู่ระบบด้วยรหัส OTP
      </h2>

      <form onSubmit={handleSendOTP}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="กรอกอีเมลของคุณ"
          required
          style={{
            width: '100%',
            padding: '14px 16px',
            borderRadius: 12,
            border: '1.5px solid #ddd',
            marginTop: 24,
          }}
        />
        <button
          type="submit"
          disabled={sending}
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
          {sending ? 'กำลังส่ง...' : 'ส่งรหัส OTP'}
        </button>

        <div
          style={{ display: 'flex', justifyContent: 'center', marginTop: 40 }}
        >
          <img
            src="/Rectangle.png"
            alt="Rectangle Icon"
            style={{ width: 140, height: 'auto', objectFit: 'contain' }}
          />
        </div>
      </form>

      {msg && <p style={{ textAlign: 'center', marginTop: 16 }}>{msg}</p>}
    </div>
  );
}
