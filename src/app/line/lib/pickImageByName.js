// app/lib/pickImageByName.js
const CURRY_IMAGE = encodeURI("/Rice with curry.jpg"); // หรือเปลี่ยนไฟล์เป็น /rice-with-curry.jpg

export function pickImageByName(name = "") {
  const s = name.toLowerCase().trim();

  // ก๋วยเตี๋ยว/เส้น
  if (/(ก๋วยเตี๋ยว|บะหมี่|ราเมง|ขนมจีน|วุ้นเส้น|เส้น|pho|ramen)/.test(s)) {
    return "/foods/1/noodles.png";
  }
  // ข้าวราดแกง / พวกแกงต่าง ๆ
  if (/(ข้าวราดแกง|แกงเขียวหวาน|แกงเผ็ด|แกงส้ม|มัสมั่น|พะแนง|แกงกะหรี่|แกง)/.test(s)) {
    return CURRY_IMAGE;
  }
  // ต้ม
  if (/^ต้ม|ต้มยำ|ต้มจืด|ต้มโคล้ง|ต้มข่า|ต้ม/.test(s)) {
    return "/foods/1/boiled.png";
  }
  // ผัด/คั่ว
  if (/(ผัด|คั่ว)/.test(s)) {
    return "/foods/1/Stir-fried.png";
  }
  // ไม่เข้ากลุ่มไหนเลย
  return "/foods/1/custom.png";
}
