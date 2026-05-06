window.DDC_CANDIDATES = {
  "9788936434120": {
    recommended: {
      ddc: "811.36", name: "한국 문학 / 소설 (현대)", score: 94,
      meta: "SKKU 소장 4,822권 · 대표 출판사: 창비, 문학동네, 민음사",
      reasoning: { matched_keys: ['genre', 'language', 'target_audience', 'tone_and_style'], explanation: '책 지문의 [장르: 한국 현대소설] [언어: kor] [독자층: 현대문학 독자] [문체: 시적 산문] 가 DDC 811.36 항목의 대표 주제(현대소설, 사랑, 성장)와 직접 일치. 출판사 "창비"도 이 분류 상위 출판사.' }
    },
    alternatives: [
      { ddc: "895.7", name: "한국 문학 (전체 / 단행본)", score: 81, note: "한국 문학 일반 분류. 시·소설·희곡 미분화 시 사용" },
      { ddc: "951.95", name: "한국 현대사 (1945~)", score: 62, note: "5·18 광주민주화운동을 사료/연구서로 다룰 때" }
    ]
  },
  "9791191114225": {
    recommended: {
      ddc: "811.36", name: "한국 문학 / 소설 (현대)", score: 91,
      meta: "SKKU 소장 4,822권 · 대표 출판사: 창비, 문학동네, 민음사",
      reasoning: { matched_keys: ['genre', 'language', 'target_audience'], explanation: '[장르: 한국 SF, 한국 근미래 소설] [언어: kor] — 한국 작가의 한국어 창작 소설. 같은 DDC지만 fingerprint 차이로 주제명(650)은 SF·AI 윤리 쪽으로 매칭됨.' }
    },
    alternatives: [
      { ddc: "813.087", name: "영문학 / 과학 소설(SF)", score: 76, note: "원작이 영문일 경우. 한국 SF는 통상 811.36 또는 895.7" },
      { ddc: "006.3", name: "인공지능 일반", score: 58, note: "AI 비평·기술 서적으로 분류 시" }
    ]
  },
  "9788934992059": {
    recommended: {
      ddc: "909", name: "세계사 / 거시사", score: 89,
      meta: "SKKU 소장 312권 · 빅 히스토리, 인류문명사 일반",
      reasoning: { matched_keys: ['genre', 'concept', 'event'], explanation: '[장르: 빅 히스토리, 세계사] [개념: 인지혁명, 농업혁명, 과학혁명] [사건: 인류 진화 단계] — 909 거시사 분류와 직접 부합. 서지: 번역서(원어 eng).' }
    },
    alternatives: [
      { ddc: "599.938", name: "인류학 / 호모 사피엔스", score: 73, note: "생물학적 인류 진화 중심으로 분류 시" },
      { ddc: "304.2", name: "인간 생태학 / 사회와 환경", score: 64, note: "환경·사회와 인간의 상호작용 관점" }
    ]
  },
  "9791190030540": {
    recommended: {
      ddc: "502", name: "과학 일반 / 잡학·교양과학", score: 88,
      meta: "SKKU 소장 287권 · 대중과학서, 과학 에세이",
      reasoning: { matched_keys: ['genre', 'target_audience', 'tone_and_style'], explanation: '[장르: 대중과학서, 복잡계 입문, 에세이] [독자층: 일반 독자, 고등학생 이상] [문체: 친근한 강의체, 사례 중심, 유머] — 502 잡학과학·교양과학 분류와 직접 부합.' }
    },
    alternatives: [
      { ddc: "530", name: "물리학 일반", score: 71, note: "복잡계를 물리학으로 분류 시" },
      { ddc: "519.5", name: "통계 / 확률", score: 59, note: "통계물리·머피의 법칙 비중이 클 때" }
    ]
  },
  "9791157848676": {
    recommended: {
      ddc: "006.3", name: "인공지능 일반", score: 92,
      meta: "SKKU 소장 1,124권 · AI/ML 입문서, 산업·정책 도서",
      reasoning: { matched_keys: ['concept', 'genre', 'target_audience'], explanation: '[개념: 생성형 AI, AI 거버넌스, AI 기본사회] [장르: 기술 시사서, AI 입문서] [독자층: IT 종사자, 정책 결정자] — 006.3 인공지능 일반 분류와 직접 부합.' }
    },
    alternatives: [
      { ddc: "005.133", name: "프로그래밍 / 응용", score: 67, note: "기술 구현 비중이 클 때" },
      { ddc: "303.483", name: "기술과 사회 변화", score: 64, note: "AI의 사회적 영향 중심 분류" }
    ]
  }
};
