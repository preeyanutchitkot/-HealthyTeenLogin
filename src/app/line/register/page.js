'use client';

import React, { useState, useEffect } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { db, auth } from '../lib/firebase';
import { doc, setDoc } from 'firebase/firestore';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [gender, setGender] = useState('');
  const [age, setAge] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [bmi, setBmi] = useState('');

  // คำนวณ BMI ทุกครั้งที่ height หรือ weight เปลี่ยน
  useEffect(() => {
    const h = parseFloat(height);
    const w = parseFloat(weight);
    if (!isNaN(h) && !isNaN(w) && h > 0) {
      const heightInMeters = h / 100;
      const bmiResult = w / (heightInMeters * heightInMeters);
      setBmi(bmiResult.toFixed(2));
    } else {
      setBmi('');
    }
  }, [height, weight]);

  const handleRegister = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('รหัสผ่านไม่ตรงกัน');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, 'users', user.uid), {
        email,
        gender,
        age,
        height,
        weight,
        bmi,
      });

      alert('สมัครสมาชิกสำเร็จ!');
    } catch (error) {
      alert('เกิดข้อผิดพลาด: ' + error.message);
    }
  };

  return (
    <div className="register-container">
      <style jsx>{`
        .register-container {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          background-color: #e9f8ea;
          font-family: 'Noto Sans Thai', sans-serif;
        }

        .content {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .logo {
          width: 180px;
          margin-bottom: 20px;
        }

        h2 {
          color: #84AA81;
          margin-bottom: 4px;
        }

        h4 {
          margin-top: 0;
          margin-bottom: 20px;
          color: #555;
        }

        form {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
        }

        input, select {
          width: 280px;
          padding: 10px;
          border-radius: 10px;
          border: 1px solid #ccc;
          font-size: 16px;
        }

        .row {
          display: flex;
          gap: 10px;
          width: 300px;
        }

        .row input,
        .row select {
          flex: 1;
          min-width: 0;
        }

        .bmi-text {
          font-size: 14px;
          color: #777;
          margin-top: 6px;
        }

        .note {
          font-size: 12px;
          color: #999;
          display: flex;
          justify-content: space-between;
          width: 280px;
          margin-top: -8px;
        }

        .note a {
          color: #84AA81;
          font-weight: bold;
          text-decoration: underline;
        }

        .btn {
          background-color: #3ABB47;
          color: white;
          padding: 10px;
          border: none;
          border-radius: 12px;
          margin-top: 12px;
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
          color: #84AA81;
          text-decoration: underline;
        }
      `}</style>

      <div className="content">
        <h2>สมัครสมาชิก</h2>
        <h4>สำหรับผู้สมัครสมาชิกใหม่</h4>
        <img src="/Logo.png" alt="Register Logo" className="logo" />

        <form onSubmit={handleRegister}>
          <input
            type="email"
            placeholder="อีเมล"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="รหัสผ่าน"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className="note">
            <span>รหัสผ่านควรมีความยาวอย่างน้อย 8 ตัวอักษร</span>
            <a href="/line/liff">เข้าสู่ระบบ</a>
          </div>

          <input
            type="password"
            placeholder="ยืนยันรหัสผ่าน"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <div className="row">
            <select value={gender} onChange={(e) => setGender(e.target.value)}>
              <option value="">เพศ</option>
              <option value="male">ชาย</option>
              <option value="female">หญิง</option>
              <option value="other">อื่น ๆ</option>
            </select>
            <input
              type="number"
              placeholder="อายุ"
              value={age}
              onChange={(e) => setAge(e.target.value)}
            />
          </div>

          <div className="row">
            <input
              type="number"
              placeholder="ส่วนสูง (cm)"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
            />
            <input
              type="number"
              placeholder="น้ำหนัก (kg)"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
            />
          </div>

          <div className="bmi-text">
            BMI ของคุณ: {bmi || 'ยังไม่คำนวณ'}
          </div>

          <button type="submit" className="btn">ยืนยัน</button>
        </form>
      </div>
    </div>
  );
};

export default Register;
