import Header from '../../components/header';
import Image from 'next/image';

export default function CartPage() {
  return (
    <div>
      <Header title="เมนูของคุณ" cartoonImage="/mymenu.png" />
      <div style={{
        minHeight: '60vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <Image src="/bear.png" alt="เมนูของคุณ" width={190} height={240} />
        <div style={{ marginTop: 8, fontSize: 18, color: '#888', textAlign: 'center' }}>
          คุณยังไม่เพิ่มอาหารของคุณ
        </div>
      </div>
    </div>
  );
}
