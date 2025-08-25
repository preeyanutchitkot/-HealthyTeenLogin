import BottomMenu from "../components/menu";
import styles from "./fga.module.css";
import FgaClient from "./FgaClient";

export default function FgaPage() {
  return (
    <div className={styles.wrapper}>
      <header className={styles.header}>ข้อกำหนดเงื่อนไขในการใช้งาน</header>

      <FgaClient styles={styles} />

      {/* เมนูล่างติดจอ (ถ้าคอมโพเนนต์เมนูของคุณ fixed อยู่แล้วก็ยังโอเค) */}
      <div className={styles.menuDock}>
        <BottomMenu />
      </div>
    </div>
  );
}
