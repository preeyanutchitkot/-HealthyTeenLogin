'use client';

import React, { useState, useEffect } from 'react';
import {
  createUserWithEmailAndPassword,
  fetchSignInMethodsForEmail,
} from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { db, auth } from '../lib/firebase';
import {
  doc,
  setDoc,
  runTransaction,
  serverTimestamp,
} from 'firebase/firestore';
import styles from './Register.module.css';

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
  const [activityFactor, setActivityFactor] = useState('');
  const [bmr, setBmr] = useState('');
  const [tdee, setTdee] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false); 

  useEffect(() => {
    const h = parseFloat(height);
    const w = parseFloat(weight);
    const a = parseInt(age, 10);
    const af = parseFloat(activityFactor);

    if (!isNaN(h) && !isNaN(w) && h > 0) {
      const heightInMeters = h / 100;
      const bmiResult = w / (heightInMeters * heightInMeters);
      setBmi(bmiResult.toFixed(2));

      let bmrResult = '';
      if (gender && !isNaN(a)) {
        if (gender === 'male') {
          bmrResult = 66.47 + 13.75 * w + 5.003 * h - 6.755 * a;
        } else if (gender === 'female') {
          bmrResult = 655.1 + 9.563 * w + 1.85 * h - 4.676 * a;
        }
        setBmr(bmrResult.toFixed(0));
        if (!isNaN(af)) {
          setTdee(Math.round(bmrResult * af));
        }
      }
    } else {
      setBmi('');
      setBmr('');
      setTdee('');
    }
  }, [height, weight, age, gender, activityFactor]);

  const getNextUserSeqId = async () => {
    const counterRef = doc(db, 'metadata', 'counters');
    const nextNum = await runTransaction(db, async (tx) => {
      const snap = await tx.get(counterRef);
      if (!snap.exists()) {
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
    setErrorMsg('');
    setIsLoading(true);

    const emailNorm = email.trim().toLowerCase();

    if (password !== confirmPassword) {
      setIsLoading(false);
      return setErrorMsg('รหัสผ่านไม่ตรงกัน');
    }
    if (password.length < 8) {
      setIsLoading(false);
      return setErrorMsg('รหัสผ่านควรยาวอย่างน้อย 8 ตัวอักษร');
    }

    try {
      const methods = await fetchSignInMethodsForEmail(auth, emailNorm);
      if (methods.length > 0) {
        setIsLoading(false);
        return setErrorMsg('อีเมลนี้มีบัญชีอยู่แล้ว');
      }

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        emailNorm,
        password
      );
      const user = userCredential.user;
      const seqId = await getNextUserSeqId();

      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        seqId,
        email: emailNorm,
        gender,
        age: parseInt(age, 10),
        height: parseFloat(height),
        weight: parseFloat(weight),
        bmi: parseFloat(bmi),
        bmr: parseInt(bmr),
        activityFactor: parseFloat(activityFactor) || null,
        tdee: parseInt(tdee),
        createdAt: serverTimestamp(),
      });

      localStorage.setItem("lastEmail", emailNorm);
      localStorage.setItem("lastLoginAt", Date.now().toString());

      router.push('/line/link-line');

    } catch (error) {
      console.error(error);
      if (error.code === 'auth/email-already-in-use')
        setErrorMsg('อีเมลนี้มีบัญชีอยู่แล้ว');
      else setErrorMsg('เกิดข้อผิดพลาด: ' + (error.message || 'ไม่ทราบสาเหตุ'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <img src="/Logo.png" alt="Register Logo" className={styles.logo} />
        <h2>สมัครสมาชิก</h2>
        <h4>สำหรับผู้สมัครสมาชิกใหม่</h4>

        {errorMsg && <p className={styles.errorMsg}>{errorMsg}</p>}

        <form onSubmit={handleRegister}>
          {/* Email */}
          <div className={styles.field}>
            <input
              className={styles.input}
              type="email"
              placeholder="อีเมล"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password */}
          <div className={styles.field}>
            <input
              className={styles.input}
              type={showPw ? 'text' : 'password'}
              placeholder="รหัสผ่าน"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className={styles.pwToggle}
              onClick={() => setShowPw(!showPw)}
            >
              <img src="/eye2.png" alt="toggle password" />
            </button>
          </div>

          <div className={styles.note}>
            <span>รหัสผ่านควรมีอย่างน้อย 8 ตัวอักษร</span>
            <a href="/">เข้าสู่ระบบ</a>
          </div>

          {/* Confirm Password */}
          <div className={styles.field}>
            <input
              className={styles.input}
              type={showPw ? 'text' : 'password'}
              placeholder="ยืนยันรหัสผ่าน"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          {/* Gender + Age */}
          <div className={styles.row}>
            <div>
              <div className={styles.label}>เพศ</div>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                required
              >
                <option value="">เลือกเพศ</option>
                <option value="male">ชาย</option>
                <option value="female">หญิง</option>
              </select>
            </div>
            <div>
              <div className={styles.label}>อายุ</div>
              <input
                type="number"
                placeholder="อายุ"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Height + Weight */}
          <div className={styles.row}>
            <div>
              <div className={styles.label}>ส่วนสูง (ซม.)</div>
              <input
                type="number"
                placeholder="ส่วนสูง"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                required
              />
            </div>
            <div>
              <div className={styles.label}>น้ำหนัก (กก.)</div>
              <input
                type="number"
                placeholder="น้ำหนัก"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                required
              />
            </div>
          </div>

          <div className={styles.bmiText}>
            BMI ของคุณ: {bmi || 'ยังไม่คำนวณ'}
            <br />
            BMR ของคุณ: {bmr || 'ยังไม่คำนวณ'}
          </div>

        <button type="submit" className={styles.btn} disabled={isLoading}>
          {isLoading ? "กำลังบันทึก..." : "ยืนยัน"}
        </button>
        </form>

        <div className={styles.footerLink}>
          มีบัญชีอยู่แล้ว? <a href="/">เข้าสู่ระบบ</a>
        </div>
      </div>
    </div>
  );
}
