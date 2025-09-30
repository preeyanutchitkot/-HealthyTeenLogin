import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { email, otp } = await req.json();

    // ✅ ส่งผ่าน REST API ของ EmailJS
    const res = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        service_id: process.env.EMAILJS_SERVICE_ID, // เช่น service_sk2lrw5
        template_id: process.env.EMAILJS_TEMPLATE_ID, // เช่น template_c4xrq78
        user_id: process.env.EMAILJS_PUBLIC_KEY, // เช่น Jt54GAVU8GSz0KJYB
        template_params: {
          email, // จะส่งไปแทน {{email}}
          passcode: otp, // จะส่งไปแทน {{passcode}}
        },
      }),
    });

    const result = await res.text();
    console.log('EmailJS Response:', res.status, result);

    if (!res.ok) throw new Error(result);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('❌ EmailJS ส่งล้มเหลว:', err);
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
