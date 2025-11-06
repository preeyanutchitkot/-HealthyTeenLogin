'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import styles from './fga.module.css';
import { getAuth } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import FgaClient from './FgaClient';

export default function AgreementContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [fromRegisterByReferrer, setFromRegisterByReferrer] = useState(false);
  const fromRegisterByQuery = useMemo(
    () => (searchParams?.get('from') || '').toLowerCase() === 'register',
    [searchParams]
  );

  useEffect(() => {
    if (typeof document !== 'undefined') {
      setFromRegisterByReferrer((document.referrer || '').includes('/register'));
    }
  }, []);

  const showAgreement = fromRegisterByQuery || fromRegisterByReferrer;

  const [isChecked, setIsChecked] = useState(false);
  const footerRef = useRef(null);

  useEffect(() => {
    if (!footerRef.current) return;

    let isMounted = true;

    const setVar = () => {
      if (!isMounted) return;
      const h = footerRef.current.offsetHeight || 84;
      document.documentElement.style.setProperty('--footer-h', `${h}px`);
    };

    setVar();

    const ro = new ResizeObserver(() => {
      if (isMounted) setVar();
    });

    ro.observe(footerRef.current);
    window.addEventListener('resize', setVar);

    return () => {
      isMounted = false;
      ro.disconnect();
      window.removeEventListener('resize', setVar);
    };
  }, [showAgreement]);

const handleContinue = async () => {
   const user = getAuth().currentUser;
   if (user) {
    try {
      await updateDoc(doc(db, "users", user.uid), { agreed: true });
     } catch (err) {
      console.error("update agreement failed:", err);
    }
}
router.push("/line/home");
};

  return (
    <div className={styles.wrapper}>
      <header className={styles.header}>ข้อกำหนดเงื่อนไขในการใช้งาน</header>

      <FgaClient styles={styles} />

      {showAgreement && (
        <footer ref={footerRef} className={styles.footer}>
          <div className={styles.footerInner}>
            <div className={styles.agreement}>
              <input
                id="accept"
                type="checkbox"
                checked={isChecked}
                onChange={(e) => setIsChecked(e.target.checked)}
                className={styles.checkbox}
              />
              <label htmlFor="accept" className={styles.agreementText}>
                คุณยอมรับ <span>ข้อกำหนดการใช้งาน</span> และรับทราบ{' '}
                <span>นโยบายความเป็นส่วนตัว</span>
              </label>
            </div>

            <button
              className={styles.nextBtn}
              disabled={!isChecked}
              onClick={handleContinue}
              type="button"
            >
              ต่อไป
            </button>
          </div>
        </footer>
      )}
    </div>
  );
}
