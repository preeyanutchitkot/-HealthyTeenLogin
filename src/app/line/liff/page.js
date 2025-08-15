'use client';

import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../lib/firebase';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert('เข้าสู่ระบบสำเร็จ!');
      router.push('/line/home');
    } catch (error) {
      alert('เกิดข้อผิดพลาด: ' + error.message);
    }
  };

  return (
    <div className="login-container">
      <style jsx>{`
        html, body, #__next, .login-container {
          height: 100%;
          margin: 0;
          padding: 0;
          background: #e9f8ea;
        }
        .login-container {
          min-height: 100vh;
          width: 100vw;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          background-color: #e9f8ea;
          font-family: 'Noto Sans Thai', sans-serif;
          overflow: hidden;
        }
        .content {
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 100%;
          max-width: 360px;
          margin: 0 auto;
          padding: 0 12px;
          box-sizing: border-box;
          flex: 1 0 auto;
          justify-content: center;
        }
        .logo {
          width: 170px;
          max-width: 90vw;
          margin-bottom: 18px;
        }
        h2 {
          color: #3ABB47;
          margin-bottom: 20px;
          font-size: 28px;
          font-weight: 700;
        }
        h5 {
          color: #3ABB47;
          margin-bottom: 20px;
          font-size: 18px;
          font-weight: 500;
          cursor: pointer;
        }
        form {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          width: 100%;
        }
        input {
          width: 100%;
          max-width: 320px;
          padding: 10px 16px;
          border-radius: 10px;
          border: 1.5px solid #BDBDBD;
          font-size: 18px;
          background: #fff;
          color: #3ABB47;
          font-family: inherit;
          box-sizing: border-box;
        }
        .divider {
          display: flex;
          align-items: center;
          gap: 12px;
          width: 100%;
          margin-top: 20px;
          margin-bottom: 8px;
        }
        .divider hr {
          flex: 1;
          border: none;
          border-top: 1px solid #3ABB47;
        }
        .divider span {
          color: #3ABB47;
          font-weight: bold;
        }
        .btn {
          background-color: #3ABB47;
          color: white;
          padding: 14px 0;
          border: none;
          border-radius: 12px;
          margin-top: 8px;
          width: 100%;
          max-width: 320px;
          cursor: pointer;
          font-weight: 700;
          font-size: 20px;
        }
        .link {
          margin-top: 16px;
          font-size: 14px;
          color: #3ABB47;
        }
        .link a {
          color: #3ABB47;
          text-decoration: underline;
        }
        @media (max-width: 480px) {
          .content {
            padding: 24px 8px 0 8px;
          }
          .logo {
            width: 120px;
          }
        }
      `}</style>

      <div className="content">
        <img src="/Logo.png" alt="Login Logo" className="logo" />
        <h2>เข้าสู่ระบบ</h2>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="อีเมล"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="กรอกรหัสผ่าน"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          
          <h5>ลืมรหัสผ่าน</h5> 
          <button type="submit" className="btn">เข้าสู่ระบบ</button>
        </form>

        <div className="divider">
          <hr />
          <span>หรือ</span>
          <hr />
        </div>
        <div className="link">
          ไม่มีบัญชี <a href="/line/register">สมัคร</a>
        </div>
      </div>
    </div>
  );
};

export default Login;
