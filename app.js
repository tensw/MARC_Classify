// === STATE ===
const state = {
  currentStep: 1,
  completedSteps: new Set(),
  selectedISBN: null,
  bookData: null,
  selectedDDC: null,
  marcRecord: null,
  approval: null,
};

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
    if (state.completedSteps.has(step) || step === state.currentStep) goToStep(step);
  });
});

// === STAGE 1: ISBN 입력 + 칩 ===
function renderSampleChips() {
  const container = document.getElementById('sample-chips');
  container.innerHTML = SAMPLE_BOOKS.map(b => `
    <span class="chip idle" data-isbn="${b.isbn}">${b.emoji} ${b.title} · ${b.author}</span>
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
  completeStep(1);
});

// === STAGE 1: 완료 리스트 (목업 데이터) ===
const COMPLETED_MARC_MOCK = [
  { emoji: "📘", title: "지능의 탄생", author: "이대열", isbn: "9788932039459", ddc: "573.86", time: "14:22", reviewer: "김OO" },
  { emoji: "📕", title: "한국 근현대사", author: "강만길", isbn: "9788958624028", ddc: "951.95", time: "14:18", reviewer: "김OO" },
  { emoji: "📗", title: "딥러닝 입문", author: "김기현", isbn: "9791160505795", ddc: "006.31", time: "14:05", reviewer: "이OO" },
  { emoji: "📙", title: "The Pragmatic Programmer", author: "Hunt, A.", isbn: "9780135957059", ddc: "005.1", time: "13:52", reviewer: "이OO" },
  { emoji: "📔", title: "여행의 이유", author: "김영하", isbn: "9788954655729", ddc: "811.37", time: "13:40", reviewer: "박OO" },
  { emoji: "📖", title: "채식주의자", author: "한강", isbn: "9788936433598", ddc: "811.36", time: "13:30", reviewer: "박OO" },
  { emoji: "📓", title: "코스모스", author: "Sagan, Carl (홍승수 옮김)", isbn: "9788983711892", ddc: "520", time: "13:15", reviewer: "김OO" },
];

function renderCompletedList() {
  const tbody = document.getElementById('completed-list-body');
  tbody.innerHTML = COMPLETED_MARC_MOCK.map(b => `
    <tr>
      <td>${b.emoji}</td>
      <td><strong>${b.title}</strong> / <span style="color:var(--text-3)">${b.author}</span></td>
      <td class="mono" style="font-size:11px;">${b.isbn}</td>
      <td><span class="ddc-mono">${b.ddc}</span></td>
      <td style="font-size:11px;color:var(--text-3);">${b.time}</td>
      <td>${b.reviewer}</td>
      <td><span class="badge badge-done">승인</span></td>
      <td style="text-align:right;"><a class="link">상세 →</a></td>
    </tr>
  `).join('');
  tbody.querySelectorAll('.link').forEach(link => {
    link.addEventListener('click', () => alert('[상세 보기 화면 준비 중]'));
  });
  document.getElementById('show-all-completed').addEventListener('click', () => alert('[전체 목록 화면 준비 중]'));
}

// === STAGE 2 ===
function renderStage2() {
  if (!state.bookData) return;
  const b = state.bookData.biblio;
  const meta = SAMPLE_BOOKS.find(s => s.isbn === state.selectedISBN);
  document.getElementById('stage-2-content').innerHTML = `
    <div class="book-head">
      <img src="${meta.cover}" alt="${b.title} 표지">
      <div class="info">
        <h2>${b.title}</h2>
        <div class="meta-line">${b.author} (지음) · ${b.publisher} · ${b.year} · ISBN ${state.selectedISBN}</div>
      </div>
      <button class="btn btn-ghost" id="expand-fingerprint">✏️ 모두 펼쳐서 편집</button>
    </div>

    <div class="panel">
      <div class="panel-body">
        <div class="section-h-mini">📚 서지 기본 정보 <span class="meta">국립중앙도서관 API 호출 결과</span></div>
        <div class="kv-row"><div class="k">제목</div><div class="v">${b.title}</div></div>
        <div class="kv-row"><div class="k">저자</div><div class="v">${b.author}</div></div>
        <div class="kv-row"><div class="k">출판사</div><div class="v">${b.publisher} (${b.publisher_place})</div></div>
        <div class="kv-row"><div class="k">발행년</div><div class="v">${b.year}</div></div>
        <div class="kv-row"><div class="k">페이지·크기</div><div class="v">${b.pages} ; ${b.size}</div></div>
        <div class="kv-row"><div class="k">언어</div><div class="v">${b.language}</div></div>
        <div class="kv-row"><div class="k">원서명/원저자</div><div class="v ${b.original_title ? '' : 'muted'}">${b.original_title ? `${b.original_title} / ${b.original_author}` : '— (원작 없음)'}</div></div>
        ${b.edition ? `<div class="kv-row"><div class="k">판차</div><div class="v">${b.edition}</div></div>` : ''}
      </div>
    </div>

    <div id="fingerprint-card-host"></div>
  `;
  renderFingerprintCard();
  document.getElementById('expand-fingerprint').addEventListener('click', () => {
    fingerprintExpanded = !fingerprintExpanded;
    document.getElementById('expand-fingerprint').textContent = fingerprintExpanded ? '⬆ 핵심만 보기' : '✏️ 모두 펼쳐서 편집';
    renderFingerprintCard();
  });
}

const _origGoToStep_s2 = goToStep;
goToStep = function(n) {
  _origGoToStep_s2(n);
  if (n === 2) renderStage2();
};

// === INIT ===
renderSampleChips();
renderCompletedList();
