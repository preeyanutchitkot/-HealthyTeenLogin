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
      router.push('/dashboard');
    } catch (error) {
      alert('เกิดข้อผิดพลาด: ' + error.message);
    }
  };

  return (
    <div className="login-container">
      <style jsx>{`
        .login-container {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          background-color: #e9f8ea; /* พื้นหลังสีเขียวอ่อน */
          font-family: 'Noto Sans Thai', sans-serif;
        }

        .content {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .logo {
          width: 200px;
          margin-bottom: 20px;
        }

        h2 {
          color: #84AA81; /* หัวข้อสีเขียวเข้ม */
          margin-bottom: 20px;
        }

        h5 {
          color: #84AA81; /* หัวข้อสีเขียวเข้ม */
          margin-bottom: 20px;
        }

        form {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
        }

        input {
          width: 280px;
          padding: 10px;
          border-radius: 10px;
          border: 1px solid #ccc;
          font-size: 16px;
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
          border-top: 1px solid #93BC99;
        }

        .divider span {
          color: #84AA81;
          font-weight: bold;
        }

        .btn {
          background-color: #3ABB47;
          color: white;
          padding: 10px;
          border: none;
          border-radius: 12px;
          margin-top: 8px;
          width: 280px;
          cursor: pointer;
          font-weight: bold;
          font-size: 16px;
        }

        .link {
          margin-top: 16px;
          font-size: 14px;
        }

        .link a {
          color: #93BC99;
          text-decoration: underline;
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
