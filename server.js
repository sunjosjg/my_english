const http = require('http');
const fs   = require('fs');
const path = require('path');
const url  = require('url');
const os   = require('os');

const PORT         = 3050;
const BASE         = __dirname;
const DONE_FILE    = path.join(BASE, 'data', 'done.json');
const ANS_FILE     = path.join(BASE, 'data', 'answers.json');

function getLocalIP() {
  for (const ifaces of Object.values(os.networkInterfaces())) {
    for (const iface of ifaces) {
      if (iface.family === 'IPv4' && !iface.internal) return iface.address;
    }
  }
  return 'localhost';
}

function readAnswers() {
  try { return JSON.parse(fs.readFileSync(ANS_FILE, 'utf8')); }
  catch { return {}; }
}
function writeAnswers(data) {
  fs.writeFileSync(ANS_FILE, JSON.stringify(data), 'utf8');
}

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js':   'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.css':  'text/css; charset=utf-8',
  '.png':  'image/png',
  '.ico':  'image/x-icon',
};

function readDone() {
  try { return JSON.parse(fs.readFileSync(DONE_FILE, 'utf8')); }
  catch { return { done: [] }; }
}

function writeDone(data) {
  fs.writeFileSync(DONE_FILE, JSON.stringify(data, null, 2), 'utf8');
}

const server = http.createServer((req, res) => {
  const { pathname } = url.parse(req.url);

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') { res.writeHead(200); res.end(); return; }

  // ── API: 로컬 IP 조회 ──
  if (req.method === 'GET' && pathname === '/api/localip') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ ip: getLocalIP() }));
    return;
  }

  // ── API: 정답 저장 ──
  if (req.method === 'POST' && pathname === '/api/answers') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const { data } = JSON.parse(body);
        const all = readAnswers();
        // 5일 지난 항목 자동 삭제
        const now = Date.now();
        for (const k of Object.keys(all)) {
          if (now - (all[k].created || 0) > 432000000) delete all[k];
        }
        // 날짜별 순번 키 생성 (YYYYMMDD-NNN)
        const d = new Date();
        const dateStr = d.getFullYear().toString()
          + String(d.getMonth()+1).padStart(2,'0')
          + String(d.getDate()).padStart(2,'0');
        const todaySeq = Object.keys(all).filter(k => k.startsWith(dateStr)).length + 1;
        const key = `${dateStr}-${String(todaySeq).padStart(3,'0')}`;
        all[key] = { ...data, created: now };
        writeAnswers(all);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ok: true, key }));
      } catch { res.writeHead(400); res.end('Bad Request'); }
    });
    return;
  }

  // ── API: 정답 목록 조회 ──
  if (req.method === 'GET' && pathname === '/api/answers/list') {
    const all = readAnswers();
    const list = Object.entries(all)
      .map(([key, v]) => ({ key, title: v.title || '', created: v.created || 0 }))
      .sort((a, b) => b.created - a.created);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(list));
    return;
  }

  // ── API: 정답 조회 ──
  if (req.method === 'GET' && pathname === '/api/answers') {
    const k = new URLSearchParams(url.parse(req.url).query || '').get('k');
    const all = readAnswers();
    if (k && all[k]) {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(all[k]));
    } else {
      res.writeHead(404); res.end('Not found');
    }
    return;
  }

  // ── API: 완료 목록 조회 ──
  if (req.method === 'GET' && pathname === '/api/done') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(readDone()));
    return;
  }

  // ── API: 완료 상태 저장 ──
  if (req.method === 'POST' && pathname === '/api/done') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const { key, done } = JSON.parse(body);
        const data = readDone();
        if (done) {
          if (!data.done.includes(key)) data.done.push(key);
        } else {
          data.done = data.done.filter(k => k !== key);
        }
        writeDone(data);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ok: true }));
      } catch (e) {
        res.writeHead(400); res.end('Bad Request');
      }
    });
    return;
  }

  // ── 정적 파일 서빙 ──
  const filePath = path.join(BASE, pathname === '/' ? 'index.html' : pathname);
  fs.readFile(filePath, (err, data) => {
    if (err) { res.writeHead(404); res.end('Not found'); return; }
    const ext = path.extname(filePath);
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
    res.end(data);
  });
});

server.listen(PORT, () => {
  console.log(`✅ 서버 시작: http://localhost:${PORT}`);
});