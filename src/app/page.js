export default function Home() {
  return (
    <>
      <h5>
        ถ้าจะเข้า คลิ๊กนี้ได้เลย<a href="/line/liff">เข้าไปที่นี้</a>
      </h5>

       <h5>
        ส่วนขั้นตอนการติดตั้ง ngrok เพื่อให้สามารถเข้าถึงแอปพลิเคชันจากภายนอกได้
        <br />
      </h5>
      <h5>
        1. ดาวน์โหลด ngrok จาก <a href="https://ngrok.com/download">ที่นี่</a> และเลือกเวอร์ชันที่ตรงกับระบบของคุณ
      </h5>
      <h5>
        2. ติดตั้ง ngrok:
        <ul>
          <li>Windows: ดาวน์โหลดไฟล์ .zip และแตกไฟล์</li>
          <li>เพิ่ม path ของ ngrok.exe ใน Environment Variables</li>
        </ul>
      </h5>
      <h5>
        3. รันคำสั่งนี้หลังจากที่คุณรัน `npm run dev`:
        <pre>ngrok http 3000</pre>
        จะได้ URL ที่สามารถเข้าถึงแอปพลิเคชันจากภายนอก
      </h5>
        <h5>
       คือส่วนเรื่องการรันแชทบอท LINE คือทุกครั้งที่ใช้ ngrokม ันจะเปลี่ยน URL ทุกครั้งที่เปิดใหม่ เพราะงั้นอัปเดทด้วยนะ https://แถวนี้แหละที่เปลี่ยน.ngrok-free.app/api/line/webhook
      </h5>
    </>
  );
}
