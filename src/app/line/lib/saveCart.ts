import { writeBatch, collection, doc, serverTimestamp } from "firebase/firestore";
import { db, signInIfNeeded } from "./firebase";

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

  const ymd = toYMDLocal(new Date());
  const col = collection(db, "food");

  const batch = writeBatch(db);

  items.forEach((it) => {
    if (!it) return;

    const itemName = String(it.name ?? "").trim();
    const qty = Number(it.qty);
    const calories = Number(it.calories);

    if (!itemName) return;
    if (!Number.isFinite(qty) || qty < 1) return;
    if (!Number.isFinite(calories)) return;

    const ref = doc(col);
    batch.set(ref, {
      uid,
      ymd, 
      date: serverTimestamp(),
      item: itemName,
      qty,
      calories,
      imageUrl: typeof it.image === "string" ? it.image : null,
    });
  });

  await batch.commit();
}
