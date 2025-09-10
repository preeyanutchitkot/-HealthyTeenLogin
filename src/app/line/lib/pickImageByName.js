// app/lib/pickImageByName.js
export function pickImageByName(name = "") {
  const s = name.toLowerCase().trim();

  // ก๋วยเตี๋ยว/เส้น
  if (/(ก๋วยเตี๋ยว|บะหมี่|ราเมง|ขนมจีน|วุ้นเส้น|เส้น|pho|ramen|noodle)/.test(s)) {
    return "/foods/1/noodles.png";
  }

  // ข้าวราดแกง / แกงต่าง ๆ
  if (/(ข้าวราดแกง|แกงเขียวหวาน|แกงเผ็ด|แกงส้ม|มัสมั่น|พะแนง|แกงกะหรี่|แกง)/.test(s)) {
    return "/foods/1/curry.png";
  }

  // ต้ม
  if (/(^ต้ม|ต้มยำ|ต้มจืด|ต้มโคล้ง|ต้มข่า)/.test(s)) {
    return "/foods/1/boiled.png";
  }

  // ยำ / ส้มตำ
  if (/(ยำ|ตำ|somtum|papaya salad)/.test(s)) {
    return "/foods/1/salad.png";
  }

  // ผัด / คั่ว
  if (/(ผัด|คั่ว|stir fry|炒)/.test(s)) {
    return "/foods/1/fried.png";
  }

  // ทอด
  if (/(ทอด|fried|fry|tempura)/.test(s)) {
    return "/foods/1/fry.png";
  }

  // นึ่ง
  if (/(นึ่ง|steam|steamed|ติ่มซำ|ซาลาเปา|shumai)/.test(s)) {
    return "/foods/1/steam.png";
  }

  // ตุ๋น
  if (/(ตุ๋น|พะโล้|stew|braise|slow cook)/.test(s)) {
    return "/foods/1/stew.png";
  }

  // ย่าง / ปิ้ง / BBQ
  if (/(ย่าง|ปิ้ง|烧烤|grill|bbq|บาร์บีคิว|คุโรบุตะ)/.test(s)) {
    return "/foods/1/grill.png";
  }

  // อบ / เบเกอรี่
  if (/(อบ|เค้ก|ขนมปัง|เบเกอรี่|muffin|cake|bread|cookie|pie)/.test(s)) {
    return "/foods/1/bake.png";
  }

  // รมควัน
  if (/(รมควัน|smoke|smoked)/.test(s)) {
    return "/foods/1/smoked.png";
  }

  // ลวก
  if (/(ลวก|blanch|boil quick)/.test(s)) {
    return "/foods/1/blanch.png";
  }

  // หมัก
  if (/(หมัก|ดอง|ferment|kimchi|pickled|cure|marinate)/.test(s)) {
    return "/foods/1/marinate.png";
  }

  // ขนมหวาน
  if (/(ของหวาน|ขนม|dessert|sweet)/.test(s)) {
    return "/foods/1/dessert.png";
  }

  // เครื่องดื่ม
  if (/(น้ำ|กาแฟ|ชา|เครื่องดื่ม|drink|juice|coffee|tea|soda|beer|wine)/.test(s)) {
    return "/foods/1/drink.png";
  }

  // ไม่เข้ากลุ่มไหนเลย
  return "/foods/1/custom.png";
}
