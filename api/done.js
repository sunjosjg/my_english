// Vercel 서버리스 함수 — Upstash Redis REST API 사용
const UPSTASH_URL   = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;
const KEY = 'my_english_done';

async function redisGet() {
  const res = await fetch(`${UPSTASH_URL}/get/${KEY}`, {
    headers: { Authorization: `Bearer ${UPSTASH_TOKEN}` }
  });
  const json = await res.json();
  return json.result ? JSON.parse(json.result) : [];
}

async function redisSet(list) {
  await fetch(`${UPSTASH_URL}/set/${KEY}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${UPSTASH_TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(JSON.stringify(list))
  });
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') { res.status(200).end(); return; }

  if (req.method === 'GET') {
    const done = await redisGet();
    res.json({ done });
    return;
  }

  if (req.method === 'POST') {
    const { key, done: isDone } = req.body;
    let list = await redisGet();
    if (isDone) {
      if (!list.includes(key)) list.push(key);
    } else {
      list = list.filter(k => k !== key);
    }
    await redisSet(list);
    res.json({ ok: true });
    return;
  }

  res.status(405).end('Method Not Allowed');
}