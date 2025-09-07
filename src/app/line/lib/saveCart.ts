// lib/saveCart.js
import { writeBatch, collection, doc, serverTimestamp } from "firebase/firestore";
import { db, signInIfNeeded } from "./firebase";

// ทำ ymd ด้วย local time เพื่อไม่ให้เหลื่อมวัน (แทน toISOString)
function toYMDLocal(d = new Date()) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export async function saveCartToFirestore(items) {
  if (!Array.isArray(items) || items.length === 0) return;

  const user = await signInIfNeeded();
  const uid = user.uid;

  const ymd = toYMDLocal(new Date()); // ⬅️ ใช้ local-time ให้ตรงกับการคิวรีหน้าอื่น
  const col = collection(db, "food");

  // หมายเหตุ: Firestore batch limit = 500 writes ต่อ 1 commit
  // ถ้ารายการเยอะมาก ๆ อาจต้องแตกเป็นหลาย batch (กรณีทั่วไปไม่ถึง)
  const batch = writeBatch(db);

  items.forEach((it) => {
    if (!it) return;

    const itemName = String(it.name ?? "").trim();
    const qty = Number(it.qty);
    const calories = Number(it.calories);

    // ผ่านตาม rules: qty >= 1, calories เป็น number, ymd:string, date:timestamp, uid ตรงกับ auth
    if (!itemName) return;
    if (!Number.isFinite(qty) || qty < 1) return;
    if (!Number.isFinite(calories)) return;

    const ref = doc(col); // random id
    batch.set(ref, {
      uid,                     // ต้องตรงกับ request.auth.uid
      ymd,                     // string
      date: serverTimestamp(), // timestamp
      item: itemName,          // string ชื่ออาหาร
      qty,                     // number >= 1
      calories,                // number
      imageUrl: typeof it.image === "string" ? it.image : null, // optional
    });
  });

  await batch.commit();
}
