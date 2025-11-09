import Image from 'next/image';
import styles from './FoodFooter.module.css';

export default function FoodFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.content}>
        <Image 
          src="/image-removebg-preview (56).png" 
          alt="กระทรวงสาธารณสุข" 
          width={40} 
          height={40}
          className={styles.logo}
        />
        <p>ข้อมูลอ้างอิงจาก สํานักโภชนาการ กรมอนามัย กระทรวงสาธารณสุข</p>
      </div>
    </footer>
  );
}
