import React, { useState } from 'react';
import './DataExport.css';

function DataExport() {
  const [selectedFormat, setSelectedFormat] = useState('excel');
  const [selectedData, setSelectedData] = useState('all');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [isExporting, setIsExporting] = useState(false);
  const [exportHistory, setExportHistory] = useState([
    {
      id: 1,
      fileName: 'IMT_Update_History_2024_01_15.xlsx',
      format: 'Excel',
      dataType: '전체 데이터',
      dateRange: '2024-01-01 ~ 2024-01-15',
      exportDate: '2024-01-15 14:30',
      status: '완료',
      fileSize: '2.3 MB'
    },
    {
      id: 2,
      fileName: 'IMT_Security_Updates_2024_01_10.csv',
      format: 'CSV',
      dataType: '보안 업데이트',
      dateRange: '2024-01-01 ~ 2024-01-10',
      exportDate: '2024-01-10 11:45',
      status: '완료',
      fileSize: '1.1 MB'
    },
    {
      id: 3,
      fileName: 'IMT_Feature_Updates_2024_01_05.json',
      format: 'JSON',
      dataType: '기능 업데이트',
      dateRange: '2024-01-01 ~ 2024-01-05',
      exportDate: '2024-01-05 09:20',
      status: '완료',
      fileSize: '856 KB'
    }
  ]);

  const handleExport = () => {
    setIsExporting(true);
    
    // 시뮬레이션: 3초 후 완료
    setTimeout(() => {
      const newExport = {
        id: exportHistory.length + 1,
        fileName: `IMT_Export_${new Date().toISOString().split('T')[0]}.${selectedFormat === 'excel' ? 'xlsx' : selectedFormat === 'csv' ? 'csv' : 'json'}`,
        format: selectedFormat === 'excel' ? 'Excel' : selectedFormat === 'csv' ? 'CSV' : 'JSON',
        dataType: selectedData === 'all' ? '전체 데이터' : 
                  selectedData === 'security' ? '보안 업데이트' :
                  selectedData === 'feature' ? '기능 업데이트' :
                  selectedData === 'improvement' ? '개선 사항' : '대규모 업데이트',
        dateRange: dateRange.start && dateRange.end ? `${dateRange.start} ~ ${dateRange.end}` : '전체 기간',
        exportDate: new Date().toLocaleString('ko-KR'),
        status: '완료',
        fileSize: `${Math.floor(Math.random() * 3 + 1)}.${Math.floor(Math.random() * 9)} MB`
      };
      
      setExportHistory([newExport, ...exportHistory]);
      setIsExporting(false);
      alert('데이터 추출이 완료되었습니다!');
    }, 3000);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case '완료':
        return '✅';
      case '진행중':
        return '⏳';
      case '실패':
        return '❌';
      default:
        return 'ℹ️';
    }
  };

  const getFormatIcon = (format) => {
    switch (format) {
      case 'Excel':
        return '📊';
      case 'CSV':
        return '📋';
      case 'JSON':
        return '🔧';
      default:
        return '📄';
    }
  };

  return (
    <div className="data-export-page">
      <header className="export-header">
        <h1>📊 데이터 추출</h1>
        <p>IMT v3.0 시스템의 업데이트 데이터를 다양한 형식으로 추출할 수 있습니다.</p>
      </header>

      <main className="export-content">
        <div className="export-container">
          <section className="export-settings">
            <h2>⚙️ 추출 설정</h2>
            
            <div className="setting-group">
              <label className="setting-label">📄 출력 형식:</label>
              <select 
                value={selectedFormat} 
                onChange={(e) => setSelectedFormat(e.target.value)}
                className="setting-select"
              >
                <option value="excel">Excel (.xlsx)</option>
                <option value="csv">CSV (.csv)</option>
                <option value="json">JSON (.json)</option>
              </select>
            </div>

            <div className="setting-group">
              <label className="setting-label">📋 데이터 유형:</label>
              <select 
                value={selectedData} 
                onChange={(e) => setSelectedData(e.target.value)}
                className="setting-select"
              >
                <option value="all">전체 데이터</option>
                <option value="security">보안 업데이트</option>
                <option value="feature">기능 업데이트</option>
                <option value="improvement">개선 사항</option>
                <option value="major">대규모 업데이트</option>
              </select>
            </div>

            <div className="setting-group">
              <label className="setting-label">📅 날짜 범위:</label>
              <div className="date-range">
                <input
                  type="date"
                  value={dateRange.start}
                  onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
                  className="date-input"
                  placeholder="시작일"
                />
                <span className="date-separator">~</span>
                <input
                  type="date"
                  value={dateRange.end}
                  onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
                  className="date-input"
                  placeholder="종료일"
                />
              </div>
            </div>

            <button 
              onClick={handleExport} 
              disabled={isExporting}
              className={`export-button ${isExporting ? 'exporting' : ''}`}
            >
              {isExporting ? '⏳ 추출 중...' : '📥 데이터 추출'}
            </button>
          </section>

          <section className="export-history">
            <h2>📋 추출 기록</h2>
            
            <div className="history-list">
              {exportHistory.map((item) => (
                <div key={item.id} className="history-item">
                  <div className="history-header">
                    <div className="history-title">
                      <span className="format-icon">{getFormatIcon(item.format)}</span>
                      <span className="file-name">{item.fileName}</span>
                    </div>
                    <span className={`status-badge ${item.status === '완료' ? 'success' : item.status === '진행중' ? 'pending' : 'error'}`}>
                      {getStatusIcon(item.status)} {item.status}
                    </span>
                  </div>
                  
                  <div className="history-details">
                    <div className="detail-row">
                      <span className="detail-label">📋 데이터 유형:</span>
                      <span className="detail-value">{item.dataType}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">📅 날짜 범위:</span>
                      <span className="detail-value">{item.dateRange}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">📅 추출 날짜:</span>
                      <span className="detail-value">{item.exportDate}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">📏 파일 크기:</span>
                      <span className="detail-value">{item.fileSize}</span>
                    </div>
                  </div>
                  
                  <div className="history-actions">
                    <button className="action-button download">📥 다운로드</button>
                    <button className="action-button share">📤 공유</button>
                    <button className="action-button delete">🗑️ 삭제</button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default DataExport; 