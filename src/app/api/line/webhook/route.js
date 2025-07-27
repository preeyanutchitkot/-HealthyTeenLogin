export async function GET(req) {
  return new Response("LINE Webhook is running!", { status: 200 });
}

export async function POST(req) {
  const body = await req.json();
  console.log("📩 Event:", JSON.stringify(body, null, 2));

  const ACCESS_TOKEN = process.env.LINE_ACCESS_TOKEN;

  // loop ทุก event ที่ LINE ส่งมา
  for (const event of body.events) {
    // ถ้ามีคนส่งข้อความเข้ามา
    if (event.type === "message" && event.message.type === "text") {
      const userMessage = event.message.text;

      // ตอบกลับไปยังผู้ใช้
      await fetch("https://api.line.me/v2/bot/message/reply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${ACCESS_TOKEN}`,
        },
        body: JSON.stringify({
          replyToken: event.replyToken,
          messages: [
            {
              type: "text",
              text: `คุณพิมพ์ว่า: ${userMessage}`,
            },
          ],
        }),
      });
    }
  }

  return new Response("OK", { status: 200 });
}
