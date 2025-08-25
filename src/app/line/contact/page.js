"use client";

import Image from "next/image";
import BottomMenu from "@/app/line/components/menu";
import styles from "./contact.module.css";

export default function ContactPage() {
  return (
    <div className={styles.wrapper}>
      {/* Header */}
      <div className={styles.header}>Healthy Teen</div>

      {/* Text */}
      <div className={styles.content}>
        หากคุณต้องการความช่วยเหลือ ติดต่อเราได้ที่
      </div>

      {/* Hero image — ระบุ width/height + style height:auto กัน warning */}
      <div className={styles.heroBox}>
        <Image
          src="/doctor.png"
          alt="contact"
          width={180}
          height={180}
          priority
          style={{ width: "180px", height: "auto", display: "block" }}
        />
      </div>

      {/* Social Buttons */}
      <div className={styles.social}>
        <a
          className={styles.btn}
          href="https://line.me"
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
              style={{ width: "22px", height: "auto" }}
            />
          </span>
          LINE @696kpmzu
        </a>

        <a
          className={styles.btn}
          href="https://www.facebook.com/nursing.sut"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span className={styles.iconBox}>
            <Image
              src="/facebook.png"
              alt="Facebook"
              width={22}
              height={22}
              style={{ width: "22px", height: "auto" }}
            />
          </span>
          Facebook Nursing SUT
        </a>
      </div>

      {/* Bottom Menu */}
      <div className={styles.bottom}>
        <BottomMenu />
      </div>
    </div>
  );
}
