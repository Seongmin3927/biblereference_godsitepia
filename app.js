// Bible Reference App Frontend Logic

// Global state
let currentData = null;
let bibleBooks = [];
let bibleVersions = [];
let currentFontSize = 100; // percent

// Fallback books metadata (if /api/meta is offline or loading)
const FALLBACK_BOOKS = [
  { code: 'gen', name: '창세기', abbr: '창', testament: 'OT', chapters: 50 },
  { code: 'exo', name: '출애굽기', abbr: '출', testament: 'OT', chapters: 40 },
  { code: 'lev', name: '레위기', abbr: '레', testament: 'OT', chapters: 27 },
  { code: 'num', name: '민수기', abbr: '민', testament: 'OT', chapters: 36 },
  { code: 'deu', name: '신명기', abbr: '신', testament: 'OT', chapters: 34 },
  { code: 'jos', name: '여호수아', abbr: '수', testament: 'OT', chapters: 24 },
  { code: 'jdg', name: '사사기', abbr: '삿', testament: 'OT', chapters: 21 },
  { code: 'rut', name: '룻기', abbr: '룻', testament: 'OT', chapters: 4 },
  { code: '1sa', name: '사무엘상', abbr: '삼상', testament: 'OT', chapters: 31 },
  { code: '2sa', name: '사무엘하', abbr: '삼하', testament: 'OT', chapters: 24 },
  { code: '1ki', name: '열왕기상', abbr: '왕상', testament: 'OT', chapters: 22 },
  { code: '2ki', name: '열왕기하', abbr: '왕하', testament: 'OT', chapters: 25 },
  { code: '1ch', name: '역대상', abbr: '대상', testament: 'OT', chapters: 29 },
  { code: '2ch', name: '역대하', abbr: '대하', testament: 'OT', chapters: 36 },
  { code: 'ezr', name: '에스라', abbr: '스', testament: 'OT', chapters: 10 },
  { code: 'neh', name: '느헤미야', abbr: '느', testament: 'OT', chapters: 13 },
  { code: 'est', name: '에스더', abbr: '에', testament: 'OT', chapters: 10 },
  { code: 'job', name: '욥기', abbr: '욥', testament: 'OT', chapters: 42 },
  { code: 'psa', name: '시편', abbr: '시', testament: 'OT', chapters: 150 },
  { code: 'pro', name: '잠언', abbr: '잠', testament: 'OT', chapters: 31 },
  { code: 'ecc', name: '전도서', abbr: '전', testament: 'OT', chapters: 12 },
  { code: 'sng', name: '아가', abbr: '아', testament: 'OT', chapters: 8 },
  { code: 'isa', name: '이사야', abbr: '사', testament: 'OT', chapters: 66 },
  { code: 'jer', name: '예레미야', abbr: '렘', testament: 'OT', chapters: 52 },
  { code: 'lam', name: '예레미야애가', abbr: '애', testament: 'OT', chapters: 5 },
  { code: 'ezk', name: '에스겔', abbr: '겔', testament: 'OT', chapters: 48 },
  { code: 'dan', name: '다니엘', abbr: '단', testament: 'OT', chapters: 12 },
  { code: 'hos', name: '호세아', abbr: '호', testament: 'OT', chapters: 14 },
  { code: 'jol', name: '요엘', abbr: '욜', testament: 'OT', chapters: 3 },
  { code: 'amo', name: '아모스', abbr: '암', testament: 'OT', chapters: 9 },
  { code: 'oba', name: '오바댜', abbr: '옵', testament: 'OT', chapters: 1 },
  { code: 'jon', name: '요나', abbr: '욘', testament: 'OT', chapters: 4 },
  { code: 'mic', name: '미가', abbr: '미', testament: 'OT', chapters: 7 },
  { code: 'nam', name: '나훔', abbr: '나', testament: 'OT', chapters: 3 },
  { code: 'hab', name: '하박국', abbr: '합', testament: 'OT', chapters: 3 },
  { code: 'zep', name: '스바냐', abbr: '습', testament: 'OT', chapters: 3 },
  { code: 'hag', name: '학개', abbr: '학', testament: 'OT', chapters: 2 },
  { code: 'zec', name: '스가랴', abbr: '슥', testament: 'OT', chapters: 14 },
  { code: 'mal', name: '말라기', abbr: '말', testament: 'OT', chapters: 4 },
  // 신약 27권
  { code: 'mat', name: '마태복음', abbr: '마', testament: 'NT', chapters: 28 },
  { code: 'mrk', name: '마가복음', abbr: '막', testament: 'NT', chapters: 16 },
  { code: 'luk', name: '누가복음', abbr: '눅', testament: 'NT', chapters: 24 },
  { code: 'jhn', name: '요한복음', abbr: '요', testament: 'NT', chapters: 21 },
  { code: 'act', name: '사도행전', abbr: '행', testament: 'NT', chapters: 28 },
  { code: 'rom', name: '로마서', abbr: '롬', testament: 'NT', chapters: 16 },
  { code: '1co', name: '고린도전서', abbr: '고전', testament: 'NT', chapters: 16 },
  { code: '2co', name: '고린도후서', abbr: '고후', testament: 'NT', chapters: 13 },
  { code: 'gal', name: '갈라디아서', abbr: '갈', testament: 'NT', chapters: 6 },
  { code: 'eph', name: '에베소서', abbr: '엡', testament: 'NT', chapters: 6 },
  { code: 'php', name: '빌립보서', abbr: '빌', testament: 'NT', chapters: 4 },
  { code: 'col', name: '골로새서', abbr: '골', testament: 'NT', chapters: 4 },
  { code: '1th', name: '데살로니가전서', abbr: '살전', testament: 'NT', chapters: 5 },
  { code: '2th', name: '데살로니가후서', abbr: '살후', testament: 'NT', chapters: 3 },
  { code: '1ti', name: '디모데전서', abbr: '딤전', testament: 'NT', chapters: 6 },
  { code: '2ti', name: '디모데후서', abbr: '딤후', testament: 'NT', chapters: 4 },
  { code: 'tit', name: '디도서', abbr: '딛', testament: 'NT', chapters: 3 },
  { code: 'phm', name: '빌레몬서', abbr: '몬', testament: 'NT', chapters: 1 },
  { code: 'heb', name: '히브리서', abbr: '히', testament: 'NT', chapters: 13 },
  { code: 'jas', name: '야고보서', abbr: '약', testament: 'NT', chapters: 5 },
  { code: '1pe', name: '베드로전서', abbr: '벧전', testament: 'NT', chapters: 5 },
  { code: '2pe', name: '베드로후서', abbr: '벧후', testament: 'NT', chapters: 3 },
  { code: '1jn', name: '요한일서', abbr: '요일', testament: 'NT', chapters: 5 },
  { code: '2jn', name: '요한이서', abbr: '요이', testament: 'NT', chapters: 1 },
  { code: '3jn', name: '요한삼서', abbr: '요삼', testament: 'NT', chapters: 1 },
  { code: 'jud', name: '유다서', abbr: '유', testament: 'NT', chapters: 1 },
  { code: 'rev', name: '요한계시록', abbr: '계', testament: 'NT', chapters: 22 }
];

// DOM Elements
const queryInput = document.getElementById('queryInput');
const clearInputBtn = document.getElementById('clearInputBtn');
const textVersionSelect = document.getElementById('textVersionSelect');
const textSearchForm = document.getElementById('textSearchForm');

const testamentSelect = document.getElementById('testamentSelect');
const bookSelect = document.getElementById('bookSelect');
const chapterSelect = document.getElementById('chapterSelect');
const startVerseInput = document.getElementById('startVerseInput');
const endVerseInput = document.getElementById('endVerseInput');
const selectVersionSelect = document.getElementById('selectVersionSelect');
const selectSearchForm = document.getElementById('selectSearchForm');

const loadingView = document.getElementById('loadingView');
const errorView = document.getElementById('errorView');
const errorMessage = document.getElementById('errorMessage');
const resultCard = document.getElementById('resultCard');

const resultReference = document.getElementById('resultReference');
const resultVersionBadge = document.getElementById('resultVersionBadge');
const resultTestamentBadge = document.getElementById('resultTestamentBadge');
const versesContainer = document.getElementById('versesContainer');

const prevChapBtn = document.getElementById('prevChapBtn');
const nextChapBtn = document.getElementById('nextChapBtn');
const prevChapText = document.getElementById('prevChapText');
const nextChapText = document.getElementById('nextChapText');

const copyVersesBtn = document.getElementById('copyVersesBtn');
const shareUrlBtn = document.getElementById('shareUrlBtn');
const printBtn = document.getElementById('printBtn');
const toast = document.getElementById('toast');

const themeToggleBtn = document.getElementById('themeToggleBtn');
const themeIcon = document.getElementById('themeIcon');
const fontSizeDecBtn = document.getElementById('fontSizeDecBtn');
const fontSizeIncBtn = document.getElementById('fontSizeIncBtn');
const fontSizeDisplay = document.getElementById('fontSizeDisplay');

// Init
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initTabs();
  initFontSize();
  initQuickChips();
  initInputListeners();
  loadMetadata().then(() => {
    populateBookSelector();
    checkUrlParams();
  });
});

// Theme Management
function initTheme() {
  const savedTheme = localStorage.getItem('bible_theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  setTheme(savedTheme);

  themeToggleBtn.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
  });
}

function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
  localStorage.setItem('bible_theme', theme);
}

// Font Size Controls
function initFontSize() {
  const savedSize = localStorage.getItem('bible_font_size');
  if (savedSize) {
    currentFontSize = parseInt(savedSize, 10);
    applyFontSize();
  }

  fontSizeDecBtn.addEventListener('click', () => {
    if (currentFontSize > 75) {
      currentFontSize -= 10;
      applyFontSize();
    }
  });

  fontSizeIncBtn.addEventListener('click', () => {
    if (currentFontSize < 160) {
      currentFontSize += 10;
      applyFontSize();
    }
  });
}

function applyFontSize() {
  versesContainer.style.setProperty('--verse-font-size', `${(1.125 * (currentFontSize / 100)).toFixed(3)}rem`);
  fontSizeDisplay.textContent = `${currentFontSize}%`;
  localStorage.setItem('bible_font_size', currentFontSize);
}

// Tabs
function initTabs() {
  const tabBtns = document.querySelectorAll('.tab-btn');
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const targetPane = document.getElementById(`tab-${btn.dataset.tab}`);
      if (targetPane) targetPane.classList.add('active');
    });
  });
}

// Input listeners
function initInputListeners() {
  queryInput.addEventListener('input', () => {
    clearInputBtn.style.display = queryInput.value.trim() ? 'block' : 'none';
  });

  clearInputBtn.addEventListener('click', () => {
    queryInput.value = '';
    clearInputBtn.style.display = 'none';
    queryInput.focus();
  });

  // Sync version selects
  textVersionSelect.addEventListener('change', () => {
    selectVersionSelect.value = textVersionSelect.value;
  });
  selectVersionSelect.addEventListener('change', () => {
    textVersionSelect.value = selectVersionSelect.value;
  });

  // Selector form changes
  testamentSelect.addEventListener('change', () => {
    populateBookSelector();
  });

  bookSelect.addEventListener('change', () => {
    populateChapterSelector();
  });

  // Form submits
  textSearchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const query = queryInput.value.trim();
    if (!query) {
      showToast('성경 구절을 입력해주세요. (예: 창세기 1:1)');
      queryInput.focus();
      return;
    }
    fetchBible({ query, ver: textVersionSelect.value });
  });

  selectSearchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const vol = bookSelect.value;
    const chap = chapterSelect.value;
    const start = startVerseInput.value.trim() || undefined;
    const end = endVerseInput.value.trim() || undefined;
    const ver = selectVersionSelect.value;

    fetchBible({ vol, chap, start, end, ver });
  });

  // Nav buttons
  prevChapBtn.addEventListener('click', () => {
    if (currentData && currentData.chapter > 1) {
      fetchBible({
        vol: currentData.book.code,
        chap: currentData.chapter - 1,
        ver: currentData.version.code
      });
    }
  });

  nextChapBtn.addEventListener('click', () => {
    if (currentData && currentData.chapter < currentData.book.totalChapters) {
      fetchBible({
        vol: currentData.book.code,
        chap: currentData.chapter + 1,
        ver: currentData.version.code
      });
    }
  });

  // Action buttons
  copyVersesBtn.addEventListener('click', copyVersesToClipboard);
  shareUrlBtn.addEventListener('click', copyShareUrl);
  printBtn.addEventListener('click', () => window.print());
}

// Quick Chips
function initQuickChips() {
  const chips = document.querySelectorAll('.chip-btn');
  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      const q = chip.dataset.query;
      queryInput.value = q;
      clearInputBtn.style.display = 'block';
      // switch to text search tab
      document.querySelector('[data-tab="text-search"]').click();
      fetchBible({ query: q, ver: textVersionSelect.value });
    });
  });
}

// Load metadata
async function loadMetadata() {
  try {
    const res = await fetch('/api/meta');
    if (res.ok) {
      const data = await res.json();
      if (data.success && data.books) {
        bibleBooks = data.books;
        return;
      }
    }
  } catch (e) {
    console.warn('Using fallback bible metadata:', e);
  }
  bibleBooks = FALLBACK_BOOKS;
}

// Populate books dropdown
function populateBookSelector() {
  const testament = testamentSelect.value;
  const filtered = bibleBooks.filter(b => testament === 'ALL' || b.testament === testament);

  bookSelect.innerHTML = '';
  filtered.forEach(b => {
    const opt = document.createElement('option');
    opt.value = b.code;
    opt.textContent = `${b.name} (${b.abbr})`;
    bookSelect.appendChild(opt);
  });

  populateChapterSelector();
}

// Populate chapters dropdown
function populateChapterSelector() {
  const selectedCode = bookSelect.value;
  const book = bibleBooks.find(b => b.code === selectedCode);
  if (!book) return;

  chapterSelect.innerHTML = '';
  for (let i = 1; i <= book.chapters; i++) {
    const opt = document.createElement('option');
    opt.value = i;
    opt.textContent = `${i}장`;
    chapterSelect.appendChild(opt);
  }
}

// Check URL Params on load
function checkUrlParams() {
  const urlParams = new URLSearchParams(window.location.search);
  const q = urlParams.get('q') || urlParams.get('query');
  const ver = urlParams.get('ver') || 'gae';
  const vol = urlParams.get('vol');
  const chap = urlParams.get('chap');

  if (ver) {
    textVersionSelect.value = ver;
    selectVersionSelect.value = ver;
  }

  if (q) {
    queryInput.value = q;
    clearInputBtn.style.display = 'block';
    fetchBible({ query: q, ver });
  } else if (vol && chap) {
    const start = urlParams.get('start');
    const end = urlParams.get('end');
    fetchBible({ vol, chap, start, end, ver });
  } else {
    // Default initial query: 창세기 1:1
    queryInput.value = '창세기 1:1';
    clearInputBtn.style.display = 'block';
    fetchBible({ query: '창세기 1:1', ver: 'gae' });
  }
}

// Fetch Bible via /api/bible
async function fetchBible(params) {
  showLoading();

  try {
    const url = new URL('/api/bible', window.location.origin);
    Object.keys(params).forEach(k => {
      if (params[k] !== undefined && params[k] !== null && params[k] !== '') {
        url.searchParams.append(k, params[k]);
      }
    });

    const res = await fetch(url.toString(), {
      headers: {
        'Accept': 'application/json'
      }
    });

    const result = await res.json();

    if (!res.ok || !result.success) {
      throw new Error(result.error || '구절을 불러오는 중 오류가 발생했습니다.');
    }

    renderResult(result.data);
    updateUrl(params);

  } catch (err) {
    showError(err.message);
  }
}

// Render Result
function renderResult(data) {
  currentData = data;
  hideStatus();

  resultReference.textContent = data.reference;
  resultVersionBadge.textContent = data.version.name;
  resultTestamentBadge.textContent = data.book.testament === 'OT' ? '구약' : '신약';

  // Render verses
  versesContainer.innerHTML = '';
  data.verses.forEach(v => {
    const item = document.createElement('div');
    item.className = 'verse-item';
    item.id = `verse-${v.verse}`;

    const numSpan = document.createElement('span');
    numSpan.className = 'verse-num';
    numSpan.textContent = v.verse;

    const textSpan = document.createElement('span');
    textSpan.className = 'verse-text';
    textSpan.textContent = v.text;

    item.appendChild(numSpan);
    item.appendChild(textSpan);
    versesContainer.appendChild(item);
  });

  // Chapter navigation buttons
  const isFirst = data.chapter <= 1;
  const isLast = data.chapter >= data.book.totalChapters;

  prevChapBtn.disabled = isFirst;
  nextChapBtn.disabled = isLast;

  if (!isFirst) {
    prevChapText.textContent = `${data.chapter - 1}장`;
  } else {
    prevChapText.textContent = '처음';
  }

  if (!isLast) {
    nextChapText.textContent = `${data.chapter + 1}장`;
  } else {
    nextChapText.textContent = '마지막';
  }

  // Sync selectors
  bookSelect.value = data.book.code;
  populateChapterSelector();
  chapterSelect.value = data.chapter;
  if (data.startVerse) startVerseInput.value = data.startVerse;
  else startVerseInput.value = '';
  if (data.endVerse && data.endVerse !== data.startVerse) endVerseInput.value = data.endVerse;
  else endVerseInput.value = '';

  resultCard.style.display = 'block';
  resultCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Update Browser URL
function updateUrl(params) {
  const url = new URL(window.location);
  url.search = '';
  if (params.query) {
    url.searchParams.set('q', params.query);
  } else if (params.vol && params.chap) {
    url.searchParams.set('vol', params.vol);
    url.searchParams.set('chap', params.chap);
    if (params.start) url.searchParams.set('start', params.start);
    if (params.end) url.searchParams.set('end', params.end);
  }
  if (params.ver && params.ver !== 'gae') {
    url.searchParams.set('ver', params.ver);
  }
  window.history.pushState({}, '', url.toString());
}

// Copy to Clipboard
function copyVersesToClipboard() {
  if (!currentData || !currentData.verses.length) return;

  const lines = currentData.verses.map(v => `${v.verse} ${v.text}`);
  const formatted = `${lines.join('\n')}\n\n- ${currentData.reference} (${currentData.version.name})`;

  navigator.clipboard.writeText(formatted).then(() => {
    showToast('구절이 클립보드에 복사되었습니다! 📋');
  }).catch(() => {
    // Fallback
    const textArea = document.createElement('textarea');
    textArea.value = formatted;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
    showToast('구절이 클립보드에 복사되었습니다! 📋');
  });
}

// Share URL
function copyShareUrl() {
  navigator.clipboard.writeText(window.location.href).then(() => {
    showToast('공유 링크가 복사되었습니다! 🔗');
  }).catch(() => {
    showToast('링크 복사에 실패했습니다.');
  });
}

// Status Helpers
function showLoading() {
  loadingView.style.display = 'flex';
  errorView.style.display = 'none';
  resultCard.style.display = 'none';
}

function showError(msg) {
  loadingView.style.display = 'none';
  errorView.style.display = 'flex';
  resultCard.style.display = 'none';
  errorMessage.textContent = msg;
}

function hideStatus() {
  loadingView.style.display = 'none';
  errorView.style.display = 'none';
}

// Toast
let toastTimeout;
function showToast(msg) {
  clearTimeout(toastTimeout);
  toast.textContent = msg;
  toast.classList.add('show');
  toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 2500);
}
