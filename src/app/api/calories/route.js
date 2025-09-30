export async function POST(req) {
  try {
    const { foodName } = await req.json();
    const n8nUrl =
      process.env.N8N_WEBHOOK_URL ||
      'https://healthyteen-n8n.ddns.net/webhook/food';

    const r = await fetch(n8nUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ foodName }),
      cache: 'no-store',
    });

    const status = r.status;
    const text = await r.text();
    const type = r.headers.get('content-type') || '';

    if (!text.trim())
      return Response.json({ ok: true, empty: true }, { status });
    if (type.includes('application/json')) {
      try {
        return Response.json(JSON.parse(text), { status });
      } catch {}
    }
    return Response.json({ raw: text }, { status });
  } catch (e) {
    return Response.json({ error: String(e) }, { status: 500 });
  }
}
