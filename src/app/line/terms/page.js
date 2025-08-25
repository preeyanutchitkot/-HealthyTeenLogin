import BottomMenu from "@/app/line/components/menu";
import styles from "./fga.module.css";
import FgaClient from "./FgaClient";

export default function FgaPage() {
  return (
    <div className={styles.wrapper}>
      <header className={styles.header}>ข้อกำหนดเงื่อนไขในการใช้งาน</header>

      <FgaClient styles={styles} />

      <div className={styles.menuDock}>
        <BottomMenu />
      </div>
    </div>
  );
}
