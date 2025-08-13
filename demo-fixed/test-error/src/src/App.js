import React, { useState, useMemo } from 'react';
import './App.css';

// 샘플 업데이트 데이터
const updateHistory = [
  {
    id: 1,
    version: 'v3.2.1',
    date: '2024-01-15',
    title: '성능 최적화 및 버그 수정',
    type: 'improvement',
    description: '전체적인 성능이 향상되었으며, 주요 버그들이 수정되었습니다.',
    details: [
      '데이터 로딩 속도 30% 향상',
      '메모리 사용량 최적화',
      '사용자 인터페이스 개선',
      '보안 취약점 패치'
    ],
    changes: [
      { type: 'fix', text: '데이터 저장 시 발생하던 오류 수정' },
      { type: 'feature', text: '새로운 필터링 옵션 추가' },
      { type: 'improvement', text: '반응형 디자인 개선' }
    ]
  },
  {
    id: 2,
    version: 'v3.2.0',
    date: '2024-01-10',
    title: '새로운 기능 추가',
    type: 'feature',
    description: '사용자 요청에 따라 새로운 기능들이 추가되었습니다.',
    details: [
      '실시간 알림 시스템 도입',
      '데이터 내보내기 기능 강화',
      '사용자 권한 관리 개선',
      '다국어 지원 확대'
    ],
    changes: [
      { type: 'feature', text: '실시간 알림 시스템 구현' },
      { type: 'feature', text: 'Excel 내보내기 기능 추가' },
      { type: 'improvement', text: '사용자 인터페이스 개선' }
    ]
  },
  {
    id: 3,
    version: 'v3.1.5',
    date: '2024-01-05',
    title: '보안 업데이트',
    type: 'security',
    description: '보안 관련 중요한 업데이트가 적용되었습니다.',
    details: [
      '인증 시스템 강화',
      '데이터 암호화 개선',
      '세션 관리 보안 강화',
      '접근 제어 정책 업데이트'
    ],
    changes: [
      { type: 'security', text: 'JWT 토큰 보안 강화' },
      { type: 'security', text: 'SQL 인젝션 방지 개선' },
      { type: 'fix', text: '로그인 세션 관리 버그 수정' }
    ]
  },
  {
    id: 4,
    version: 'v3.1.0',
    date: '2023-12-20',
    title: '대규모 업데이트',
    type: 'major',
    description: '시스템 전체적인 개편이 이루어졌습니다.',
    details: [
      '새로운 데이터베이스 구조 도입',
      'API 엔드포인트 재설계',
      '사용자 인터페이스 완전 개편',
      '성능 모니터링 시스템 도입'
    ],
    changes: [
      { type: 'major', text: '데이터베이스 구조 완전 재설계' },
      { type: 'major', text: 'API v2.0으로 업그레이드' },
      { type: 'feature', text: '실시간 모니터링 대시보드 추가' }
    ]
  },
  {
    id: 5,
    version: 'v3.0.5',
    date: '2023-12-10',
    title: '사용자 인터페이스 개선',
    type: 'improvement',
    description: '사용자 경험을 향상시키기 위한 인터페이스 개선이 이루어졌습니다.',
    details: [
      '다크 모드 지원 추가',
      '키보드 단축키 기능',
      '접근성 개선',
      '로딩 애니메이션 추가'
    ],
    changes: [
      { type: 'improvement', text: '다크 모드 테마 추가' },
      { type: 'feature', text: '키보드 단축키 시스템 구현' },
      { type: 'improvement', text: '접근성 가이드라인 준수' }
    ]
  },
  {
    id: 6,
    version: 'v3.0.0',
    date: '2023-11-25',
    title: 'IMT v3.0 정식 출시',
    type: 'major',
    description: 'IMT 시스템의 완전히 새로운 버전이 출시되었습니다.',
    details: [
      '완전히 새로운 아키텍처',
      '클라우드 네이티브 지원',
      '마이크로서비스 구조',
      '실시간 협업 기능'
    ],
    changes: [
      { type: 'major', text: '새로운 아키텍처 도입' },
      { type: 'feature', text: '클라우드 배포 지원' },
      { type: 'feature', text: '실시간 협업 시스템' }
    ]
  }
];

function App() {
  const [selectedUpdate, setSelectedUpdate] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedYear, setSelectedYear] = useState('all');

  const handleUpdateClick = (update) => {
    setSelectedUpdate(update);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedUpdate(null);
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'feature':
        return '🆕';
      case 'improvement':
        return '⚡';
      case 'security':
        return '🔒';
      case 'major':
        return '🚀';
      default:
        return 'ℹ️';
    }
  };

  const getTypeClass = (type) => {
    switch (type) {
      case 'feature':
        return 'type-feature';
      case 'improvement':
        return 'type-improvement';
      case 'security':
        return 'type-security';
      case 'major':
        return 'type-major';
      default:
        return 'type-default';
    }
  };

  const getChangeTypeClass = (type) => {
    switch (type) {
      case 'feature':
        return 'change-feature';
      case 'fix':
        return 'change-fix';
      case 'improvement':
        return 'change-improvement';
      case 'security':
        return 'change-security';
      case 'major':
        return 'change-major';
      default:
        return 'change-default';
    }
  };

  // 고유한 타입과 연도 목록 생성
  const uniqueTypes = useMemo(() => {
    const types = [...new Set(updateHistory.map(update => update.type))];
    return types;
  }, []);

  const uniqueYears = useMemo(() => {
    const years = [...new Set(updateHistory.map(update => update.date.split('-')[0]))];
    return years.sort((a, b) => b - a); // 최신 연도부터 정렬
  }, []);

  // 필터링된 업데이트 목록
  const filteredUpdates = useMemo(() => {
    return updateHistory.filter(update => {
      const matchesSearch = searchTerm === '' || 
        update.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        update.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        update.details.some(detail => detail.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesType = selectedType === 'all' || update.type === selectedType;
      const matchesYear = selectedYear === 'all' || update.date.startsWith(selectedYear);
      
      return matchesSearch && matchesType && matchesYear;
    });
  }, [searchTerm, selectedType, selectedYear]);

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedType('all');
    setSelectedYear('all');
  };

  return (
    <div className="App">
      <header className="app-header">
        <div className="header-content">
          <span className="header-icon">📋</span>
          <h1>IMT v3.0 업데이트 히스토리</h1>
        </div>
      </header>

      <main className="main-content">
        <div className="container">
          <h2 className="page-title">업데이트 내역</h2>
          
          <p className="page-description">
            IMT v3.0의 모든 업데이트 내역을 확인할 수 있습니다. 각 업데이트를 클릭하여 자세한 내용을 확인하세요.
          </p>

          {/* 필터 섹션 */}
          <div className="filters-section">
            <div className="search-box">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                placeholder="제목, 설명, 내용으로 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>

            <div className="filter-controls">
              <div className="filter-group">
                <label className="filter-label">타입:</label>
                <select 
                  value={selectedType} 
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="filter-select"
                >
                  <option value="all">모든 타입</option>
                  {uniqueTypes.map(type => (
                    <option key={type} value={type}>
                      {type === 'feature' ? '기능 추가' :
                       type === 'improvement' ? '개선' :
                       type === 'security' ? '보안' :
                       type === 'major' ? '대규모' : type}
                    </option>
                  ))}
                </select>
              </div>

              <div className="filter-group">
                <label className="filter-label">연도:</label>
                <select 
                  value={selectedYear} 
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="filter-select"
                >
                  <option value="all">모든 연도</option>
                  {uniqueYears.map(year => (
                    <option key={year} value={year}>{year}년</option>
                  ))}
                </select>
              </div>

              <button onClick={clearFilters} className="clear-filters-btn">
                필터 초기화
              </button>
            </div>

            {/* 결과 카운트 */}
            <div className="results-count">
              총 {filteredUpdates.length}개의 업데이트를 찾았습니다.
            </div>
          </div>

          <div className="updates-grid">
            {filteredUpdates.length > 0 ? (
              filteredUpdates.map((update) => (
                <div 
                  key={update.id} 
                  className="update-card"
                  onClick={() => handleUpdateClick(update)}
                >
                  <div className="card-header">
                    <div className="card-title-section">
                      <span className="type-icon">{getTypeIcon(update.type)}</span>
                      <h3 className="card-title">{update.title}</h3>
                    </div>
                    <span className={`version-badge ${getTypeClass(update.type)}`}>
                      {update.version}
                    </span>
                  </div>
                  
                  <p className="card-description">{update.description}</p>
                  
                  <div className="card-footer">
                    <span className="date-icon">📅</span>
                    <span className="date-text">{update.date}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-results">
                <span className="no-results-icon">🔍</span>
                <h3>검색 결과가 없습니다</h3>
                <p>다른 검색어나 필터를 시도해보세요.</p>
              </div>
            )}
          </div>
        </div>
      </main>

      {openDialog && selectedUpdate && (
        <div className="modal-overlay" onClick={handleCloseDialog}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title-section">
                <span className="modal-type-icon">{getTypeIcon(selectedUpdate.type)}</span>
                <h2 className="modal-title">{selectedUpdate.title}</h2>
              </div>
              <button className="close-button" onClick={handleCloseDialog}>
                ✕
              </button>
            </div>
            
            <div className="modal-badge-section">
              <span className={`modal-version-badge ${getTypeClass(selectedUpdate.type)}`}>
                {selectedUpdate.version}
              </span>
              <span className="modal-date">{selectedUpdate.date}</span>
            </div>
            
            <div className="modal-body">
              <p className="modal-description">{selectedUpdate.description}</p>
              
              <h3 className="section-title">주요 변경사항</h3>
              
              <ul className="details-list">
                {selectedUpdate.details.map((detail, index) => (
                  <li key={index} className="detail-item">
                    <span className="detail-icon">ℹ️</span>
                    {detail}
                  </li>
                ))}
              </ul>
              
              <hr className="divider" />
              
              <h3 className="section-title">상세 변경내역</h3>
              
              <div className="changes-container">
                {selectedUpdate.changes.map((change, index) => (
                  <span 
                    key={index}
                    className={`change-chip ${getChangeTypeClass(change.type)}`}
                  >
                    {change.text}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="modal-footer">
              <button className="close-modal-button" onClick={handleCloseDialog}>
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
