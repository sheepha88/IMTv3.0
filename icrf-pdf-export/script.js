// 전역 변수
let selectedItems = {
    site: new Set(),
    participant: new Set(),
    visit: new Set(),
    form: new Set()
};

// 샘플 데이터
const sampleData = {
    site: [
        { id: 'abc-hospital', name: 'ABC Hospital' },
        { id: 'green-valley', name: 'Green Valley Medical Cent' },
        { id: 'sunnydale', name: 'Sunnydale Hospital' },
        { id: 'riverbend', name: 'Riverbend Health Clinic' },
        { id: 'mountain-peak', name: 'Mountain Peak Hospital' },
        { id: 'lakeside', name: 'Lakeside Community Hosp' }
    ],
    participant: [
        { id: 'P001', name: '김철수' },
        { id: 'P002', name: '이영희' },
        { id: 'P003', name: '박민수' },
        { id: 'P004', name: '최지영' },
        { id: 'P005', name: '정현우' },
        { id: 'P006', name: '한소영' },
        { id: 'P007', name: '윤태호' },
        { id: 'P008', name: '송미라' }
    ],
    visit: [
        { id: 'baseline', name: 'Baseline' },
        { id: 'visit1', name: 'Visit 1' },
        { id: 'visit2', name: 'Visit 2' },
        { id: 'visit3', name: 'Visit 3' },
        { id: 'usv1', name: 'USV 1' },
        { id: 'eot', name: 'EOT' }
    ],
    form: [
        { id: 'image', name: 'Image' },
        { id: 'monitoring', name: 'Monitoring' },
        { id: 'qc', name: 'QC' },
        { id: 'eligibility', name: 'Eligibility' },
        { id: 'reader', name: 'Reader' },
        { id: 'adjudicator', name: 'Adjudicator' }
    ]
};

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// 앱 초기화
function initializeApp() {
    loadParticipantData();
    setupEventListeners();
    updateItemCounts();
}

// Participant 데이터 로드
function loadParticipantData() {
    const participantColumn = document.querySelector('.data-column:nth-child(2) .column-content');
    
    // 기존 Participant 항목들 제거 (첫 번째 select-all 제외)
    const existingItems = participantColumn.querySelectorAll('.checkbox-item:not(:first-child)');
    existingItems.forEach(item => item.remove());
    
    // 새로운 Participant 항목들 추가
    sampleData.participant.forEach(participant => {
        const label = document.createElement('label');
        label.className = 'checkbox-item';
        label.innerHTML = `
            <input type="checkbox" value="${participant.id}">
            <span class="checkbox-label">${participant.name}</span>
        `;
        
        // 체크박스 이벤트 리스너 추가
        const checkbox = label.querySelector('input[type="checkbox"]');
        checkbox.addEventListener('change', function() {
            toggleItem('participant', participant.id, this.checked);
        });
        
        participantColumn.appendChild(label);
    });
    
    // Participant 컬럼의 아이템 수 업데이트
    updateColumnItemCount('participant', 0);
}

// 이벤트 리스너 설정
function setupEventListeners() {
    // 전체 선택 체크박스 이벤트
    document.querySelectorAll('.select-all').forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const column = this.dataset.column;
            toggleSelectAll(column, this.checked);
        });
    });
    
    // 개별 체크박스 이벤트
    document.querySelectorAll('.data-column').forEach(column => {
        const checkboxes = column.querySelectorAll('input[type="checkbox"]:not(.select-all)');
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', function() {
                const columnType = getColumnType(column);
                toggleItem(columnType, this.value, this.checked);
            });
        });
    });
    
    // 검색 기능 이벤트
    document.querySelectorAll('.search-input').forEach(input => {
        input.addEventListener('input', function() {
            const column = this.closest('.data-column');
            const columnType = getColumnType(column);
            searchItems(columnType, this.value);
        });
    });
}

// 컬럼 타입 가져오기
function getColumnType(columnElement) {
    const columnIndex = Array.from(columnElement.parentNode.children).indexOf(columnElement);
    const types = ['site', 'participant', 'visit', 'form'];
    return types[columnIndex];
}

// 아이템 토글
function toggleItem(columnType, itemId, isChecked) {
    if (isChecked) {
        selectedItems[columnType].add(itemId);
    } else {
        selectedItems[columnType].delete(itemId);
    }
    
    updateItemCounts();
    updateSelectAllState(columnType);
}

// 전체 선택/해제 토글
function toggleSelectAll(columnType, isChecked) {
    const column = document.querySelector(`[data-column="${columnType}"]`).closest('.data-column');
    const checkboxes = column.querySelectorAll('input[type="checkbox"]:not(.select-all)');
    
    checkboxes.forEach(checkbox => {
        checkbox.checked = isChecked;
        toggleItem(columnType, checkbox.value, isChecked);
    });
}

// 전체 선택 상태 업데이트
function updateSelectAllState(columnType) {
    const column = document.querySelector(`[data-column="${columnType}"]`).closest('.data-column');
    const selectAllCheckbox = column.querySelector('.select-all');
    const checkboxes = column.querySelectorAll('input[type="checkbox"]:not(.select-all)');
    const checkedCount = Array.from(checkboxes).filter(cb => cb.checked).length;
    
    if (checkedCount === 0) {
        selectAllCheckbox.checked = false;
        selectAllCheckbox.indeterminate = false;
    } else if (checkedCount === checkboxes.length) {
        selectAllCheckbox.checked = true;
        selectAllCheckbox.indeterminate = false;
    } else {
        selectAllCheckbox.checked = false;
        selectAllCheckbox.indeterminate = true;
    }
}

// 아이템 수 업데이트
function updateItemCounts() {
    Object.keys(selectedItems).forEach(columnType => {
        updateColumnItemCount(columnType, selectedItems[columnType].size);
    });
}

// 컬럼별 아이템 수 업데이트
function updateColumnItemCount(columnType, selectedCount) {
    const column = document.querySelector(`[data-column="${columnType}"]`).closest('.data-column');
    const header = column.querySelector('.column-header h3');
    
    if (columnType === 'participant') {
        const totalCount = sampleData.participant.length;
        header.textContent = `✓ ${totalCount} items`;
    } else {
        const totalCount = sampleData[columnType].length;
        header.textContent = `✓ ${totalCount} items`;
    }
}

// 검색 기능
function searchItems(columnType, searchTerm) {
    const column = document.querySelector(`[data-column="${columnType}"]`).closest('.data-column');
    const checkboxes = column.querySelectorAll('.checkbox-item:not(:first-child)');
    
    checkboxes.forEach(item => {
        const label = item.querySelector('.checkbox-label').textContent.toLowerCase();
        const searchLower = searchTerm.toLowerCase();
        
        if (label.includes(searchLower)) {
            item.style.display = 'flex';
        } else {
            item.style.display = 'none';
        }
    });
}

// 데이터 내보내기
function exportData() {
    // 선택된 데이터 확인
    const totalSelected = Object.values(selectedItems).reduce((sum, set) => sum + set.size, 0);
    
    if (totalSelected === 0) {
        alert('내보낼 데이터를 선택해주세요.');
        return;
    }
    
    showLoadingModal('데이터를 내보내고 있습니다...');
    
    // 실제 구현에서는 API 호출 또는 파일 생성
    setTimeout(() => {
        hideLoadingModal();
        
        // 선택된 데이터 수집
        const exportData = {
            sites: Array.from(selectedItems.site),
            participants: Array.from(selectedItems.participant),
            visits: Array.from(selectedItems.visit),
            forms: Array.from(selectedItems.form),
            options: {
                icrf: document.getElementById('option-icrf').checked,
                auditTrail: document.getElementById('option-audit-trail').checked,
                query: document.getElementById('option-query').checked
            },
            exportTime: new Date().toISOString()
        };
        
        // 결과 표시 (실제로는 파일 다운로드 또는 API 전송)
        console.log('Export Data:', exportData);
        alert(`데이터 내보내기가 완료되었습니다!\n선택된 항목: ${totalSelected}개`);
        
    }, 2000);
}

// 로딩 모달 표시
function showLoadingModal(message) {
    const modal = document.getElementById('loadingModal');
    const messageElement = document.getElementById('loadingMessage');
    messageElement.textContent = message;
    modal.style.display = 'block';
}

// 로딩 모달 숨기기
function hideLoadingModal() {
    const modal = document.getElementById('loadingModal');
    modal.style.display = 'none';
}

// 기능명세서 토글
function toggleSpecification() {
    const specContent = document.getElementById('specContent');
    const toggleBtn = document.getElementById('toggleSpec');
    const toggleText = toggleBtn.querySelector('.toggle-text');
    const toggleIcon = toggleBtn.querySelector('.toggle-icon');
    
    if (specContent.style.display === 'none') {
        // 펼치기
        specContent.style.display = 'block';
        toggleText.textContent = '접기';
        toggleIcon.classList.remove('collapsed');
    } else {
        // 접기
        specContent.style.display = 'none';
        toggleText.textContent = '펼치기';
        toggleIcon.classList.add('collapsed');
    }
}

