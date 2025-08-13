# iCRF Export 기능 개발

## 개요

IMT v3.0의 iCRF Export 기능은 임상 데이터를 PDF 또는 ZIP 형식으로 내보내는 기능입니다. 이 기능은 임상 규제 대응 및 데이터 아카이빙에 매우 중요한 역할을 합니다.

## 주요 기능

### 1. Export 설정 UI (Drawer)
- **형식**: 오른쪽 슬라이드 Drawer
- **구성 요소**:
  - Protocol No. (비활성화된 텍스트)
  - 대상자 선택 (다중 선택 드롭다운)
  - 방문일 선택 (다중 선택 드롭다운)
  - Form 포함 여부 (토글 스위치)
  - Audit Trail 포함 여부 (체크박스)
  - 파일형식 (라디오 버튼)
  - 익명화 옵션 (체크박스)

### 2. 역할 기반 권한 제어
- **Builder/DM**: 모든 Subject export 가능
- **Reviewer**: 본인 관련 데이터만 제한적으로 조회 가능
- **관리자**: 익명화 옵션 접근 가능

### 3. Export 이력 관리
- 최근 내보내기 목록 확인
- 다운로드 이력 로그
- 상세 정보 조회
- 파일 삭제 기능

## 파일 구조

```
export_icrf_dev/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── ExportDrawer.js      # 메인 Export 설정 UI
│   │   ├── ExportHistory.js     # Export 이력 관리
│   │   └── AccessControl.js     # 권한 제어 컴포넌트
│   ├── App.js                   # 메인 앱 컴포넌트
│   ├── App.css                  # 앱 스타일
│   ├── index.js                 # 앱 진입점
│   └── index.css                # 기본 스타일
├── package.json
└── README.md
```

## 설치 및 실행

### 1. 의존성 설치
```bash
npm install
```

### 2. 개발 서버 실행
```bash
npm start
```

### 3. 빌드
```bash
npm run build
```

## 사용법

### Export 설정
1. 상단 네비게이션 바의 "Export 설정" 버튼 클릭
2. 오른쪽에서 슬라이드되는 Drawer에서 설정
3. 대상자, 방문일, Form 포함 여부 등 선택
4. "EXPORT" 버튼 클릭하여 실행

### Export 이력 확인
1. "내보내기 이력" 버튼 클릭
2. 이전 Export 목록 확인
3. 상세 정보 조회 및 다운로드

## Output 예시

### 파일명 규칙
```
[Protocol]_[Participant]_[VisitName]_AnnotatedICRF_[YYYYMMDD].pdf
예: P0012_S001_BL_AnnotatedICRF_20250730.pdf
```

### 포함 항목
- iCRF Form (Blank + 입력된 데이터)
- Reviewer 평가값
- Adjudicator 최종 평가
- DTF (Demographic and Treatment Form)
- Audit Trail (선택 시)

## 기술 스택

- **React 18.2.0**: 사용자 인터페이스
- **Material-UI 5.14.0**: UI 컴포넌트 라이브러리
- **Emotion**: CSS-in-JS 스타일링

## 개발 고려사항

### UX 고려사항
1. **비동기 처리**: 대용량 데이터 처리 시 서버 대기 시간 고려
2. **이메일 알림**: Export 완료 시 이메일 발송
3. **진행률 표시**: Export 진행 상황 시각화

### 보안 고려사항
1. **접근 권한**: 역할 기반 접근 제어
2. **데이터 익명화**: Reviewer 정보 익명화 옵션
3. **감사 로그**: 모든 Export 작업 로그 기록

## 향후 확장 계획

- Audit Trail Summary 통합
- Excel 기반 Reporting 기능
- 배치 Export 기능
- 실시간 진행률 모니터링

## 라이선스

ISC License 