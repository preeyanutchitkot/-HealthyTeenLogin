import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(req) {
  try {
    const { oaUserId } = await req.json();

    if (!oaUserId) {
      return NextResponse.json({ error: "missing oaUserId" }, { status: 400 });
    }

    await axios.post(
      "https://api.line.me/v2/bot/message/push",
      {
        to: oaUserId,
        messages: [
          {
            type: "flex",
            altText: "เชื่อมต่อสำเร็จ",
            contents: {
              type: "bubble",
              body: {
                type: "box",
                layout: "vertical",
                paddingAll: "20px",
                backgroundColor: "#29ff71ff",
                contents: [
                  {
                    type: "text",
                    text: "💚 คุณได้เชื่อมต่อกับ HealthyTeen สำเร็จแล้ว",
                    wrap: true,
                    weight: "bold",
                    size: "md",
                    color: "#16794C"
                  }
                ]
              }
            }
          }
        ]
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.LINE_CHANNEL_ACCESS_TOKEN}`,
          "Content-Type": "application/json"
        },
      }
    );

    return NextResponse.json({ success: true });

  } catch (err) {
    console.error("❌ SEND WELCOME ERROR:", err.response?.data || err);
    return NextResponse.json({ error: true }, { status: 500 });
  }
}
