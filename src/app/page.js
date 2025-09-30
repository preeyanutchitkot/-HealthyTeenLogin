'use client'; // ต้องอยู่บรรทัดแรก

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../app/line/lib/firebase';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/line/home');
    } catch (error) {
      console.error(error);
      if (error.code === 'auth/invalid-credential') {
        setErrorMsg('อีเมลหรือรหัสผ่านไม่ถูกต้อง');
      } else if (error.code === 'auth/user-not-found') {
        setErrorMsg('ไม่พบบัญชีผู้ใช้');
      } else if (error.code === 'auth/invalid-email') {
        setErrorMsg('รูปแบบอีเมลไม่ถูกต้อง');
      } else {
        setErrorMsg('เกิดข้อผิดพลาด');
      }
    }
  };

  return (
    <div className="page">
      <style>{`
        html, body, #__next {
          height: 100%;
          margin: 0;
          padding: 0;
          background: #e9f8ea;
          font-family: 'Noto Sans Thai', sans-serif;
          -webkit-text-size-adjust: 100%;
        }

        .page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .container {
          width: 100%;
          max-width: 420px;
          padding: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .logo {
          width: 220px;
          height: auto;
          margin: 0 auto 8px;
          display: block;
        }

        h2 {
          color: #24a43e;
          font-size: 24px;
          font-weight: 700;
          margin: 10px 0 18px;
          text-align: center;
        }

        form {
          width: 100%;
          max-width: 360px;
          display: grid;
          gap: 12px;
        }

        .field { position: relative; }

        .input {
          width: 100%;
          height: 44px;
          padding: 0 14px;
          padding-right: 44px;
          border-radius: 12px;
          border: 1.5px solid #cfd8dc;
          background: #fff;
          font-size: 16px;
          color: #111827;
          outline: none;
          box-sizing: border-box;
        }
        .input::placeholder { color: #9ca3af; }

        .pw-toggle {
          position: absolute;
          right: 6px;
          top: 50%;
          transform: translateY(-50%);
          border: none;
          background: transparent;
          cursor: pointer;
          width: 28px;
          height: 28px;
          display: grid;
          place-items: center;
          padding: 0;
        }
        .pw-toggle img { width: 20px; height: 20px; }

        .link-small {
          text-align: center;
          font-size: 13px;
          color: #24a43e;
          text-decoration: none;
        }

        .btn {
          background-color: #3ABB47;
          color: #fff;
          height: 46px;
          border: none;
          border-radius: 12px;
          width: 100%;
          cursor: pointer;
          font-weight: bold;
          font-size: 16px;
        }

        .divider {
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          align-items: center;
          gap: 12px;
          margin: 10px 0 2px;
          color: #9ca3af;
          font-size: 13px;
        }
        .divider::before, .divider::after {
          content: "";
          height: 1px;
          background: #e5e7eb;
          display: block;
        }

        .footer-link {
          margin-top: 10px;
          font-size: 14px;
          color: #6b7280;
          text-align: center;
        }
        .footer-link a { color: #24a43e; text-decoration: underline; }
      `}</style>

      <div className="container">
        <img src="/Logo.png" alt="Login Logo" className="logo" />
        <h2>เข้าสู่ระบบ</h2>

        {errorMsg && (
          <p
            style={{
              color: 'red',
              textAlign: 'center',
              fontSize: '14px',
              marginBottom: '10px',
            }}
          >
            {errorMsg}
          </p>
        )}

        <form onSubmit={handleLogin}>
          <div className="field">
            <input
              className="input"
              type="email"
              placeholder="อีเมล"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </div>

          <div className="field">
            <input
              className="input"
              type={showPw ? 'text' : 'password'}
              placeholder="กรอกรหัสผ่าน"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
            <button
              type="button"
              className="pw-toggle"
              onClick={() => setShowPw(!showPw)}
              aria-label={showPw ? 'ซ่อนรหัสผ่าน' : 'แสดงรหัสผ่าน'}
            >
              <img src="/eye2.png" alt="toggle password" />
            </button>
          </div>

          <a className="link-small" href="/line/request-otp">
            ลืมรหัสผ่าน
          </a>

          <button type="submit" className="btn">
            เข้าสู่ระบบ
          </button>

          <div className="divider">หรือ</div>

          <div className="footer-link">
            ไม่มีบัญชี? <a href="/line/register">สมัคร</a>
          </div>
        </form>
      </div>
    </div>
  );
}
