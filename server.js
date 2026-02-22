const http = require('http');
const fs   = require('fs');
const path = require('path');
const url  = require('url');

const PORT      = 3000;
const BASE      = __dirname;
const DONE_FILE = path.join(BASE, 'data', 'done.json');

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