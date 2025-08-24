'use client';

import React, { useState, useEffect } from 'react';
import {
  createUserWithEmailAndPassword,
  fetchSignInMethodsForEmail,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { db, auth } from '../lib/firebase';
import {
  doc,
  setDoc,
  runTransaction,
  serverTimestamp,
} from 'firebase/firestore';

export default function Register() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [gender, setGender] = useState('');
  const [age, setAge] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [bmi, setBmi] = useState('');

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

  // ===== ขอเลขรันนิ่ง "user1", "user2", ... แบบอะตอมมิก =====
  const getNextUserSeqId = async () => {
    const counterRef = doc(db, 'metadata', 'counters');
    const nextNum = await runTransaction(db, async (tx) => {
      const snap = await tx.get(counterRef);
      if (!snap.exists()) {
        // create ครั้งแรก userCounter = 1  (ตรงกับ Firestore Rules)
        tx.set(counterRef, { userCounter: 1 });
        return 1;
      } else {
        const current = snap.data().userCounter || 0;
        const next = current + 1;
        tx.update(counterRef, { userCounter: next });
        return next;
      }
    });
    return `user${nextNum}`;
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    const emailNorm = email.trim().toLowerCase();

    if (password !== confirmPassword) {
      alert('รหัสผ่านไม่ตรงกัน');
      return;
    }
    if (password.length < 8) {
      alert('รหัสผ่านควรยาวอย่างน้อย 8 ตัวอักษร');
      return;
    }

    try {
      // เช็กว่ามีอีเมลอยู่แล้วไหม
      const methods = await fetchSignInMethodsForEmail(auth, emailNorm);
      if (methods.length > 0) {
        const doReset = confirm('อีเมลนี้มีบัญชีอยู่แล้ว ต้องการรีเซ็ตรหัสผ่านไหม?');
        if (doReset) {
          await sendPasswordResetEmail(auth, emailNorm);
          alert('ส่งลิงก์รีเซ็ตรหัสผ่านไปที่อีเมลแล้ว');
        }
        router.push('/line/liff'); // ไปหน้าเข้าสู่ระบบ
        return;
      }

      // สมัคร Auth
      const userCredential = await createUserWithEmailAndPassword(auth, emailNorm, password);
      const user = userCredential.user;

      // ขอ seqId เช่น "user1"
      const seqId = await getNextUserSeqId();

      // แปลงชนิดข้อมูล
      const ageNum = age ? parseInt(age, 10) : null;
      const heightNum = height ? parseFloat(height) : null;
      const weightNum = weight ? parseFloat(weight) : null;
      const bmiNum = bmi ? parseFloat(bmi) : null;

      // บันทึกลง users/<uid> (doc id = uid)
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        seqId,                  // ← เก็บเลขรันนิ่งไว้ในฟิลด์
        email: emailNorm,
        gender,
        age: ageNum,
        height: heightNum,
        weight: weightNum,
        bmi: bmiNum,
        createdAt: serverTimestamp(),
      });

      alert('สมัครสมาชิกสำเร็จ!');
      router.push('/line/agreement');
    } catch (error) {
      console.error(error);
      // ดักกรณีพิเศษอีกชั้น (กัน race condition ระหว่างเช็ก-สมัคร)
      if (error.code === 'auth/email-already-in-use') {
        const doReset = confirm('อีเมลนี้มีบัญชีแล้ว ต้องการรีเซ็ตรหัสผ่านไหม?');
        if (doReset) {
          await sendPasswordResetEmail(auth, emailNorm);
          alert('ส่งลิงก์รีเซ็ตรหัสผ่านไปที่อีเมลแล้ว');
        }
        router.push('/line/liff');
        return;
      }
      alert('เกิดข้อผิดพลาด: ' + error.message);
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
          width: 180px;
          margin-bottom: 16px;
        }
        h2 {
<<<<<<< Updated upstream
          color: #84AA81;
=======
          color: #3ABB47;
          font-size: 24px;
          font-weight: 700;
>>>>>>> Stashed changes
          margin-bottom: 4px;
          text-align: center;
        }
        h4 {
          color: #555;
          font-size: 16px;
          margin-bottom: 20px;
          text-align: center;
        }
        form {
          width: 100%;
          max-width: 360px;
          display: grid;
          gap: 12px;
        }
        .field {
          position: relative;
        }
        .input {
          width: 100%;
          height: 44px;
          padding: 0 14px;
          padding-right: 44px;
          border-radius: 12px;
          border: 1.5px solid #cfd8dc;
          background: #fff;
          font-size: 15px;
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

        .row {
          display: flex;
          gap: 10px;
        }
        .row > div {
          flex: 1;
        }
        .label {
          font-size: 14px;
<<<<<<< Updated upstream
          color: #777;
          margin-top: 6px;
=======
          font-weight: bold;
          color: #3ABB47;
          margin-bottom: 4px;
        }
        select, input[type="number"] {
          width: 100%;
          height: 44px;
          padding: 0 12px;
          border-radius: 10px;
          border: 1px solid #ccc;
          font-size: 15px;
          box-sizing: border-box;
>>>>>>> Stashed changes
        }
        .note {
          font-size: 12px;
          color: #999;
          display: flex;
          justify-content: space-between;
        }
        .note a {
          color: #84AA81;
          font-weight: bold;
          text-decoration: underline;
        }
        .bmi-text {
          font-size: 14px;
          color: red;
          text-align: center;
        }
        .btn {
          background-color: #3ABB47;
          color: white;
          height: 46px;
          border: none;
          border-radius: 12px;
          width: 100%;
          cursor: pointer;
          font-weight: 700;
          font-size: 16px;
        }
        .footer-link {
          margin-top: 10px;
          font-size: 14px;
          color: #6b7280;
          text-align: center;
        }
        .footer-link a {
          color: #24a43e;
          text-decoration: underline;
        }
      `}</style>

      <div className="container">
        <img src="/Logo.png" alt="Register Logo" className="logo" />
        <h2>สมัครสมาชิก</h2>
        <h4>สำหรับผู้สมัครสมาชิกใหม่</h4>

        <form onSubmit={handleRegister}>
          <div className="field">
            <input
              className="input"
              type="email"
              placeholder="อีเมล"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="field">
            <input
              className="input"
              type={showPw ? 'text' : 'password'}
              placeholder="รหัสผ่าน"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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

          <div className="note">
            <span>รหัสผ่านควรมีอย่างน้อย 8 ตัวอักษร</span>
            <a href="/line/liff">เข้าสู่ระบบ</a>
          </div>

          <div className="field">
            <input
              className="input"
              type={showPw ? 'text' : 'password'}
              placeholder="ยืนยันรหัสผ่าน"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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

          <div className="row">
            <div>
              <div className="label">เพศ</div>
              <select value={gender} onChange={(e) => setGender(e.target.value)} required>
                <option value="">เลือกเพศ</option>
                <option value="male">ชาย</option>
                <option value="female">หญิง</option>
              </select>
            </div>
            <div>
              <div className="label">อายุ</div>
              <input
                type="number"
                placeholder="อายุ"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="row">
            <div>
              <div className="label">ส่วนสูง (ซม.)</div>
              <input
                type="number"
                placeholder="ส่วนสูง"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                required
              />
            </div>
            <div>
              <div className="label">น้ำหนัก (กก.)</div>
              <input
                type="number"
                placeholder="น้ำหนัก"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="bmi-text">
            BMI ของคุณ: {bmi || 'ยังไม่คำนวณ'}
          </div>

          <button type="submit" className="btn">ยืนยัน</button>
        </form>

        <div className="footer-link">
          มีบัญชีอยู่แล้ว? <a href="/line/liff">เข้าสู่ระบบ</a>
        </div>
      </div>
    </div>
  );
}
