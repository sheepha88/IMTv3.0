// 샘플 업데이트 데이터
const updateData = [
    {
        id: 1,
        title: "새로운 사용자 인터페이스 업데이트",
        date: "2024-01-15",
        category: "feature",
        priority: "high",
        summary: "사용자 경험을 개선하기 위한 새로운 UI/UX 디자인이 적용되었습니다.",
        content: `
            <h3>주요 변경사항</h3>
            <ul>
                <li>반응형 디자인 개선</li>
                <li>다크 모드 지원 추가</li>
                <li>접근성 향상</li>
                <li>성능 최적화</li>
            </ul>
            <h3>기술적 세부사항</h3>
            <p>React 18의 새로운 기능들을 활용하여 컴포넌트 구조를 개선했습니다. CSS Grid와 Flexbox를 적극 활용하여 다양한 화면 크기에서 최적의 레이아웃을 제공합니다.</p>
        `
    },
    {
        id: 2,
        title: "보안 취약점 패치",
        date: "2024-01-10",
        category: "security",
        priority: "high",
        summary: "발견된 보안 취약점을 수정하여 시스템 보안을 강화했습니다.",
        content: `
            <h3>패치된 취약점</h3>
            <ul>
                <li>XSS 공격 방지 강화</li>
                <li>SQL 인젝션 방지 개선</li>
                <li>CSRF 토큰 검증 강화</li>
            </ul>
            <h3>권장사항</h3>
            <p>모든 사용자는 즉시 업데이트를 적용하시기 바랍니다. 추가적인 보안 관련 문의사항이 있으시면 보안팀에 연락해 주세요.</p>
        `
    },
    {
        id: 3,
        title: "데이터베이스 성능 최적화",
        date: "2024-01-08",
        category: "improvement",
        priority: "medium",
        summary: "데이터베이스 쿼리 최적화를 통해 시스템 성능을 향상시켰습니다.",
        content: `
            <h3>최적화 내용</h3>
            <ul>
                <li>인덱스 추가 및 최적화</li>
                <li>쿼리 실행 계획 개선</li>
                <li>연결 풀 설정 조정</li>
            </ul>
            <h3>성능 개선 결과</h3>
            <p>평균 응답 시간이 30% 단축되었으며, 동시 사용자 처리 능력이 향상되었습니다.</p>
        `
    },
    {
        id: 4,
        title: "로그인 시스템 버그 수정",
        date: "2024-01-05",
        category: "bugfix",
        priority: "medium",
        summary: "특정 브라우저에서 발생하던 로그인 문제를 해결했습니다.",
        content: `
            <h3>수정된 문제</h3>
            <ul>
                <li>Safari 브라우저 로그인 실패 문제</li>
                <li>세션 만료 시 리다이렉트 오류</li>
                <li>비밀번호 재설정 이메일 발송 실패</li>
            </ul>
            <h3>해결 방법</h3>
            <p>브라우저 호환성 문제를 해결하고 세션 관리 로직을 개선했습니다.</p>
        `
    },
    {
        id: 5,
        title: "모바일 앱 업데이트",
        date: "2024-01-03",
        category: "feature",
        priority: "low",
        summary: "모바일 앱에 새로운 기능들이 추가되었습니다.",
        content: `
            <h3>새로운 기능</h3>
            <ul>
                <li>오프라인 모드 지원</li>
                <li>푸시 알림 기능</li>
                <li>바이오메트릭 인증</li>
            </ul>
            <h3>개선사항</h3>
            <p>앱 스토어에서 최신 버전을 다운로드하여 새로운 기능들을 사용해보세요.</p>
        `
    },
    {
        id: 6,
        title: "API 문서 업데이트",
        date: "2024-01-01",
        category: "improvement",
        priority: "low",
        summary: "개발자들을 위한 API 문서가 개선되었습니다.",
        content: `
            <h3>문서 개선사항</h3>
            <ul>
                <li>새로운 API 엔드포인트 문서 추가</li>
                <li>코드 예제 개선</li>
                <li>오류 코드 설명 추가</li>
            </ul>
            <h3>접근 방법</h3>
            <p>개발자 포털에서 최신 API 문서를 확인하실 수 있습니다.</p>
        `
    }
];

// DOM 요소들
const updateList = document.getElementById('updateList');
const dateFilter = document.getElementById('dateFilter');
const categoryFilter = document.getElementById('categoryFilter');
const priorityFilter = document.getElementById('priorityFilter');
const searchInput = document.getElementById('searchInput');
const clearFiltersBtn = document.getElementById('clearFilters');
const modal = document.getElementById('updateModal');
const modalContent = document.getElementById('modalContent');
const closeModal = document.querySelector('.close');

// 필터 상태
let currentFilters = {
    date: '',
    category: '',
    priority: '',
    search: ''
};

// 초기화
document.addEventListener('DOMContentLoaded', function() {
    renderUpdateList(updateData);
    setupEventListeners();
});

// 이벤트 리스너 설정
function setupEventListeners() {
    // 필터 이벤트
    dateFilter.addEventListener('change', handleFilterChange);
    categoryFilter.addEventListener('change', handleFilterChange);
    priorityFilter.addEventListener('change', handleFilterChange);
    searchInput.addEventListener('input', handleSearchInput);
    
    // 필터 초기화
    clearFiltersBtn.addEventListener('click', clearAllFilters);
    
    // 모달 닫기
    closeModal.addEventListener('click', closeModalHandler);
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModalHandler();
        }
    });
    
    // ESC 키로 모달 닫기
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.style.display === 'block') {
            closeModalHandler();
        }
    });
}

// 필터 변경 처리
function handleFilterChange() {
    currentFilters.date = dateFilter.value;
    currentFilters.category = categoryFilter.value;
    currentFilters.priority = priorityFilter.value;
    
    applyFilters();
}

// 검색 입력 처리
function handleSearchInput() {
    currentFilters.search = searchInput.value.toLowerCase();
    applyFilters();
}

// 필터 적용
function applyFilters() {
    let filteredData = updateData.filter(update => {
        // 날짜 필터
        if (currentFilters.date && !matchesDateFilter(update.date, currentFilters.date)) {
            return false;
        }
        
        // 카테고리 필터
        if (currentFilters.category && update.category !== currentFilters.category) {
            return false;
        }
        
        // 우선순위 필터
        if (currentFilters.priority && update.priority !== currentFilters.priority) {
            return false;
        }
        
        // 검색 필터
        if (currentFilters.search) {
            const searchText = update.title.toLowerCase() + ' ' + update.summary.toLowerCase();
            if (!searchText.includes(currentFilters.search)) {
                return false;
            }
        }
        
        return true;
    });
    
    renderUpdateList(filteredData);
}

// 날짜 필터 매칭
function matchesDateFilter(updateDate, filterType) {
    const update = new Date(updateDate);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    switch (filterType) {
        case 'today':
            return update >= today;
        case 'week':
            const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
            return update >= weekAgo;
        case 'month':
            const monthAgo = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
            return update >= monthAgo;
        case 'year':
            const yearAgo = new Date(today.getFullYear(), 0, 1);
            return update >= yearAgo;
        default:
            return true;
    }
}

// 필터 초기화
function clearAllFilters() {
    dateFilter.value = '';
    categoryFilter.value = '';
    priorityFilter.value = '';
    searchInput.value = '';
    
    currentFilters = {
        date: '',
        category: '',
        priority: '',
        search: ''
    };
    
    renderUpdateList(updateData);
}

// 업데이트 목록 렌더링
function renderUpdateList(data) {
    if (data.length === 0) {
        updateList.innerHTML = `
            <div class="empty-state">
                <h3>검색 결과가 없습니다</h3>
                <p>다른 필터 조건을 시도해보세요.</p>
            </div>
        `;
        return;
    }
    
    updateList.innerHTML = data.map(update => `
        <div class="update-item" onclick="showUpdateDetail(${update.id})">
            <div class="update-header">
                <div>
                    <div class="update-title">${update.title}</div>
                    <div class="update-date">${formatDate(update.date)}</div>
                </div>
            </div>
            <div class="update-meta">
                <span class="update-category ${update.category}">${getCategoryLabel(update.category)}</span>
                <span class="update-priority ${update.priority}">${getPriorityLabel(update.priority)}</span>
            </div>
            <div class="update-summary">${update.summary}</div>
        </div>
    `).join('');
}

// 날짜 포맷팅
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// 카테고리 라벨
function getCategoryLabel(category) {
    const labels = {
        feature: '새 기능',
        bugfix: '버그 수정',
        improvement: '개선사항',
        security: '보안'
    };
    return labels[category] || category;
}

// 우선순위 라벨
function getPriorityLabel(priority) {
    const labels = {
        high: '높음',
        medium: '보통',
        low: '낮음'
    };
    return labels[priority] || priority;
}

// 업데이트 상세 보기
function showUpdateDetail(updateId) {
    const update = updateData.find(item => item.id === updateId);
    if (!update) return;
    
    modalContent.innerHTML = `
        <div class="modal-header">
            <h2 class="modal-title">${update.title}</h2>
            <div class="modal-meta">
                <span class="update-category ${update.category}">${getCategoryLabel(update.category)}</span>
                <span class="update-priority ${update.priority}">${getPriorityLabel(update.priority)}</span>
                <span>${formatDate(update.date)}</span>
            </div>
        </div>
        <div class="modal-body">
            <p><strong>요약:</strong> ${update.summary}</p>
            ${update.content}
        </div>
    `;
    
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// 모달 닫기
function closeModalHandler() {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// 전역 함수로 노출 (HTML에서 호출하기 위해)
window.showUpdateDetail = showUpdateDetail; 