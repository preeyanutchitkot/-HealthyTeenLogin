import { writeBatch, collection, doc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from './firebase';

function toYMD(d = new Date()) {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Bangkok' }).format(d);
}

export async function saveCartToFirestore(items) {
  const user = auth.currentUser;
  if (!user) return; // ✅ user ต้อง login ก่อน

  const uid = user.uid;
  const ymd = toYMD();
  const col = collection(db, 'food');
  const batch = writeBatch(db);

  items.forEach((it) => {
    if (!it || !it.name || !it.qty || !it.calories) return;

    const ref = doc(col);
    batch.set(ref, {
      uid,
      ymd,
      date: serverTimestamp(),
      item: it.name,
      qty: Number(it.qty),
      calories: Number(it.calories),
      imageUrl: typeof it.image === 'string' ? it.image : null,
    });
  });

  await batch.commit();
}
