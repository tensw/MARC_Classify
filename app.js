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
  console.log('도서정보 호출:', state.selectedISBN);
});

// === INIT ===
renderSampleChips();
