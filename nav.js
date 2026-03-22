// nav.js — 공통 햄버거 메뉴
(function () {
  'use strict';

  // ── CSS ──
  const styleEl = document.createElement('style');
  styleEl.textContent = `
    #nav-topbar {
      position: fixed; top: 0; left: 0; right: 0; height: 74px; z-index: 298;
      background: var(--bg, #f1f5f9);
    }
    #nav-btn {
      position: fixed; top: 14px; left: 14px; z-index: 300;
      background: var(--card, #fff); border: 2px solid var(--border, #e2e8f0);
      border-radius: 12px; width: 46px; height: 46px;
      display: flex; flex-direction: column; align-items: center; justify-content: center;
      gap: 5px; cursor: pointer; box-shadow: 0 2px 8px rgba(0,0,0,0.08); padding: 0;
    }
    #nav-btn span { display: block; width: 20px; height: 2.5px; background: var(--text, #1e293b); border-radius: 2px; }
    #nav-home-btn {
      position: fixed; top: 14px; left: 70px; z-index: 300;
      background: var(--card, #fff); border: 2px solid var(--border, #e2e8f0);
      border-radius: 12px; width: 46px; height: 46px;
      display: flex; align-items: center; justify-content: center;
      cursor: pointer; box-shadow: 0 2px 8px rgba(0,0,0,0.08); font-size: 20px;
    }
    #nav-home-btn:hover { border-color: var(--primary, #5b4fcf); background: var(--primary-bg, #eef2ff); }
    #nav-unit-bar {
      position: fixed; top: 14px; left: 126px; right: 14px; height: 46px; z-index: 299;
      background: var(--card, #fff); border: 2px solid var(--border, #e2e8f0);
      border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.06);
      display: flex; align-items: center; justify-content: center;
      padding: 0 14px; gap: 6px; overflow: hidden;
    }
    #nav-unit-bar .nub-type { font-size: 13px; color: var(--muted, #64748b); font-weight: 600; white-space: nowrap; }
    #nav-unit-bar .nub-sep  { font-size: 12px; color: var(--border, #e2e8f0); }
    #nav-unit-bar .nub-unit { font-size: 14px; color: var(--primary, #5b4fcf); font-weight: 700; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    #nav-overlay {
      position: fixed; inset: 0; background: rgba(0,0,0,0.45); z-index: 400; display: none;
    }
    #nav-overlay.open { display: block; }
    #nav-drawer {
      position: absolute; left: 0; top: 0; bottom: 0; width: 290px;
      background: var(--card, #fff); padding: 24px 20px 32px; overflow-y: auto;
      transform: translateX(-100%);
      transition: transform 0.25s cubic-bezier(0.4,0,0.2,1);
    }
    #nav-overlay.open #nav-drawer { transform: translateX(0); }
    .nav-hd { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
    .nav-title { font-size: 21px; font-weight: 800; color: var(--primary, #5b4fcf); }
    .nav-close-btn { background: none; border: none; font-size: 26px; cursor: pointer; color: var(--muted, #64748b); line-height: 1; padding: 4px; }
    .nav-unit-info {
      background: var(--primary-bg, #eef2ff); border-radius: 10px;
      padding: 12px 14px; margin-bottom: 16px;
      font-size: 14px; color: var(--primary, #5b4fcf); font-weight: 600; line-height: 1.6;
    }
    .nav-btn {
      width: 100%; padding: 14px 16px; text-align: left;
      background: var(--bg, #f1f5f9); border: 2px solid var(--border, #e2e8f0);
      border-radius: var(--radius, 14px); font-size: 16px; font-weight: 700;
      cursor: pointer; margin-bottom: 8px; display: flex; align-items: center;
      gap: 10px; transition: all 0.15s; font-family: inherit; color: var(--text, #1e293b);
    }
    .nav-btn:hover { border-color: var(--primary, #5b4fcf); background: var(--primary-bg, #eef2ff); }
    .nav-btn.nav-cur { border-color: var(--primary, #5b4fcf); background: var(--primary-bg, #eef2ff); color: var(--primary, #5b4fcf); }
    .nav-no-unit { text-align: center; padding: 48px 16px; color: var(--muted, #64748b); font-size: 17px; font-weight: 600; line-height: 1.8; }
  `;
  styleEl.textContent += `\n body { padding-top: 76px !important; } ::-webkit-scrollbar { display: none; } * { scrollbar-width: none; font-variant-emoji: emoji; }`;
  document.head.appendChild(styleEl);

  // ── HTML ──
  const topbar = document.createElement('div');
  topbar.id = 'nav-topbar';
  document.body.appendChild(topbar);

  const btn = document.createElement('button');
  btn.id = 'nav-btn';
  btn.setAttribute('aria-label', '메뉴');
  btn.innerHTML = '<span></span><span></span><span></span>';
  btn.onclick = navOpen;
  document.body.appendChild(btn);

  const unitBar = document.createElement('div');
  unitBar.id = 'nav-unit-bar';
  unitBar.innerHTML = '<span class="nub-unit" style="color:var(--muted,#64748b)">단원을 선택하세요</span>';
  document.body.appendChild(unitBar);

  const homeBtn = document.createElement('button');
  homeBtn.id = 'nav-home-btn';
  homeBtn.setAttribute('aria-label', '처음으로');
  homeBtn.textContent = '🏠';
  homeBtn.onclick = () => { location.href = 'index.html'; };
  document.body.appendChild(homeBtn);

  const overlay = document.createElement('div');
  overlay.id = 'nav-overlay';
  overlay.innerHTML = `
    <div id="nav-drawer">
      <div class="nav-hd">
        <div class="nav-title">📚 학습 메뉴</div>
        <button class="nav-close-btn" onclick="navClose()">✕</button>
      </div>
      <div id="nav-body"></div>
    </div>`;
  overlay.onclick = (e) => { if (e.target === overlay) navClose(); };
  document.body.appendChild(overlay);

  // ── State ──
  let _page = '';
  let _onLeave = null;
  let _printFn = null;
  let _printAllFn = null;
  let _navUnit = null;

  // ── Public API ──
  window.initNav = function (page, opts) {
    _page = page;
    _onLeave = (opts && opts.onLeave) || null;
    _printFn = (opts && opts.printFn) || null;
    _printAllFn = (opts && opts.printAllFn) || null;
    if (page === 'index') {
      homeBtn.style.display = 'none';
      unitBar.style.left = '70px';
    } else {
      initUnitBarFromUrl();
    }
  };

  window.setNavUnit = function (courseId, typeId, unitId, courseLabel, typeLabel, unitShort, unitLabel) {
    _navUnit = { courseId, typeId, unitId, courseLabel, typeLabel, unitShort, unitLabel };
    renderUnitBar(typeLabel, unitShort, unitLabel);
  };

  function renderUnitBar(typeLabel, unitShort, unitLabel) {
    if (!typeLabel && !unitLabel) { return; }
    const fmt = s => s ? s.replace(/(\d)\.(\d)/g, '$1·$2') : s;
    unitBar.innerHTML =
      `<span class="nub-type">${typeLabel || ''}</span>` +
      `<span class="nub-sep">·</span>` +
      `<span class="nub-unit">${unitShort ? fmt(unitShort) + '. ' : ''}${fmt(unitLabel) || ''}</span>`;
  }

  // 비index 페이지: URL params로 manifest 로드 후 바 업데이트
  async function initUnitBarFromUrl() {
    const p = new URLSearchParams(location.search);
    const cId = p.get('c'), tId = p.get('t'), uId = p.get('u');
    if (!cId || !tId || !uId) return;
    try {
      const res = await fetch('data/index.json');
      const manifest = await res.json();
      const course = manifest.courses.find(c => c.id === cId);
      const type   = course?.types.find(t => t.id === tId);
      const unit   = type?.units.find(u => u.id === uId);
      if (type && unit) renderUnitBar(type.label, unit.short, unit.label);
    } catch {}
  }

  function navOpen() {
    document.getElementById('nav-body').innerHTML = buildMenu();
    document.getElementById('nav-overlay').classList.add('open');
  }
  window.navOpen = navOpen;

  function navClose() {
    document.getElementById('nav-overlay').classList.remove('open');
  }
  window.navClose = navClose;

  function buildMenu() {
    const isIndex = _page === 'index';

    let unit = null;
    if (isIndex) {
      unit = _navUnit;
    } else {
      const p = new URLSearchParams(location.search);
      const c = p.get('c'), t = p.get('t'), u = p.get('u');
      if (c && t && u) unit = { courseId: c, typeId: t, unitId: u };
    }

    if (!unit) {
      return `<div class="nav-no-unit">📖 단원을 먼저 선택하세요<br><span style="font-size: 14px;font-weight:400">메인 화면에서 단원을 선택하면<br>여기서 바로 학습할 수 있어요!</span></div>`;
    }

    const unitInfoHtml = (unit.courseLabel && unit.unitShort)
      ? `<div class="nav-unit-info">📌 ${unit.courseLabel} · ${unit.typeLabel}<br>${unit.unitShort}. ${unit.unitLabel}</div>`
      : `<div class="nav-unit-info">📌 ${unit.courseId} · ${unit.typeId} · ${unit.unitId}</div>`;

    const cur = (p) => _page === p ? ' nav-cur' : '';
    const act = (p) => _page === p
      ? `onclick="navClose()"`
      : `onclick="navGo('${p}')"`;

    let html = unitInfoHtml;

    if (!isIndex) {
      html += `<button class="nav-btn" onclick="navGo('home')">🏠 처음으로</button>`;
    }
    html += `<button class="nav-btn${cur('study')}" ${act('study')}>🃏 플래시카드${_page === 'study' ? ' (현재)' : ''}</button>`;
    html += `<button class="nav-btn${cur('sentence')}" ${act('sentence')}>🧩 문장 완성${_page === 'sentence' ? ' (현재)' : ''}</button>`;
    html += `<button class="nav-btn${cur('daily')}" ${act('daily')}>📝 Daily Test${_page === 'daily' ? ' (현재)' : ''}</button>`;
    html += `<button class="nav-btn${cur('check')}" ${act('check')}>📷 정답 채점${_page === 'check' ? ' (현재)' : ''}</button>`;

    if (isIndex) {
      html += `<button class="nav-btn" onclick="navGo('print')">🖨️ Test 인쇄</button>`;
      html += `<button class="nav-btn" onclick="navGo('print-all')">📖 전체 인쇄</button>`;
    }

    return html;
  }

  function navGo(mode) {
    navClose();
    if (_onLeave) _onLeave();

    if (mode === 'home') { location.href = 'index.html'; return; }
    if (mode === 'print' && _printFn) { _printFn(); return; }
    if (mode === 'print-all' && _printAllFn) { _printAllFn(); return; }

    let p;
    if (_page === 'index' && _navUnit) {
      p = new URLSearchParams({ c: _navUnit.courseId, t: _navUnit.typeId, u: _navUnit.unitId });
    } else {
      const pp = new URLSearchParams(location.search);
      p = new URLSearchParams({ c: pp.get('c'), t: pp.get('t'), u: pp.get('u') });
    }

    if (mode === 'daily')    { location.href = `daily.html?${p}`; return; }
    if (mode === 'sentence') { location.href = `sentence.html?${p}`; return; }
    if (mode === 'study')    { location.href = `study.html?${p}`; return; }
    if (mode === 'check')    { location.href = `check.html?${p}`; return; }
  }
  window.navGo = navGo;

})();
