
"use client";

import { Noto_Sans_Thai } from "next/font/google";
import { useState, useEffect } from "react";
import Image from "next/image";
import { auth, db } from "../lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";

const notoSansThai = Noto_Sans_Thai({
	weight: ["300", "400", "500", "700"],
	subsets: ["thai", "latin"],
	display: "swap",
});

export default function EditMenuPage() {
		const [email, setEmail] = useState("");
		const [gender, setGender] = useState("");
		const [age, setAge] = useState("");
		const [height, setHeight] = useState("");
		const [weight, setWeight] = useState("");
		const router = useRouter();

		useEffect(() => {
			const unsub = onAuthStateChanged(auth, async (user) => {
				if (user) {
					setEmail(user.email || "");
					const userDoc = await getDoc(doc(db, "users", user.uid));
					if (userDoc.exists()) {
						const data = userDoc.data();
						setGender(data.gender || "");
						setAge(data.age || "");
						setHeight(data.height || "");
						setWeight(data.weight || "");
					}
				}
			});
			return () => unsub();
		}, []);

		// ไม่แสดงรหัสผ่านจริง
		const handleChangePassword = (e) => {
			e.preventDefault();
			router.push("/line/changepassword");
		};

		return (
		<div className={notoSansThai.className} style={{ background: "#fff", minHeight: "100vh", padding: 0 }}>
			<div
				style={{
					maxWidth: 400,
					width: '100%',
					margin: "0 auto",
					padding: "32px 20px 0 20px",
					boxSizing: 'border-box',
				}}
			>
				{/* Back button */}
				<div style={{ display: "flex", alignItems: "center", marginBottom: 18 }}>
					<button onClick={() => window.history.back()} style={{ background: "#E9F8EA", border: "none", cursor: "pointer", padding: 0, marginRight: 8, width: 36, height: 36, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
						<img src="/back2.png" alt="back" style={{ width: 22, height: 22 }} />
					</button>
					<span style={{ color: "#3ABB47", fontWeight: 700, fontSize: 22, flex: 1, textAlign: "center" }}>อัพเดตโปรไฟล์</span>
				</div>

				{/* Profile avatar */}
				<div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 24 }}>
								<div style={{ width: 80, height: 80, borderRadius: "50%", background: "#F3F8F3", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 8, position: "relative" }}>
									<Image src="/profile.png" alt="avatar" width={48} height={48} />
									{/* วงกลมเขียว + ไอคอนดินสอ (สีดำ, ขนาดพอดี) */}
									<div style={{ width: 24, height: 24, background: "#3ABB47", borderRadius: "50%", border: "2px solid #fff", position: "absolute", bottom: 2, right: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 6px rgba(0,0,0,0.08)' }}>
										<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
											<path d="M4 20h4.586a1 1 0 0 0 .707-.293l10.5-10.5a2 2 0 0 0 0-2.828l-2.172-2.172a2 2 0 0 0-2.828 0l-10.5 10.5A1 1 0 0 0 4 15.414V20z" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
											<path d="M14.5 6.5l3 3" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
										</svg>
									</div>
								</div>
				</div>

				{/* Email */}
	<input type="email" value={email} readOnly style={{ width: "100%", maxWidth: 400, boxSizing: 'border-box', padding: "12px 20px", borderRadius: 10, border: "1.5px solid #E0E0E0", marginBottom: 14, fontSize: 16, background: '#fff', color: '#222', fontFamily: 'inherit' }} />
				{/* Password + Change button */}
								<div style={{ display: "flex", marginBottom: 18, width: '100%', maxWidth: 400 }}>
									<input type="password" value={"********"} readOnly placeholder="********" style={{ flex: 1, minWidth: 0, padding: "12px 20px", borderRadius: "10px 0 0 10px", border: "1.5px solid #E0E0E0", borderRight: "none", fontSize: 16, background: '#fff', color: '#222', fontFamily: 'inherit' }} />
									<button onClick={handleChangePassword} style={{ background: "#3ABB47", color: "#fff", border: "none", borderRadius: "0 10px 10px 0", padding: "0 18px", fontWeight: 700, fontSize: 16, minWidth: 110, height: 48, whiteSpace: 'nowrap' }}>เปลี่ยนรหัสผ่าน</button>
								</div>

				{/* Row: Gender + Age */}
			<div style={{ display: "flex", gap: 12, marginBottom: 12, width: '100%', maxWidth: 400 }}>
					<div style={{ flex: 1, background: "#fff", border: "1.5px solid #E0E0E0", borderRadius: 10, padding: "12px 16px 8px 16px", display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
						<div style={{ color: "#3ABB47", fontWeight: 700, fontSize: 15, marginBottom: 2 }}>ระบุเพศ</div>
						<div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
							<img src="/gender.png" alt="gender" style={{ width: 22, height: 22, marginRight: 8, opacity: 0.6 }} />
							<select value={gender} onChange={e => setGender(e.target.value)} style={{ color: gender ? "#222" : "#BDBDBD", fontSize: 15, border: "none", background: "none", width: '100%', fontFamily: 'inherit' }}>
								<option value="">เพศ</option>
								<option value="male">ชาย</option>
								<option value="female">หญิง</option>
							</select>
						</div>
					</div>
					<div style={{ flex: 1, background: "#fff", border: "1.5px solid #E0E0E0", borderRadius: 10, padding: "12px 16px 8px 16px", display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
						<div style={{ color: "#3ABB47", fontWeight: 700, fontSize: 15, marginBottom: 2 }}>อายุ</div>
						<div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
							<img src="/age.png" alt="age" style={{ width: 22, height: 22, marginRight: 8, opacity: 0.6 }} />
							<input type="number" value={age} onChange={e => setAge(e.target.value)} placeholder="อายุ" style={{ color: age ? "#222" : "#BDBDBD", fontSize: 15, border: "none", background: "none", width: '100%', fontFamily: 'inherit' }} />
						</div>
					</div>
				</div>

				{/* Row: Height + Weight */}
			<div style={{ display: "flex", gap: 12, marginBottom: 28, width: '100%', maxWidth: 400 }}>
					<div style={{ flex: 1, background: "#fff", border: "1.5px solid #E0E0E0", borderRadius: 10, padding: "12px 16px 8px 16px", display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
						<div style={{ color: "#3ABB47", fontWeight: 700, fontSize: 15, marginBottom: 2 }}>ส่วนสูง</div>
						<div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
							<img src="/height.png" alt="height" style={{ width: 22, height: 22, marginRight: 8, opacity: 0.6 }} />
							<input type="number" value={height} onChange={e => setHeight(e.target.value)} placeholder="ส่วนสูง" style={{ color: height ? "#222" : "#BDBDBD", fontSize: 15, border: "none", background: "none", width: '100%', fontFamily: 'inherit' }} />
						</div>
					</div>
					<div style={{ flex: 1, background: "#fff", border: "1.5px solid #E0E0E0", borderRadius: 10, padding: "12px 16px 8px 16px", display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
						<div style={{ color: "#3ABB47", fontWeight: 700, fontSize: 15, marginBottom: 2 }}>น้ำหนัก</div>
						<div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
							<img src="/weight.png" alt="weight" style={{ width: 22, height: 22, marginRight: 8, opacity: 0.6 }} />
							<input type="number" value={weight} onChange={e => setWeight(e.target.value)} placeholder="น้ำหนัก" style={{ color: weight ? "#222" : "#BDBDBD", fontSize: 15, border: "none", background: "none", width: '100%', fontFamily: 'inherit' }} />
						</div>
					</div>
				</div>

				{/* Save button */}
			<button style={{ width: "100%", maxWidth: 400, background: "#3ABB47", color: "#fff", border: "none", borderRadius: 12, padding: "16px 0", fontWeight: 700, fontSize: 20, marginTop: 8 }}>บันทึก</button>
			</div>
		</div>
	);
}
