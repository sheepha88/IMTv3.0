import React, { useState } from 'react';
import './App.css';

function App() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [exportStatus, setExportStatus] = useState(null);
  const [activeTab, setActiveTab] = useState('export'); // 'export' 또는 'data'
  
  // Data Export 관련 state
  const [dataDrawerOpen, setDataDrawerOpen] = useState(false);
  const [dataHistoryOpen, setDataHistoryOpen] = useState(false);
  const [isDataExporting, setIsDataExporting] = useState(false);
  const [dataCurrentStep, setDataCurrentStep] = useState(1);
  const [dataExportStatus, setDataExportStatus] = useState(null);

  const handleExport = async () => {
    setIsExporting(true);
    setCurrentStep(1);
    
    // 단계별 진행률 시뮬레이션
    for (let step = 1; step <= 5; step++) {
      setCurrentStep(step);
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    setExportStatus('success');
    setIsExporting(false);
  };

  const handleDataExport = async () => {
    setIsDataExporting(true);
    setDataCurrentStep(1);
    
    // 단계별 진행률 시뮬레이션
    for (let step = 1; step <= 4; step++) {
      setDataCurrentStep(step);
      await new Promise(resolve => setTimeout(resolve, 800));
    }
    
    setDataExportStatus('success');
    setIsDataExporting(false);
  };

  return (
    <div className="App">
      {/* 헤더 */}
      <header className="header">
        <h1>IMT v3.0 - 통합 관리 시스템</h1>
        <div className="header-buttons">
          <button 
            onClick={() => setActiveTab('export')} 
            className={`btn ${activeTab === 'export' ? 'btn-primary' : 'btn-outline'}`}
          >
            iCRF Export
          </button>
          <button 
            onClick={() => setActiveTab('data')} 
            className={`btn ${activeTab === 'data' ? 'btn-primary' : 'btn-outline'}`}
          >
            Data Export
          </button>
        </div>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="main-content">
        {activeTab === 'export' ? (
          <>
            <h2>iCRF Export 기능</h2>
            <p>임상 데이터를 PDF 또는 ZIP 형식으로 내보낼 수 있습니다.</p>
            <p>상단의 "Export 설정" 버튼을 클릭하여 내보내기 옵션을 설정하세요.</p>
            
            <div className="feature-buttons">
              <button onClick={() => setDrawerOpen(true)} className="btn btn-primary">
                Export 설정
              </button>
              <button onClick={() => setHistoryOpen(true)} className="btn btn-secondary">
                내보내기 이력
              </button>
            </div>
          </>
        ) : (
          <>
            <h2>Data Export 기능</h2>
            <p>임상 데이터를 다양한 형식으로 내보낼 수 있습니다.</p>
            <p>CSV, Excel, JSON 등 다양한 형식을 지원합니다.</p>
            
            <div className="feature-buttons">
              <button onClick={() => setDataDrawerOpen(true)} className="btn btn-primary">
                Data Export 설정
              </button>
              <button onClick={() => setDataHistoryOpen(true)} className="btn btn-secondary">
                Data 이력
              </button>
            </div>
          </>
        )}
      </main>

      {/* Export Drawer */}
      {drawerOpen && (
        <div className="drawer-overlay" onClick={() => setDrawerOpen(false)}>
          <div className="drawer" onClick={(e) => e.stopPropagation()}>
            <div className="drawer-header">
              <h3>Export 설정</h3>
              <button onClick={() => setDrawerOpen(false)} className="close-btn">×</button>
            </div>

            <div className="drawer-content">
              {/* 진행률 표시 */}
              {isExporting && (
                <div className="progress-section">
                  <h4>Export 진행 중...</h4>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{width: `${(currentStep / 5) * 100}%`}}
                    ></div>
                  </div>
                  <p>단계 {currentStep}/5</p>
                </div>
              )}

              {exportStatus === 'success' && (
                <div className="success-message">
                  Export가 완료되었습니다!
                </div>
              )}

              {/* Export 설정 폼 */}
              <div className="form-section">
                <div className="form-group">
                  <label>Protocol No.</label>
                  <input type="text" value="P0012" disabled className="form-input" />
                </div>

                <div className="form-group">
                  <label>대상자 선택</label>
                  <select className="form-select">
                    <option value="all">전체 대상자</option>
                    <option value="selected">선택적 대상자</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>방문일 선택</label>
                  <div className="checkbox-group">
                    <label><input type="checkbox" defaultChecked /> BL</label>
                    <label><input type="checkbox" defaultChecked /> TP1</label>
                    <label><input type="checkbox" defaultChecked /> TP2</label>
                    <label><input type="checkbox" /> TP3</label>
                  </div>
                </div>

                <div className="form-group">
                  <label>Form 포함 여부</label>
                  <div className="checkbox-group">
                    <label><input type="checkbox" defaultChecked /> Eligibility</label>
                    <label><input type="checkbox" defaultChecked /> Report</label>
                    <label><input type="checkbox" defaultChecked /> Adjudication</label>
                  </div>
                </div>

                <div className="form-group">
                  <label>
                    <input type="checkbox" defaultChecked /> Audit Trail 포함
                  </label>
                </div>

                <div className="form-group">
                  <label>
                    <input type="checkbox" defaultChecked /> Reviewer 익명화
                  </label>
                </div>

                <div className="form-group">
                  <label>파일 형식</label>
                  <div className="radio-group">
                    <label><input type="radio" name="format" value="pdf" defaultChecked /> PDF</label>
                    <label><input type="radio" name="format" value="zip" /> ZIP (PDF + JSON)</label>
                  </div>
                </div>
              </div>

              <div className="drawer-actions">
                <button 
                  onClick={() => setDrawerOpen(false)} 
                  className="btn btn-outline"
                  disabled={isExporting}
                >
                  취소
                </button>
                <button 
                  onClick={handleExport} 
                  className="btn btn-primary"
                  disabled={isExporting}
                >
                  {isExporting ? 'Export 중...' : 'EXPORT'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Data Export Drawer */}
      {dataDrawerOpen && (
        <div className="drawer-overlay" onClick={() => setDataDrawerOpen(false)}>
          <div className="drawer" onClick={(e) => e.stopPropagation()}>
            <div className="drawer-header">
              <h3>Data Export 설정</h3>
              <button onClick={() => setDataDrawerOpen(false)} className="close-btn">×</button>
            </div>

            <div className="drawer-content">
              {/* 진행률 표시 */}
              {isDataExporting && (
                <div className="progress-section">
                  <h4>Data Export 진행 중...</h4>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{width: `${(dataCurrentStep / 4) * 100}%`}}
                    ></div>
                  </div>
                  <p>단계 {dataCurrentStep}/4</p>
                </div>
              )}

              {dataExportStatus === 'success' && (
                <div className="success-message">
                  Data Export가 완료되었습니다!
                </div>
              )}

              {/* Data Export 설정 폼 */}
              <div className="form-section">
                <div className="form-group">
                  <label>데이터 범위</label>
                  <select className="form-select">
                    <option value="all">전체 데이터</option>
                    <option value="filtered">필터링된 데이터</option>
                    <option value="selected">선택된 데이터</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>데이터 타입</label>
                  <div className="checkbox-group">
                    <label><input type="checkbox" defaultChecked /> Demographics</label>
                    <label><input type="checkbox" defaultChecked /> Vital Signs</label>
                    <label><input type="checkbox" defaultChecked /> Lab Results</label>
                    <label><input type="checkbox" defaultChecked /> Adverse Events</label>
                    <label><input type="checkbox" /> Concomitant Medications</label>
                  </div>
                </div>

                <div className="form-group">
                  <label>기간 설정</label>
                  <div className="date-range">
                    <div>
                      <label>시작일</label>
                      <input type="date" className="form-input" defaultValue="2024-01-01" />
                    </div>
                    <div>
                      <label>종료일</label>
                      <input type="date" className="form-input" defaultValue="2024-12-31" />
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <label>파일 형식</label>
                  <div className="radio-group">
                    <label><input type="radio" name="dataFormat" value="csv" defaultChecked /> CSV</label>
                    <label><input type="radio" name="dataFormat" value="excel" /> Excel (.xlsx)</label>
                    <label><input type="radio" name="dataFormat" value="json" /> JSON</label>
                    <label><input type="radio" name="dataFormat" value="sas" /> SAS (.sas7bdat)</label>
                  </div>
                </div>

                <div className="form-group">
                  <label>
                    <input type="checkbox" defaultChecked /> 헤더 포함
                  </label>
                </div>

                <div className="form-group">
                  <label>
                    <input type="checkbox" /> 데이터 압축 (ZIP)
                  </label>
                </div>
              </div>

              <div className="drawer-actions">
                <button 
                  onClick={() => setDataDrawerOpen(false)} 
                  className="btn btn-outline"
                  disabled={isDataExporting}
                >
                  취소
                </button>
                <button 
                  onClick={handleDataExport} 
                  className="btn btn-primary"
                  disabled={isDataExporting}
                >
                  {isDataExporting ? 'Export 중...' : 'DATA EXPORT'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Export History */}
      {historyOpen && (
        <div className="drawer-overlay" onClick={() => setHistoryOpen(false)}>
          <div className="drawer" onClick={(e) => e.stopPropagation()}>
            <div className="drawer-header">
              <h3>Export 이력</h3>
              <button onClick={() => setHistoryOpen(false)} className="close-btn">×</button>
            </div>

            <div className="drawer-content">
              <div className="history-list">
                <div className="history-item">
                  <div className="history-info">
                    <strong>P0012_S001_BL_AnnotatedICRF_20250730.pdf</strong>
                    <span className="status success">완료</span>
                  </div>
                  <div className="history-details">
                    Protocol: P0012 | 대상자: S001 | 방문일: BL | 크기: 2.5MB
                  </div>
                </div>
                <div className="history-item">
                  <div className="history-info">
                    <strong>P0012_All_TP1_AnnotatedICRF_20250729.zip</strong>
                    <span className="status success">완료</span>
                  </div>
                  <div className="history-details">
                    Protocol: P0012 | 대상자: All | 방문일: TP1 | 크기: 15.2MB
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Data Export History */}
      {dataHistoryOpen && (
        <div className="drawer-overlay" onClick={() => setDataHistoryOpen(false)}>
          <div className="drawer" onClick={(e) => e.stopPropagation()}>
            <div className="drawer-header">
              <h3>Data Export 이력</h3>
              <button onClick={() => setDataHistoryOpen(false)} className="close-btn">×</button>
            </div>

            <div className="drawer-content">
              <div className="history-list">
                <div className="history-item">
                  <div className="history-info">
                    <strong>P0012_All_Data_20250730.csv</strong>
                    <span className="status success">완료</span>
                  </div>
                  <div className="history-details">
                    Protocol: P0012 | 데이터 타입: All | 기간: 2024-01-01 ~ 2024-12-31 | 크기: 8.7MB
                  </div>
                </div>
                <div className="history-item">
                  <div className="history-info">
                    <strong>P0012_LabResults_20250729.xlsx</strong>
                    <span className="status success">완료</span>
                  </div>
                  <div className="history-details">
                    Protocol: P0012 | 데이터 타입: Lab Results | 기간: 2024-06-01 ~ 2024-12-31 | 크기: 3.2MB
                  </div>
                </div>
                <div className="history-item">
                  <div className="history-info">
                    <strong>P0012_VitalSigns_20250728.json</strong>
                    <span className="status success">완료</span>
                  </div>
                  <div className="history-details">
                    Protocol: P0012 | 데이터 타입: Vital Signs | 기간: 2024-01-01 ~ 2024-12-31 | 크기: 1.8MB
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App; 