# 🚀 React 프로젝트 빠른 생성 가이드

## 방법 1: PowerShell 스크립트 사용 (권장)

### 기본 React 프로젝트 생성
```powershell
.\create-react-project.ps1 -ProjectName "my-new-project"
```

### Vite + React 프로젝트 생성 (더 빠름)
```powershell
.\create-react-project.ps1 -ProjectName "my-new-project" -UseVite
```

### TypeScript 프로젝트 생성
```powershell
.\create-react-project.ps1 -ProjectName "my-new-project" -TypeScript
```

### Vite + TypeScript 프로젝트 생성
```powershell
.\create-react-project.ps1 -ProjectName "my-new-project" -UseVite -TypeScript
```

## 방법 2: 직접 명령어 사용

### Create React App (기본)
```bash
npx create-react-app my-new-project
cd my-new-project
npm start
```

### Vite (더 빠른 빌드)
```bash
npm create vite@latest my-new-project -- --template react
cd my-new-project
npm install
npm run dev
```

### TypeScript 버전
```bash
# CRA + TypeScript
npx create-react-app my-new-project --template typescript

# Vite + TypeScript
npm create vite@latest my-new-project -- --template react-ts
```

## 방법 3: 기존 프로젝트 복사

### 1. update_history 구조 복사
```powershell
# update_history 폴더를 새 프로젝트로 복사
Copy-Item -Path "update_history" -Destination "new-project-name" -Recurse

# 새 폴더로 이동
cd new-project-name

# package.json의 name 변경
# (수동으로 package.json 편집 필요)
```

### 2. 필요한 파일만 복사
```powershell
# src 폴더만 복사
Copy-Item -Path "update_history/src" -Destination "new-project-name/src" -Recurse
Copy-Item -Path "update_history/public" -Destination "new-project-name/public" -Recurse
Copy-Item -Path "update_history/package.json" -Destination "new-project-name/package.json"
```

## 🎯 권장사항

### 새로운 프로젝트의 경우
- **Vite 사용 권장**: 더 빠른 빌드와 개발 서버
- **TypeScript 고려**: 타입 안정성과 개발 경험 향상

### 기존 구조 재사용의 경우
- **update_history 구조 복사**: 이미 검증된 구조 활용
- **필요한 부분만 수정**: 데이터와 스타일만 변경

## 📁 프로젝트 구조 예시

```
my-new-project/
├── public/
│   └── index.html
├── src/
│   ├── App.js
│   ├── App.css
│   └── index.js
├── package.json
└── README.md
```

## ⚡ 개발 서버 시작

```bash
# Create React App
npm start

# Vite
npm run dev
```

## 🔧 추가 설정

### ESLint 설정
```bash
npm install --save-dev eslint
```

### Prettier 설정
```bash
npm install --save-dev prettier
```

### Material-UI 추가
```bash
npm install @mui/material @emotion/react @emotion/styled
```

### React Router 추가
```bash
npm install react-router-dom
``` 