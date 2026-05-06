const COLLAPSED_FIELDS = [
  { tag: "003", ind1: "", ind2: "", value: "211032", name: "제어번호 식별기호", essential: false },
  { tag: "005", ind1: "", ind2: "", value: "20260506142500.0", name: "최종 처리 일시", essential: true },
  { tag: "007", ind1: "", ind2: "", value: "ta", name: "물리적 기술", essential: false },
  { tag: "040", ind1: "", ind2: "", value: "▾a 211032 ▾c 211032", name: "목록작성기관", essential: false },
];

window.MARC_RECORDS = {
  "9788936434120": {
    summary: { ddc: "811.36", call_no: "811.36 한14ㅅ 2014", visible_count: 14, total: 18, edited: 1 },
    visible: [
      { tag: "001", ind1: "", ind2: "", value: "SKKU2026050601", name: "제어번호", essential: true },
      { tag: "008", ind1: "", ind2: "", value: "260506s2014    ulk           000 1 kor d", name: "부호화 정보", essential: true },
      { tag: "020", ind1: "_", ind2: "_", value: "▾a 9788936434120", name: "ISBN", essential: true },
      { tag: "041", ind1: "0", ind2: "_", value: "▾a kor", name: "언어", essential: true },
      { tag: "082", ind1: "0", ind2: "4", value: "▾a 811.36 ▾2 23", name: "DDC", essential: true },
      { tag: "090", ind1: "", ind2: "", value: "▾a 811.36 ▾b 한14ㅅ ▾c 2014", name: "청구기호", essential: true },
      { tag: "100", ind1: "0", ind2: "_", value: "▾a 한강", name: "저자", essential: true },
      { tag: "245", ind1: "1", ind2: "0", value: "▾a 소년이 온다 / ▾d 한강 지음", name: "서명", essential: true },
      { tag: "260", ind1: "_", ind2: "_", value: "▾a 파주 : ▾b 창비, ▾c 2014.", name: "발행", essential: true },
      { tag: "300", ind1: "_", ind2: "_", value: "▾a 216 p. ; ▾c 19 cm", name: "형태", essential: true },
      { tag: "520", ind1: "_", ind2: "_", value: "▾a 1980년 5월 광주, 죽은 소년의 영혼과 살아남은 자들의 시선으로 국가폭력의 상흔을 기록한 장편소설.", name: "요약", essential: false, edited: true },
      { tag: "586", ind1: "_", ind2: "_", value: "▾a 제22회 만해문학상 수상작 (2014)", name: "수상", essential: false },
      { tag: "650", ind1: "_", ind2: "8", value: "▾a 광주 민주화 운동(1980)", name: "주제명", essential: false },
      { tag: "651", ind1: "_", ind2: "8", value: "▾a 광주광역시", name: "지명", essential: false },
    ],
    collapsed: COLLAPSED_FIELDS,
    is_translation: false
  },

  "9791191114225": {
    summary: { ddc: "811.36", call_no: "811.36 김63ㅈ 2022", visible_count: 13, total: 17, edited: 0 },
    visible: [
      { tag: "001", ind1: "", ind2: "", value: "SKKU2026050602", name: "제어번호", essential: true },
      { tag: "008", ind1: "", ind2: "", value: "260506s2022    ulk           000 1 kor d", name: "부호화 정보", essential: true },
      { tag: "020", ind1: "_", ind2: "_", value: "▾a 9791191114225", name: "ISBN", essential: true },
      { tag: "041", ind1: "0", ind2: "_", value: "▾a kor", name: "언어", essential: true },
      { tag: "082", ind1: "0", ind2: "4", value: "▾a 811.36 ▾2 23", name: "DDC", essential: true },
      { tag: "090", ind1: "", ind2: "", value: "▾a 811.36 ▾b 김63ㅈ ▾c 2022", name: "청구기호", essential: true },
      { tag: "100", ind1: "0", ind2: "_", value: "▾a 김영하", name: "저자", essential: true },
      { tag: "245", ind1: "1", ind2: "0", value: "▾a 작별인사 / ▾d 김영하 지음", name: "서명", essential: true },
      { tag: "260", ind1: "_", ind2: "_", value: "▾a 서울 : ▾b 복복서가, ▾c 2022.", name: "발행", essential: true },
      { tag: "300", ind1: "_", ind2: "_", value: "▾a 300 p. ; ▾c 19 cm", name: "형태", essential: true },
      { tag: "520", ind1: "_", ind2: "_", value: "▾a 휴머노이드와 인간의 경계가 흐려진 근미래, 정체를 모르고 살아온 소년의 여정.", name: "요약", essential: false },
      { tag: "650", ind1: "_", ind2: "8", value: "▾a 휴머노이드", name: "주제명", essential: false },
      { tag: "650", ind1: "_", ind2: "8", value: "▾a 인공 지능 -- 윤리적 측면", name: "주제명", essential: false },
    ],
    collapsed: COLLAPSED_FIELDS,
    is_translation: false
  },

  "9788934992059": {
    summary: { ddc: "909", call_no: "909 H266sㄱ 2023", visible_count: 17, total: 21, edited: 0 },
    visible: [
      { tag: "001", ind1: "", ind2: "", value: "SKKU2026050603", name: "제어번호", essential: true },
      { tag: "008", ind1: "", ind2: "", value: "260506s2023    ulk           000 0 kor d", name: "부호화 정보", essential: true },
      { tag: "020", ind1: "_", ind2: "_", value: "▾a 9788934992059", name: "ISBN", essential: true },
      { tag: "041", ind1: "1", ind2: "_", value: "▾a kor ▾h eng", name: "언어 (번역서)", essential: true },
      { tag: "082", ind1: "0", ind2: "4", value: "▾a 909 ▾2 23", name: "DDC", essential: true },
      { tag: "090", ind1: "", ind2: "", value: "▾a 909 ▾b H266sㄱ ▾c 2023", name: "청구기호", essential: true },
      { tag: "100", ind1: "1", ind2: "_", value: "▾a Harari, Yuval Noah, ▾d 1976-", name: "원저자", essential: true },
      { tag: "245", ind1: "1", ind2: "0", value: "▾a 사피엔스 / ▾d Yuval Noah Harari 지음 ; ▾e 조현욱 옮김", name: "서명", essential: true },
      { tag: "246", ind1: "1", ind2: "9", value: "▾a Sapiens : a brief history of humankind", name: "원서명", essential: false },
      { tag: "250", ind1: "", ind2: "", value: "▾a 큰글자책", name: "판차", essential: false },
      { tag: "260", ind1: "_", ind2: "_", value: "▾a 파주 : ▾b 김영사, ▾c 2023.", name: "발행", essential: true },
      { tag: "300", ind1: "_", ind2: "_", value: "▾a 636 p. : ▾b 삽화 ; ▾c 23 cm", name: "형태", essential: true },
      { tag: "504", ind1: "_", ind2: "_", value: "▾a 참고문헌 및 색인 수록", name: "서지주기", essential: false },
      { tag: "520", ind1: "_", ind2: "_", value: "▾a 수렵채집 시대부터 21세기까지 호모 사피엔스의 인지·농업·과학혁명을 통합적으로 조망.", name: "요약", essential: false },
      { tag: "650", ind1: "_", ind2: "0", value: "▾a Civilization, Modern", name: "주제명 LCSH", essential: false },
      { tag: "700", ind1: "1", ind2: "_", value: "▾a 조현욱, ▾e translator", name: "역자", essential: false },
      { tag: "900", ind1: "", ind2: "", value: "▾a 유발 노아 하라리", name: "한글표기", essential: false },
    ],
    collapsed: COLLAPSED_FIELDS,
    is_translation: true
  },

  "9791190030540": {
    summary: { ddc: "502", call_no: "502 정72ㄱ 2020", visible_count: 14, total: 18, edited: 0 },
    visible: [
      { tag: "001", ind1: "", ind2: "", value: "SKKU2026050604", name: "제어번호", essential: true },
      { tag: "008", ind1: "", ind2: "", value: "260506s2020    ulk           000 0 kor d", name: "부호화 정보", essential: true },
      { tag: "020", ind1: "_", ind2: "_", value: "▾a 9791190030540", name: "ISBN", essential: true },
      { tag: "041", ind1: "0", ind2: "_", value: "▾a kor", name: "언어", essential: true },
      { tag: "082", ind1: "0", ind2: "4", value: "▾a 502 ▾2 23", name: "DDC", essential: true },
      { tag: "090", ind1: "", ind2: "", value: "▾a 502 ▾b 정72ㄱ ▾c 2020", name: "청구기호", essential: true },
      { tag: "100", ind1: "0", ind2: "_", value: "▾a 정재승", name: "저자", essential: true },
      { tag: "245", ind1: "1", ind2: "0", value: "▾a 정재승의 과학 콘서트 / ▾d 정재승 지음", name: "서명", essential: true },
      { tag: "250", ind1: "", ind2: "", value: "▾a 개정증보 2판", name: "판차", essential: false },
      { tag: "260", ind1: "_", ind2: "_", value: "▾a 서울 : ▾b 어크로스, ▾c 2020.", name: "발행", essential: true },
      { tag: "300", ind1: "_", ind2: "_", value: "▾a 352 p. : ▾b 삽화 ; ▾c 21 cm", name: "형태", essential: true },
      { tag: "505", ind1: "0", ind2: "_", value: "▾a 머피의 법칙 -- 백화점의 미로 -- 김치찌개의 비밀 -- ...", name: "내용주기", essential: false },
      { tag: "520", ind1: "_", ind2: "_", value: "▾a 복잡계 과학을 일상의 사례로 풀어낸 정재승의 대표 대중과학서 개정증보 2판.", name: "요약", essential: false },
      { tag: "650", ind1: "_", ind2: "8", value: "▾a 복잡계 과학", name: "주제명", essential: false },
    ],
    collapsed: COLLAPSED_FIELDS,
    is_translation: false
  },

  "9791157848676": {
    summary: { ddc: "006.3", call_no: "006.3 박883ㅂ 2025", visible_count: 13, total: 17, edited: 0 },
    visible: [
      { tag: "001", ind1: "", ind2: "", value: "SKKU2026050605", name: "제어번호", essential: true },
      { tag: "008", ind1: "", ind2: "", value: "260506s2025    ulk           000 0 kor d", name: "부호화 정보", essential: true },
      { tag: "020", ind1: "_", ind2: "_", value: "▾a 9791157848676", name: "ISBN", essential: true },
      { tag: "041", ind1: "0", ind2: "_", value: "▾a kor", name: "언어", essential: true },
      { tag: "082", ind1: "0", ind2: "4", value: "▾a 006.3 ▾2 23", name: "DDC", essential: true },
      { tag: "090", ind1: "", ind2: "", value: "▾a 006.3 ▾b 박883ㅂ ▾c 2025", name: "청구기호", essential: true },
      { tag: "100", ind1: "0", ind2: "_", value: "▾a 박태웅", name: "저자", essential: true },
      { tag: "245", ind1: "1", ind2: "0", value: "▾a 박태웅의 AI 강의 2026 / ▾d 박태웅 지음", name: "서명", essential: true },
      { tag: "260", ind1: "_", ind2: "_", value: "▾a 서울 : ▾b 한빛비즈, ▾c 2025.", name: "발행", essential: true },
      { tag: "300", ind1: "_", ind2: "_", value: "▾a 316 p. ; ▾c 21 cm", name: "형태", essential: true },
      { tag: "504", ind1: "_", ind2: "_", value: "▾a 참고문헌 수록", name: "서지주기", essential: false },
      { tag: "520", ind1: "_", ind2: "_", value: "▾a AI 진화의 가속, AI 기본사회와 일자리의 미래까지 — 박태웅이 짚는 2026 AI 지형도.", name: "요약", essential: false },
      { tag: "650", ind1: "_", ind2: "8", value: "▾a 인공 지능", name: "주제명", essential: false },
    ],
    collapsed: COLLAPSED_FIELDS,
    is_translation: false
  }
};
