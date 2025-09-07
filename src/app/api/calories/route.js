// app/api/calories/route.js
export async function POST(req) {
  try {
    const { foodName } = await req.json();
    const n8nUrl =
      process.env.N8N_WEBHOOK_URL ||
      "https://heroic-nicely-walleye.ngrok-free.app/webhook/js";

    const r = await fetch(n8nUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ foodName }),
      cache: "no-store",
    });

    const status = r.status;
    const contentType = r.headers.get("content-type") || "";
    const text = await r.text();

    // 1) ถ้า body ว่าง (เช่น 204 No Content) → ส่ง JSON ว่างๆ กลับไป
    if (!text || text.trim() === "") {
      return Response.json({ ok: true, empty: true }, { status });
    }

    // 2) ถ้าเป็น JSON จริง → ส่งต่อเป็น JSON เดิม
    if (contentType.includes("application/json")) {
      try {
        const json = JSON.parse(text);
        return Response.json(json, { status, headers: { "Cache-Control": "no-store" } });
      } catch {
        // ถ้า header บอกว่าเป็น json แต่ parse ไม่ได้ ก็ตกไปข้อ 3
      }
    }

    // 3) ไม่ใช่ JSON → ห่อเป็น JSON ให้แน่ใจว่า client เรียก res.json() ได้
    return Response.json({ raw: text }, { status, headers: { "Cache-Control": "no-store" } });
  } catch (e) {
    return Response.json({ error: String(e) }, { status: 500 });
  }
}
