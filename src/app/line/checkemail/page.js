import { Noto_Sans_Thai } from "next/font/google";
import { useRouter } from "next/navigation";

const notoSansThai = Noto_Sans_Thai({ weight:["300","400","500","700"], subsets:["thai","latin"], display:"swap" });

export default function CheckEmailPage() {
  const router = useRouter();
  return (
    <div className={notoSansThai.className} style={{background:"#fff",minHeight:"100vh"}}>
      <div style={{maxWidth:400,margin:"0 auto",padding:"32px 20px 0"}}>
        <div style={{display:"flex",alignItems:"center",marginBottom:24}}>
          <button onClick={()=>router.back()} style={{background:"#E9F8EA",border:"none",cursor:"pointer",width:36,height:36,borderRadius:"50%"}} aria-label="ย้อนกลับ">
            <img src="/back2.png" alt="back" style={{width:22,height:22}} />
          </button>
        </div>
        <div style={{color:"#3ABB47",fontWeight:700,fontSize:22,textAlign:"center",marginBottom:24}}>กรุณาตรวจสอบอีเมลของคุณ</div>
        <div style={{display:"flex",justifyContent:"center",marginBottom:24}}>
          <img src="/Rectangle.png" alt="check email" style={{width:280,height:"auto"}} />
        </div>
        <div style={{color:"#222",fontSize:15,textAlign:"center",marginBottom:12,fontWeight:500}}>
          เราได้ส่งลิงก์ไปยังอีเมลของคุณแล้ว<br/>กรุณาเปิดลิงก์เพื่อเปลี่ยนรหัสผ่าน
        </div>
        <div style={{color:"#888",fontSize:14,textAlign:"center",marginBottom:32}}>
          หากไม่พบอีเมล โปรดตรวจสอบโฟลเดอร์ Spam/Junk
        </div>
        <button onClick={()=>router.push("/line/login")}
          style={{width:"100%",background:"#3ABB47",color:"#fff",border:"none",borderRadius:12,padding:"16px 0",fontWeight:700,fontSize:20,boxShadow:"0 2px 8px rgba(58,187,71,.08)"}}>
          เข้าสู่ระบบ
        </button>
      </div>
    </div>
  );
}
