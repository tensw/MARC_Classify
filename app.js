// === STATE ===
const state = {
  currentStep: 1,
  completedSteps: new Set(),
  selectedISBN: null,
  bookData: null,
  selectedDDC: null,
  marcRecord: null,
  approval: null,
  viewMode: false,
};

function getBookMeta(isbn) {
  return SAMPLE_BOOKS.find(s => s.isbn === isbn) ||
    (typeof COMPLETED_MARC_MOCK !== 'undefined' && COMPLETED_MARC_MOCK.find(b => b.isbn === isbn));
}

const COMPLETED_DDC_NAMES = {
  '658.8': '마케팅 / 영업 관리',
  '813.36': '일본 문학 / 소설',
  '332.024': '개인 재무 관리',
  '179.9': '처세술 / 사회 윤리',
  '158.1': '자기계발 / 응용 심리학',
  '612.82': '신경 과학 / 뇌 과학',
  '332.46': '자본 / 경제사',
};

function synthesizeBookDataFromMarc(marc, mock) {
  const get = (tag) => {
    const f = marc.visible.find(x => x.tag === tag);
    return f ? f.value : '';
  };
  const t245 = get('245'), t260 = get('260'), t300 = get('300'), t041 = get('041'), t246 = get('246'), t100 = get('100');
  const placeMatch = t260.match(/▾a\s*([^:]+?)\s*:/);
  const pubMatch = t260.match(/▾b\s*([^,]+),/);
  const yearMatch = t260.match(/▾c\s*(\d{4})/);
  const pagesMatch = t300.match(/▾a\s*([^;:]+)/);
  const sizeMatch = t300.match(/▾c\s*([^;]+)/);
  const langMatch = t041.match(/▾a\s*(\w+)/);
  const origLangMatch = t041.match(/▾h\s*(\w+)/);
  const origTitleMatch = t246.match(/▾a\s*(.+)/);
  const origAuthorMatch = t100.match(/▾a\s*([^,▾]+)/);
  const isTrans = !!origLangMatch;
  return {
    biblio: {
      title: mock.title,
      author: mock.author.replace(/\s*\([^)]*\)\s*$/, ''),
      publisher: pubMatch ? pubMatch[1].trim() : '',
      publisher_place: placeMatch ? placeMatch[1].trim() : '',
      year: yearMatch ? yearMatch[1] : '',
      pages: pagesMatch ? pagesMatch[1].trim() : '',
      size: sizeMatch ? sizeMatch[1].trim() : '',
      language: langMatch ? langMatch[1] : 'kor',
      original_title: isTrans && origTitleMatch ? origTitleMatch[1].trim() : null,
      original_author: isTrans && origAuthorMatch ? origAuthorMatch[1].trim() : null,
      edition: null,
    },
    fingerprint: null,
  };
}

function viewCompletedMarc(isbn) {
  if (!COMPLETED_MARC_DETAILS[isbn]) {
    alert('해당 도서의 상세 데이터를 찾을 수 없습니다.');
    return;
  }
  state.viewMode = true;
  state.selectedISBN = isbn;
  state.marcRecord = COMPLETED_MARC_DETAILS[isbn];
  state.completedSteps = new Set([1, 2, 3, 4, 5]);
  const mock = COMPLETED_MARC_MOCK.find(b => b.isbn === isbn);
  state.viewMeta = mock;
  state.bookData = synthesizeBookDataFromMarc(state.marcRecord, mock);
  state.selectedDDC = {
    ddc: state.marcRecord.summary.ddc,
    name: COMPLETED_DDC_NAMES[state.marcRecord.summary.ddc] || '(이전 등록 분류)',
    score: '—',
    meta: '등록 완료 분류',
    reasoning: { matched_keys: [], explanation: '이 도서는 위 DDC로 분류되어 등록 완료된 상태입니다.' }
  };
  goToStep(4);
}

// === LOADING TRANSITIONS ===
const TRANSITION_PHASES = {
  '1to2': {
    primary: '도서 정보를 호출하고 있습니다',
    subs: [
      'ISBN 유효성 검증',
      '국립중앙도서관 API 조회',
      '책 지문(Fingerprint) 17필드 자동 추출',
    ],
    duration: 3000,
  },
  '2to3': {
    primary: 'DDC 분류번호를 매칭하고 있습니다',
    subs: [
      '책 지문 임베딩 생성',
      'SKKU DDC 사전 25,000여 항목과 의미 비교',
      '매칭 점수 산출 중',
      '추천 분류 + 대체 후보 2개 선정',
    ],
    duration: 5000,
  },
  '3to4': {
    primary: 'MARC 레코드를 생성하고 있습니다',
    subs: [
      'SKKU MARC21 사전(361,353건 분석) 참조',
      '필수 필드 11개 구성',
      '의존관계 규칙 적용 (082 → 090, 100 → 245)',
      'ISBD 구두점 규칙 적용',
      '인디케이터 패턴 SKKU 표준 매핑',
      'Raw MARC 출력 형식 준비',
    ],
    duration: 6000,
  },
};

function showLoading(primaryText, subTexts, durationMs, onDone) {
  const overlay = document.getElementById('loading-overlay');
  const subEl = document.getElementById('loading-sub');
  document.getElementById('loading-primary').textContent = primaryText;
  subEl.textContent = subTexts[0];
  overlay.style.setProperty('--loading-duration', durationMs + 'ms');
  overlay.classList.add('active');

  const interval = Math.max(800, Math.floor(durationMs / subTexts.length));
  let i = 0;
  const cycler = setInterval(() => {
    i = Math.min(i + 1, subTexts.length - 1);
    subEl.style.opacity = '0';
    setTimeout(() => {
      subEl.textContent = subTexts[i];
      subEl.style.opacity = '1';
    }, 150);
  }, interval);

  setTimeout(() => {
    clearInterval(cycler);
    overlay.classList.remove('active');
    if (typeof onDone === 'function') onDone();
  }, durationMs);
}

function transitionToStep(fromStep) {
  const key = `${fromStep}to${fromStep + 1}`;
  const phase = TRANSITION_PHASES[key];
  if (!phase) { completeStep(fromStep); return; }
  showLoading(phase.primary, phase.subs, phase.duration, () => completeStep(fromStep));
}

function goHome() {
  state.viewMode = false;
  state.completedSteps.clear();
  state.selectedISBN = null;
  state.bookData = null;
  state.selectedDDC = null;
  state.marcRecord = null;
  document.getElementById('isbn-input').value = '';
  document.querySelectorAll('#sample-chips .chip').forEach(c => { c.classList.remove('active'); c.classList.add('idle'); });
  document.getElementById('call-book-info').disabled = true;
  goToStep(1);
}

// === STAGE NAVIGATION ===
function goToStep(n) {
  if (n < 1 || n > 5) return;
  if (n > state.currentStep && !state.completedSteps.has(n - 1)) return;

  state.currentStep = n;
  document.querySelectorAll('.stage').forEach(s => {
    s.classList.toggle('active', Number(s.dataset.stage) === n);
  });
  updateStepper();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function completeStep(n) {
  state.completedSteps.add(n);
  goToStep(n + 1);
}

function updateStepper() {
  document.querySelectorAll('.stepper .node').forEach(node => {
    const step = Number(node.dataset.step);
    node.classList.remove('done', 'active', 'clickable');
    if (state.completedSteps.has(step) && step !== state.currentStep) {
      node.classList.add('done', 'clickable');
    } else if (step === state.currentStep) {
      node.classList.add('active');
    }
  });
  document.querySelectorAll('.stepper .line').forEach((line, idx) => {
    line.classList.toggle('done', state.completedSteps.has(idx + 1));
  });
}

document.querySelectorAll('.stepper .node').forEach(node => {
  node.addEventListener('click', () => {
    const step = Number(node.dataset.step);
    if (state.viewMode) {
      if (step === 1) { goHome(); return; }
      if ([2, 3, 4, 5].includes(step)) goToStep(step);
      return;
    }
    if (state.completedSteps.has(step) || step === state.currentStep) goToStep(step);
  });
});

// === STAGE 1: ISBN 입력 + 칩 ===
function renderSampleChips() {
  const container = document.getElementById('sample-chips');
  container.innerHTML = SAMPLE_BOOKS.map(b => `
    <span class="chip idle" data-isbn="${b.isbn}">${b.title} · ${b.author}</span>
  `).join('');
  container.querySelectorAll('.chip').forEach(chip => {
    chip.addEventListener('click', () => selectSampleBook(chip.dataset.isbn));
  });
}

function selectSampleBook(isbn) {
  document.querySelectorAll('#sample-chips .chip').forEach(c => {
    c.classList.toggle('active', c.dataset.isbn === isbn);
    c.classList.toggle('idle', c.dataset.isbn !== isbn);
  });
  document.getElementById('isbn-input').value = isbn;
  state.selectedISBN = isbn;
  document.getElementById('call-book-info').disabled = false;
}

document.getElementById('isbn-input').addEventListener('input', (e) => {
  const v = e.target.value.replace(/[-\s]/g, '');
  state.selectedISBN = v;
  document.getElementById('call-book-info').disabled = !BOOK_DETAILS[v];
  document.querySelectorAll('#sample-chips .chip').forEach(c => {
    c.classList.toggle('active', c.dataset.isbn === v);
    c.classList.toggle('idle', c.dataset.isbn !== v);
  });
});

document.getElementById('call-book-info').addEventListener('click', () => {
  if (!state.selectedISBN || !BOOK_DETAILS[state.selectedISBN]) return;
  state.bookData = BOOK_DETAILS[state.selectedISBN];
  transitionToStep(1);
});

// === STAGE 1: 완료 리스트 ===
const COMPLETED_MARC_MOCK = [
  { title: "데이터로 읽고, 전략으로 움직여라", author: "김세훈, 서광민", isbn: "9791167527318", ddc: "658.8", time: "14:22", reviewer: "장석중" },
  { title: "센의 대여 서점", author: "다카세 노리미츠 (이아미 옮김)", isbn: "9791192313832", ddc: "813.36", time: "14:18", reviewer: "박민홍" },
  { title: "돈의 방정식", author: "모건 하우절 (박영문 옮김)", isbn: "9791193904671", ddc: "332.024", time: "14:05", reviewer: "김경석" },
  { title: "무례한 세상에서 나를 지키는 법", author: "발타자르 그라시안", isbn: "9791199489530", ddc: "179.9", time: "13:52", reviewer: "장석중" },
  { title: "렛뎀 이론", author: "멜 로빈스 (이지연 옮김)", isbn: "9791162544327", ddc: "158.1", time: "13:40", reviewer: "박민홍" },
  { title: "뇌는 어떻게 나를 조종하는가", author: "크리스 나이바우어 (김윤경 옮김)", isbn: "9791193941577", ddc: "612.82", time: "13:30", reviewer: "김경석" },
  { title: "왜 그들만 부자가 되는가", author: "윌리엄 번스타인 (백선영 옮김)", isbn: "9791193937396", ddc: "332.46", time: "13:15", reviewer: "장석중" },
];

function renderCompletedList() {
  const tbody = document.getElementById('completed-list-body');
  tbody.innerHTML = COMPLETED_MARC_MOCK.map(b => `
    <tr>
      <td><img class="cover-thumb" src="assets/covers/${b.isbn}.jpg" alt="${b.title} 표지"></td>
      <td><strong>${b.title}</strong> / <span style="color:var(--text-3)">${b.author}</span></td>
      <td class="mono" style="font-size:13px;">${b.isbn}</td>
      <td><span class="ddc-mono">${b.ddc}</span></td>
      <td style="font-size:13px;color:var(--text-3);">${b.time}</td>
      <td>${b.reviewer}</td>
      <td><span class="badge badge-done">승인</span></td>
      <td style="text-align:right;"><a class="link" data-isbn="${b.isbn}">상세 →</a></td>
    </tr>
  `).join('');
  tbody.querySelectorAll('.link').forEach(link => {
    link.addEventListener('click', () => viewCompletedMarc(link.dataset.isbn));
  });
  document.getElementById('show-all-completed').addEventListener('click', () => alert('전체 27건 목록은 추후 제공됩니다.'));
}

// === FINGERPRINT (Stage 2) ===
const FP_VISIBLE_KEYS = ['synopsis', 'concept', 'genre', 'event', 'place', 'character', 'target_audience', 'tone_and_style', 'notable_features', 'synthetic_queries'];
const FP_HIDDEN_KEYS = ['object', 'purpose'];
const FP_LABELS = {
  synopsis: '개요 (synopsis)', concept: '핵심 개념', genre: '장르', event: '사건', place: '장소',
  character: '등장인물', target_audience: '독자층', tone_and_style: '문체',
  notable_features: '특이점', synthetic_queries: '검색쿼리', object: '소품·물체', purpose: '집필 목적'
};

let fingerprintExpanded = false;

function renderFingerprintCard() {
  const fp = state.bookData.fingerprint;
  const visibleKeys = fingerprintExpanded ? [...FP_VISIBLE_KEYS, ...FP_HIDDEN_KEYS] : FP_VISIBLE_KEYS;

  const renderValue = (key, val) => {
    if (key === 'synopsis') return `<div class="v">${val}</div>`;
    if (Array.isArray(val)) {
      if (val.length === 0) return `<div class="v muted">— (해당 없음)</div>`;
      return `<div class="v" data-fp-key="${key}">
        ${val.map((item, idx) => `<span class="tag editable" data-idx="${idx}">${item}<span class="x">✕</span></span>`).join('')}
        <span class="tag-add" data-add="${key}">+ 추가</span>
      </div>`;
    }
    return `<div class="v">${val}</div>`;
  };

  const rows = visibleKeys.map(k => `
    <div class="kv-row"><div class="k">${FP_LABELS[k]}</div>${renderValue(k, fp[k])}</div>
  `).join('');

  const hiddenNote = fingerprintExpanded
    ? ''
    : `<div style="margin-top:10px;font-size:13px;color:var(--text-4);">… +${FP_HIDDEN_KEYS.length + 5}개 필드 (object/purpose, gen 메타 등) — "모두 펼쳐서 편집" 클릭 시 표시</div>`;

  document.getElementById('fingerprint-card-host').innerHTML = `
    <div class="panel">
      <div class="panel-body">
        <div class="section-h-mini">책 지문 — Fingerprint 17필드 <span class="meta">3단계 DDC 매칭에 사용</span></div>
        ${rows}
        ${hiddenNote}
      </div>
    </div>
  `;

  attachFingerprintEdits();
}

function attachFingerprintEdits() {
  document.querySelectorAll('#fingerprint-card-host .tag.editable').forEach(tag => {
    tag.addEventListener('click', (e) => {
      const row = tag.closest('[data-fp-key]');
      const key = row.dataset.fpKey;
      const idx = Number(tag.dataset.idx);
      state.bookData.fingerprint[key].splice(idx, 1);
      renderFingerprintCard();
    });
  });
  document.querySelectorAll('#fingerprint-card-host .tag-add').forEach(btn => {
    btn.addEventListener('click', () => {
      const key = btn.dataset.add;
      const v = prompt(`"${FP_LABELS[key]}"에 추가할 값:`);
      if (v && v.trim()) {
        state.bookData.fingerprint[key].push(v.trim());
        renderFingerprintCard();
      }
    });
  });
}

// === STAGE 2 ===
function renderStage2() {
  if (!state.bookData) return;
  const isView = state.viewMode === true;
  const b = state.bookData.biblio;
  const meta = getBookMeta(state.selectedISBN);
  const cover = meta.cover || `assets/covers/${state.selectedISBN}.jpg`;

  const banner = isView ? `<div class="view-banner">등록 완료된 레코드 — 조회 모드</div>` : '';
  const fingerprintBlock = isView
    ? `<div class="panel"><div class="panel-body">
         <div class="section-h-mini">책 지문 — Fingerprint <span class="meta">조회 모드</span></div>
         <div style="font-size:13px;color:var(--text-3);padding:8px 0;">이 도서의 책 지문은 등록 시점에 분류 매칭에 사용되었으며, 본 화면에서는 표시되지 않습니다.</div>
       </div></div>`
    : `<div id="fingerprint-card-host"></div>`;

  document.getElementById('stage-2-content').innerHTML = `
    ${banner}
    <div class="book-head">
      <img src="${cover}" alt="${b.title} 표지">
      <div class="info">
        <h2>${b.title}</h2>
        <div class="meta-line">${b.author} (지음) · ${b.publisher} · ${b.year} · ISBN ${state.selectedISBN}</div>
      </div>
      ${isView ? '' : '<button class="btn btn-ghost" id="expand-fingerprint">모두 펼쳐서 편집</button>'}
    </div>

    <div class="panel">
      <div class="panel-body">
        <div class="section-h-mini">서지 기본 정보 ${isView ? '' : '<span class="meta">국립중앙도서관 API 호출 결과</span>'}</div>
        <div class="kv-row"><div class="k">제목</div><div class="v">${b.title}</div></div>
        <div class="kv-row"><div class="k">저자</div><div class="v">${b.author}</div></div>
        <div class="kv-row"><div class="k">출판사</div><div class="v">${b.publisher}${b.publisher_place ? ` (${b.publisher_place})` : ''}</div></div>
        <div class="kv-row"><div class="k">발행년</div><div class="v">${b.year}</div></div>
        <div class="kv-row"><div class="k">페이지·크기</div><div class="v">${b.pages}${b.size ? ` ; ${b.size}` : ''}</div></div>
        <div class="kv-row"><div class="k">언어</div><div class="v">${b.language}</div></div>
        <div class="kv-row"><div class="k">원서명/원저자</div><div class="v ${b.original_title ? '' : 'muted'}">${b.original_title ? `${b.original_title} / ${b.original_author}` : '— (원작 없음)'}</div></div>
        ${b.edition ? `<div class="kv-row"><div class="k">판차</div><div class="v">${b.edition}</div></div>` : ''}
      </div>
    </div>

    ${fingerprintBlock}
  `;

  if (!isView) {
    renderFingerprintCard();
    document.getElementById('expand-fingerprint').addEventListener('click', () => {
      fingerprintExpanded = !fingerprintExpanded;
      document.getElementById('expand-fingerprint').textContent = fingerprintExpanded ? '핵심만 보기' : '모두 펼쳐서 편집';
      renderFingerprintCard();
    });
  }

  const btnRow = document.getElementById('stage-2-buttons');
  if (btnRow) {
    btnRow.innerHTML = isView
      ? `<button class="btn btn-ghost" onclick="goHome()">← 완료 목록으로</button>`
      : `<button class="btn btn-ghost" onclick="goToStep(1)">← ISBN 다시 입력</button>
         <button class="btn btn-primary" onclick="transitionToStep(2)">DDC 분류 매칭 →</button>`;
  }
}

const _origGoToStep_s2 = goToStep;
goToStep = function(n) {
  _origGoToStep_s2(n);
  if (n === 2) renderStage2();
};

// === STAGE 3 ===
function renderStage3() {
  const isView = state.viewMode === true;
  const meta = getBookMeta(state.selectedISBN);

  if (isView) {
    const sel = state.selectedDDC;
    document.getElementById('stage-3-content').innerHTML = `
      <div class="view-banner">등록 완료된 레코드 — 조회 모드</div>
      <div class="stage-h">
        <div>
          <h2>DDC 분류번호 (등록 완료)</h2>
          <div class="sub">${meta.author} 『${meta.title}』 — 등록 시 결정된 DDC 분류</div>
        </div>
      </div>
      <div class="ddc-card recommended">
        <div class="ddc-row-top">
          <div>
            <span class="ai-pick-badge">등록 분류</span>
            <div style="margin-top:10px;display:flex;align-items:baseline;gap:12px;">
              <span class="ddc-num">${sel.ddc}</span>
              <span class="ddc-name">${sel.name}</span>
            </div>
            <div class="ddc-meta">${sel.meta || ''}</div>
          </div>
        </div>
        <div class="reasoning">${sel.reasoning.explanation}</div>
      </div>
    `;
    const btnRow = document.getElementById('stage-3-buttons');
    if (btnRow) btnRow.innerHTML = `<button class="btn btn-ghost" onclick="goHome()">← 완료 목록으로</button>`;
    return;
  }

  const cand = DDC_CANDIDATES[state.selectedISBN];
  const rec = cand.recommended;
  const explanation = rec.reasoning.explanation;

  document.getElementById('stage-3-content').innerHTML = `
    <div class="stage-h">
      <div>
        <h2>DDC 분류번호 매칭</h2>
        <div class="sub">${meta.author} 『${meta.title}』 — 책 지문을 SKKU DDC 사전 25,000여 항목과 비교</div>
      </div>
      <span class="timing-badge">자동 매칭 완료 · 0.8초</span>
    </div>

    <div class="ddc-card recommended" data-ddc="${rec.ddc}">
      <div class="ddc-row-top">
        <div>
          <span class="ai-pick-badge">AI 추천</span>
          <div style="margin-top:10px;display:flex;align-items:baseline;gap:12px;">
            <span class="ddc-num">${rec.ddc}</span>
            <span class="ddc-name">${rec.name}</span>
          </div>
          <div class="ddc-meta">${rec.meta}</div>
        </div>
        <div class="score-block">
          <div class="label">매칭 점수</div>
          <div class="num">${rec.score}<span class="max">/100</span></div>
          <div class="score-bar-bg"><div class="score-bar" style="width:${rec.score}%;"></div></div>
        </div>
      </div>
      <div class="reasoning"><strong style="color:var(--indigo)">왜 이 분류인가:</strong> ${highlightMatched(explanation, rec.reasoning.matched_keys)}</div>
    </div>

    <div class="alt-h">대체 후보</div>
    ${cand.alternatives.map(a => `
      <div class="ddc-card" data-ddc="${a.ddc}">
        <div class="ddc-row-top">
          <div>
            <div style="display:flex;align-items:baseline;gap:10px;">
              <span class="ddc-num" style="font-size:16px;">${a.ddc}</span>
              <span class="ddc-name" style="font-size:15px;">${a.name}</span>
            </div>
            <div class="ddc-meta">${a.note}</div>
          </div>
          <div style="display:flex;align-items:center;gap:10px;">
            <span style="font-size:16px;font-weight:700;color:var(--text-3);">${a.score}</span>
            <div class="score-bar-bg" style="width:90px;"><div class="score-bar alt" style="width:${a.score}%;"></div></div>
          </div>
        </div>
      </div>
    `).join('')}
  `;

  state.selectedDDC = rec;
  highlightSelectedDDC();
  document.querySelectorAll('#stage-3-content .ddc-card').forEach(card => {
    card.style.cursor = 'pointer';
    card.addEventListener('click', () => {
      const ddc = card.dataset.ddc;
      if (ddc === rec.ddc) state.selectedDDC = rec;
      else state.selectedDDC = cand.alternatives.find(a => a.ddc === ddc);
      highlightSelectedDDC();
    });
  });

  const btnRow = document.getElementById('stage-3-buttons');
  if (btnRow) btnRow.innerHTML = `
    <button class="btn btn-ghost" onclick="goToStep(2)">← 도서정보 다시 보기</button>
    <button class="btn btn-primary" id="confirm-ddc">선택한 DDC로 확정 →</button>
  `;
  document.getElementById('confirm-ddc').addEventListener('click', () => {
    if (!state.selectedDDC) return;
    transitionToStep(3);
  });
}

function highlightSelectedDDC() {
  document.querySelectorAll('#stage-3-content .ddc-card').forEach(card => {
    card.classList.toggle('recommended', card.dataset.ddc === state.selectedDDC.ddc);
  });
}

function highlightMatched(text, keys) {
  return text.replace(/\[([^\]]+)\]/g, '<span class="matched">$1</span>');
}

const _origGoToStep_s3 = goToStep;
goToStep = function(n) {
  _origGoToStep_s3(n);
  if (n === 3) renderStage3();
};

// === STAGE 4 ===
let marcRawMode = false;
let marcCollapseOpen = false;

function renderStage4() {
  const isView = state.viewMode === true;
  const meta = getBookMeta(state.selectedISBN);
  const marc = isView ? COMPLETED_MARC_DETAILS[state.selectedISBN] : MARC_RECORDS[state.selectedISBN];
  state.marcRecord = marc;

  const banner = isView
    ? `<div class="view-banner">등록 완료된 레코드 — 조회 모드 (수정 불가)</div>`
    : '';
  const subline = isView
    ? `${meta.author} 『${meta.title}』 · DDC ${marc.summary.ddc} · 등록 완료 (검수자: ${meta.reviewer || '—'})`
    : `${meta.author} 『${meta.title}』 · DDC ${marc.summary.ddc} · SKKU MARC21 사전(361,353건 분석) 기반`;

  document.getElementById('stage-4-content').innerHTML = `
    ${banner}
    <div class="stage-h">
      <div>
        <h2>${isView ? 'MARC 레코드 조회' : 'MARC 레코드 자동 생성'}</h2>
        <div class="sub">${subline}</div>
      </div>
      <div class="toggle-bar">
        <button class="${marcRawMode ? '' : 'on'}" id="toggle-friendly">사용자 친화</button>
        <button class="${marcRawMode ? 'on' : ''}" id="toggle-raw">Raw MARC</button>
      </div>
    </div>
    ${isView ? '' : `<div class="info-badges">
      <span class="info-badge indigo">${marc.summary.total}개 필드 자동 생성 · 1.2초</span>
      <span class="info-badge neutral">필수 필드 11개 충족</span>
      <span class="info-badge neutral">규칙 체크 통과</span>
    </div>`}
    <div id="marc-host"></div>
  `;

  const btnRow = document.getElementById('stage-4-buttons');
  if (btnRow) {
    btnRow.innerHTML = isView
      ? `<button class="btn btn-ghost" onclick="goHome()">← 완료 목록으로</button>`
      : `<button class="btn btn-ghost" onclick="goToStep(3)">← DDC 다시 매칭</button>
         <button class="btn btn-primary" onclick="completeStep(4)">최종 검수 →</button>`;
  }

  document.getElementById('toggle-friendly').addEventListener('click', () => { marcRawMode = false; renderMarcBody(); document.getElementById('toggle-friendly').classList.add('on'); document.getElementById('toggle-raw').classList.remove('on'); });
  document.getElementById('toggle-raw').addEventListener('click', () => { marcRawMode = true; renderMarcBody(); document.getElementById('toggle-raw').classList.add('on'); document.getElementById('toggle-friendly').classList.remove('on'); });

  renderMarcBody();
}

function renderMarcBody() {
  const marc = state.marcRecord;
  const host = document.getElementById('marc-host');

  if (marcRawMode) {
    const all = [...marc.visible, ...marc.collapsed];
    host.innerHTML = `<div class="marc-raw">${all.map(f => formatRawLine(f)).join('\n')}</div>`;
    return;
  }

  const isView = state.viewMode === true;
  const renderField = (f) => `
    <div class="marc-row" data-tag="${f.tag}" data-edit="${(!isView && f.tag === '520') ? 'true' : 'false'}">
      <div><div class="tag ${f.essential ? 'essential' : ''}">${f.tag}</div><div class="tag-name">${f.name}</div></div>
      <div class="ind">${f.ind1 || ''}</div>
      <div class="ind">${f.ind2 || ''}</div>
      <div class="val">${formatValueHTML(f.value)}</div>
      <div><span class="marc-status ${f.edited ? 'status-edit' : 'status-auto'}">${isView ? '등록' : (f.edited ? '수정됨' : '자동')}</span></div>
    </div>`;

  host.innerHTML = `
    <div class="marc-table">
      <div class="marc-head">
        <div>태그</div><div>I1</div><div>I2</div><div>값</div><div style="text-align:center;">상태</div>
      </div>
      ${marc.visible.map(f => renderField(f)).join('')}
      ${marcCollapseOpen
        ? marc.collapsed.map(f => renderField(f)).join('')
        : `<div class="marc-collapse">… +${marc.collapsed.length}개 필드 (${marc.collapsed.map(f=>f.tag).join(', ')}) — 클릭하여 펼치기</div>`}
    </div>
  `;

  const collapseBtn = host.querySelector('.marc-collapse');
  if (collapseBtn) collapseBtn.addEventListener('click', () => { marcCollapseOpen = true; renderMarcBody(); });

  host.querySelectorAll('.marc-row[data-edit="true"]').forEach(row => {
    row.addEventListener('click', () => openEditPanel(row.dataset.tag));
  });
}

function formatValueHTML(v) {
  return v.replace(/▾(\w)/g, '<span class="sub">▾$1</span>');
}

function formatRawLine(f) {
  const ind = (f.ind1 || ' ') + (f.ind2 || ' ');
  const val = f.value.replace(/▾/g, '$').replace(/ /g, '');
  return `=${f.tag} ${ind === '  ' ? '' : ind}${val}`;
}

function openEditPanel(tag) {
  const marc = state.marcRecord;
  const field = marc.visible.find(f => f.tag === tag);
  if (!field) return;
  const currentText = field.value.replace(/^▾a /, '');
  const newText = prompt(`${tag} (${field.name}) 편집:`, currentText);
  if (newText === null) return;
  field.value = `▾a ${newText}`;
  field.edited = true;
  marc.summary.edited = (marc.summary.edited || 0) + 1;
  renderMarcBody();
}

const _origGoToStep_s4 = goToStep;
goToStep = function(n) {
  _origGoToStep_s4(n);
  if (n === 4) { marcCollapseOpen = false; marcRawMode = false; renderStage4(); }
};

// === STAGE 5 ===
function renderStage5() {
  const isView = state.viewMode === true;
  const meta = getBookMeta(state.selectedISBN);
  const marc = state.marcRecord;
  const isTrans = marc.is_translation;

  const checks = [
    { icon: 'pass', title: '필수 필드 11개 충족', desc: '001, 005, 007, 008, 020, 040, 082, 090, 100, 245, 260, 300' },
    { icon: 'pass', title: '의존관계 규칙 통과', desc: '082→090 청구기호 파생, 100→245 ind1=1 일치' },
    { icon: 'pass', title: '인디케이터 패턴 SKKU 표준 부합', desc: '한국인 저자 100 ind1=0, 245 ind1=1' },
    { icon: 'pass', title: '구두점 규칙 OK', desc: '245 "/", 260 ":/," 등 ISBD 구두점 적용' },
    isTrans
      ? { icon: 'pass', title: '번역서 분기 일관성', desc: '041 $h, 246, 700 역자, 900 모두 생성됨' }
      : { icon: 'pass', title: '번역서 분기 일관성', desc: '원작서 → 041 $h, 246, 700 역자, 900 미생성 정상' },
    { icon: 'info', title: '참조 가능', desc: `DDC ${marc.summary.ddc} SKKU 동일분류 도서 평균 13개 필드 사용` },
    { icon: 'info', title: '책 지문 fingerprint 17필드 모두 채워짐', desc: '검색랭킹 활용 가능' },
  ];

  const headerTop = isView
    ? `<div class="stage-h">
        <div>
          <h2>검수 결과 (등록 완료)</h2>
          <div class="sub">${meta.title} — ${meta.reviewer || '—'} 검수, ${meta.time || ''}</div>
        </div>
        <span class="review-status-badge" style="background:var(--green-50);color:#065F46;">승인 완료</span>
       </div>`
    : `<div class="stage-h">
        <div>
          <h2>최종 검수 — 사람이 확인합니다</h2>
          <div class="sub">자동 생성 결과를 검토하고 책임자 승인 후 저장됩니다.</div>
        </div>
        <span class="review-status-badge review-pending">미승인 상태</span>
       </div>`;

  const reviewerBlock = isView
    ? `<div class="panel green-border">
        <div class="panel-h green">검수자 정보</div>
        <div class="reviewer-form">
          <div class="row">
            <div><label>검수자</label><div class="value mono" style="padding:8px 0;font-family:inherit;font-size:14px;">${meta.reviewer || '—'}</div></div>
            <div><label>검수 일시</label><div class="value mono" style="padding:8px 0;font-family:inherit;font-size:14px;">2026-05-06 ${meta.time || ''}</div></div>
          </div>
          <div><label>검수 메모</label><div style="padding:8px 0;font-size:13px;color:var(--text-2);">자동 검증 통과, 정식 등록 완료.</div></div>
        </div>
       </div>`
    : `<div class="panel green-border">
        <div class="panel-h green">검수자 확인</div>
        <div class="reviewer-form">
          <div class="row">
            <div><label>검수자</label><input type="text" class="text-input" id="reviewer-name" value="김OO 사서"></div>
            <div><label>검수 일시</label><input type="text" class="text-input" id="reviewer-time" value="${new Date().toISOString().slice(0,16).replace('T',' ')}"></div>
          </div>
          <div style="margin-bottom:12px;">
            <label>검수 메모 (선택)</label>
            <textarea id="reviewer-memo" placeholder="예: 520 요약주기를 도서관 표준 양식에 맞게 수정함."></textarea>
          </div>
          <label class="commit-check">
            <input type="checkbox" id="reviewer-commit">
            위 자동 검증 ${checks.length}건 및 모든 MARC 필드를 직접 확인했으며, 본 레코드를 정식 등록할 책임을 진다.
          </label>
        </div>
       </div>`;

  const bottomRow = isView
    ? `<div class="btn-row"><button class="btn btn-ghost" onclick="goHome()">← 완료 목록으로</button></div>`
    : `<div class="btn-row">
        <div style="display:flex;gap:6px;">
          <button class="btn btn-ghost" onclick="goToStep(4)">← MARC 다시 보기</button>
          <button class="btn btn-ghost" id="export-marc">MARC 파일로 내보내기</button>
        </div>
        <button class="btn-confirm" id="confirm-approval" disabled>승인하고 등록</button>
       </div>`;

  document.getElementById('stage-5-content').innerHTML = `
    ${isView ? '<div class="view-banner">등록 완료된 레코드 — 조회 모드</div>' : ''}
    ${headerTop}

    <div class="panel">
      <div class="panel-h">처리 요약</div>
      <div class="summary-grid">
        <div class="summary-item"><div class="label">도서</div><div class="value">${meta.title} / ${meta.author}</div></div>
        <div class="summary-item"><div class="label">ISBN</div><div class="value mono">${state.selectedISBN}</div></div>
        <div class="summary-item"><div class="label">DDC</div><div class="value">${marc.summary.ddc} (${state.selectedDDC.name})${isView ? '' : ` <span class="accent">매칭점수 ${state.selectedDDC.score}/100</span>`}</div></div>
        <div class="summary-item"><div class="label">청구기호</div><div class="value mono">${marc.summary.call_no}</div></div>
        <div class="summary-item"><div class="label">생성된 MARC 필드 수</div><div class="value">${marc.summary.total}개 (필수 11 + 권장 ${marc.summary.total - 11})</div></div>
        <div class="summary-item"><div class="label">${isView ? '상태' : '수정된 필드'}</div><div class="value">${isView ? '정식 등록 완료' : (marc.summary.edited || 0) + '개'}</div></div>
      </div>
    </div>

    <div class="panel">
      <div class="panel-h">자동 검증 결과 <span class="meta" style="color:var(--green);">${checks.length}/${checks.length} 통과</span></div>
      ${checks.map(c => `
        <div class="check-row">
          <div class="check-icon ${c.icon === 'pass' ? 'check-pass' : 'check-info'}">${c.icon === 'pass' ? '✓' : 'i'}</div>
          <div style="flex:1;"><strong>${c.title}</strong> · <span style="color:var(--text-3)">${c.desc}</span></div>
        </div>
      `).join('')}
    </div>

    ${reviewerBlock}
    ${bottomRow}
  `;

  if (!isView) {
    document.getElementById('reviewer-commit').addEventListener('change', (e) => {
      document.getElementById('confirm-approval').disabled = !e.target.checked;
    });
    document.getElementById('export-marc').addEventListener('click', () => {
      alert('MARC 파일이 다운로드 폴더에 저장되었습니다.');
    });
    document.getElementById('confirm-approval').addEventListener('click', () => {
      handleApproval();
    });
  }
}

function handleApproval() {
  state.approval = {
    reviewer: document.getElementById('reviewer-name').value,
    time: document.getElementById('reviewer-time').value,
    memo: document.getElementById('reviewer-memo').value,
    isbn: state.selectedISBN,
  };

  const stat = document.getElementById('stat-completed');
  const rate = document.getElementById('stat-rate');
  const m = stat.textContent.match(/(\d+)\/(\d+)/);
  if (m) {
    const newDone = Number(m[1]) + 1;
    const total = Number(m[2]);
    stat.innerHTML = `${newDone}<span class="unit">/${total}</span>`;
    rate.textContent = `진행률 ${(newDone / total * 100).toFixed(1)}%`;
  }

  showToast(`등록 완료 · 대시보드 카운트가 ${m ? Number(m[1]) + 1 : '?'}/${m ? m[2] : '?'}로 갱신됨`);

  setTimeout(() => {
    state.completedSteps.clear();
    state.selectedISBN = null;
    state.bookData = null;
    state.selectedDDC = null;
    state.marcRecord = null;
    document.getElementById('isbn-input').value = '';
    document.querySelectorAll('#sample-chips .chip').forEach(c => { c.classList.remove('active'); c.classList.add('idle'); });
    document.getElementById('call-book-info').disabled = true;
    goToStep(1);
  }, 1500);
}

function showToast(msg) {
  const t = document.createElement('div');
  t.className = 'toast';
  t.textContent = `✓ ${msg}`;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 3500);
}

const _origGoToStep_s5 = goToStep;
goToStep = function(n) {
  _origGoToStep_s5(n);
  if (n === 5) renderStage5();
};

// === MODAL ===
const guideModal = document.getElementById('guide-modal');
document.getElementById('open-guide').addEventListener('click', () => guideModal.classList.add('open'));
document.getElementById('guide-close').addEventListener('click', () => guideModal.classList.remove('open'));
guideModal.addEventListener('click', (e) => { if (e.target === guideModal) guideModal.classList.remove('open'); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') guideModal.classList.remove('open'); });

// === INIT ===
renderSampleChips();
renderCompletedList();
