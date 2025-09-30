// app/lib/pickImageByName.js
export function pickImageByName(name = '') {
  const s = name.toLowerCase().trim();

  // ก๋วยเตี๋ยว/เส้น
  if (
    /(ก๋วยเตี๋ยว|บะหมี่|ราเมง|ขนมจีน|วุ้นเส้น|เส้น|pho|ramen|noodle)/.test(s)
  ) {
    return '/foods/1/noodles.png';
  }

  // ข้าวราดแกง
  if (/(^ข้าวราด|^ข้าว)/.test(s)) {
    return '/foods/1/curry.png';
  }

  if (/(^แกงเขียวหวาน|แกงเผ็ด|แกงส้ม|มัสมั่น|พะแนง|แกงกะหรี่|แกง)/.test(s)) {
    return '/foods/1/แกง.png';
  }

  // ต้ม
  if (/(^ต้ม|ต้มยำ|ต้มจืด|ต้มโคล้ง|ต้มข่า)/.test(s)) {
    return '/foods/1/boiled.png';
  }

  //ส้มตำ
  if (/(^ตำ|^ส้มตำ|papaya salad)/.test(s)) {
    return '/foods/1/salad.png';
  }

  if (/(^ยำ)/.test(s)) {
    return '/foods/1/ยำ.png';
  }

  // ผัด
  if (/(^ผัด|stir fry|炒)/.test(s)) {
    return '/foods/1/fried.png';
  }

  if (/(^คั่ว)/.test(s)) {
    return '/foods/1/คั่ว.png';
  }

  // ทอด
  if (/(^ทอด|fried|fry|tempura)/.test(s)) {
    return '/foods/1/fry.png';
  }

  // นึ่ง
  if (/(^นึ่ง|steam|steamed|ติ่มซำ|ซาลาเปา|shumai)/.test(s)) {
    return '/foods/1/steam.png';
  }

  // ตุ๋น
  if (/(^ตุ๋น|^พะโล้|stew|braise|slow cook)/.test(s)) {
    return '/foods/1/stew.png';
  }

  // ย่าง / ปิ้ง / BBQ
  if (/(^ย่าง|^ปิ้ง|หมูกระทะ|grill|bbq|บาร์บีคิว|คุโรบุตะ)/.test(s)) {
    return '/foods/1/grill.png';
  }

  // อบ / เบเกอรี่
  if (/(อบ|^ขนมปัง|เบเกอรี่|muffin|cake|bread|cookie|pie)/.test(s)) {
    return '/foods/1/bake.png';
  }

  // รมควัน
  if (/(รมควัน|smoke|smoked)/.test(s)) {
    return '/foods/1/smoked.png';
  }

  // ลวก
  if (/(ลวก|จิ้มจุ่ม|boil quick)/.test(s)) {
    return '/foods/1/blanch.png';
  }

  // หมัก
  if (/(หมัก|ดอง|ferment|kimchi|pickled|cure|marinate)/.test(s)) {
    return '/foods/1/marinate.png';
  }

  // ขนมหวาน
  if (/(^เค้ก)/.test(s)) {
    return '/foods/1/cake.png';
  }

  if (/(ของหวาน|^ขนม)/.test(s)) {
    return '/foods/1/dessert.png';
  }

  // เครื่องดื่ม
  if (
    /(น้ำ|กาแฟ|ชา|เครื่องดื่ม|drink|juice|coffee|tea|soda|beer|wine)/.test(s)
  ) {
    return '/foods/1/drink.png';
  }

  if (/(สลัด|^ผัก)/.test(s)) {
    return '/foods/1/sl.png';
  }

  if (/(^ผล[^\s]*)/.test(s)) {
    return '/foods/1/f.png';
  }

  // ไม่เข้ากลุ่มไหนเลย
  return '/foods/1/custom.png';
}
