import Image from 'next/image';
import styles from './contact.module.css';
import Header from '../components/header';

export default function ContactPage() {
  return (
    <div className="header-container">
      <Header title="ติดต่อเรา" cartoonImage="/9.png" />

      <div className={styles.content}>
        หากคุณต้องการความช่วยเหลือ ติดต่อเราได้ที่
      </div>

      <div className={styles.heroBox}>
        <Image
          src="/doctor.png"
          alt="contact"
          width={180}
          height={180}
          priority
          style={{ width: '180px', height: 'auto', display: 'block' }}
        />
      </div>

      <div className={styles.social}>
        <a
          className={styles.btn}
          href="https://line.me/R/ti/p/@696kpmzu"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span className={styles.iconBox}>
            <Image
              src="/line.png"
              alt="Line"
              width={22}
              height={22}
              priority
              style={{ width: '22px', height: 'auto' }}
            />
          </span>
          LINE HEALTHY TEEN
        </a>

        <a
          className={styles.btn}
          href="https://www.facebook.com/profile.php?id=61583365658632"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span className={styles.iconBox}>
            <Image
              src="/facebook.png"
              alt="Facebook"
              width={22}
              height={22}
              style={{ width: '22px', height: 'auto' }}
            />
          </span>
          Facebook HEALTHY TEEN
        </a>
      </div>

      <div className={styles.version}>
        version 2.5
      </div>
    </div>
  );
}
