# HTML to PDF 변환기

Playwright 라이브러리를 사용하여 HTML을 고품질 PDF로 변환하는 웹 애플리케이션입니다.

## 🚀 주요 기능

- HTML 코드를 PDF로 변환
- 다양한 용지 크기 지원 (A4, A3, Letter, Legal)
- 세로/가로 방향 설정
- 여백 조정
- 배경 포함/제외 옵션
- 실시간 변환 진행률 표시
- 생성된 PDF 파일 다운로드

## 📋 요구사항

- Node.js 16.0 이상
- npm 또는 yarn

## 🛠️ 설치 및 실행

### 1. 의존성 설치
```bash
npm install
```

### 2. Playwright 브라우저 설치
```bash
npx playwright install chromium
```

### 3. 서버 실행
```bash
npm start
```

또는 개발 모드로 실행:
```bash
npm run dev
```

### 4. 브라우저에서 접속
```
http://localhost:3000
```

## 📖 사용법

1. 웹 인터페이스에 접속
2. HTML 코드를 텍스트 영역에 입력
3. PDF 옵션 설정 (용지 크기, 방향, 여백, 배경 등)
4. "PDF 변환하기" 버튼 클릭
5. 변환 완료 후 PDF 파일 다운로드

## 🔧 API 엔드포인트

### HTML을 PDF로 변환
```
POST /convert
Content-Type: application/json

{
  "html": "<h1>Hello World</h1>",
  "options": {
    "format": "A4",
    "printBackground": true,
    "margin": {
      "top": "1cm",
      "right": "1cm",
      "bottom": "1cm",
      "left": "1cm"
    }
  }
}
```

### PDF 파일 다운로드
```
GET /download/:filename
```

### 생성된 파일 목록 조회
```
GET /files
```

## 📁 프로젝트 구조

```
html-to-pdf-converter/
├── index.js              # 메인 서버 파일
├── package.json          # 프로젝트 설정
├── public/               # 정적 파일
│   └── index.html       # 웹 인터페이스
├── pdfs/                 # 생성된 PDF 파일 저장소
└── README.md            # 프로젝트 문서
```

## ⚙️ PDF 옵션

- **format**: 용지 크기 (A4, A3, Letter, Legal)
- **orientation**: 방향 (portrait, landscape)
- **margin**: 여백 설정
- **printBackground**: 배경 포함 여부

## 🐛 문제 해결

### Playwright 브라우저 오류
```bash
npx playwright install chromium
```

### 포트 충돌
환경 변수로 포트 변경:
```bash
PORT=3001 npm start
```

## 📝 라이선스

MIT License

## 🤝 기여

이슈나 풀 리퀘스트를 통해 기여해주세요!
