import { writeBatch, collection, doc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from './firebase';

function toYMD(d = new Date()) {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Bangkok' }).format(d);
}

export async function saveCartToFirestore(items) {
  const user = auth.currentUser;
  if (!user) return;

  const uid = user.uid;
  const ymd = toYMD();
  const col = collection(db, 'food');
  const batch = writeBatch(db);

  items.forEach((it) => {
    if (!it || !it.name || it.calories === undefined || it.calories === null) return;

    const qty = Number(it.qty);
    const caloriesPerUnit = Number(it.calories);
    if (!qty || isNaN(caloriesPerUnit)) return;

    const totalCalories = caloriesPerUnit * qty;   // 450 * 0.5 = 225

    const ref = doc(col);
    batch.set(ref, {
      uid,
      ymd,
      date: serverTimestamp(),
      item: it.name,
      qty,                     // 0.5
      caloriesPerUnit,         // 450 (เก็บเผื่ออนาคต)
      calories: totalCalories, // 225 (ที่กินจริง)
      imageUrl: typeof it.image === 'string' ? it.image : null,
    });
  });

  await batch.commit();
}

