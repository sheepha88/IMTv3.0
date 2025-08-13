import React, { useState, useMemo } from "react";
import './App.css';

const ExportData = () => {
  const [option, setOption] = useState("All");
  const [reviewer, setReviewer] = useState([]);
  const [selectedSites, setSelectedSites] = useState([]);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  const sites = useMemo(() => [
    "ABC Hospital",
    "Green Valley Medical Center", 
    "Sunnydale Hospital",
    "Riverbend Health Clinic",
    "Mountain Peak Hospital",
    "Lakeside Community Hospital",
  ], []);

  const visits = useMemo(() => [
    "Baseline", "Visit 1", "Visit 2", "Visit 3", "USV 1", "EOT"
  ], []);

  const reviewers = ["Reader 1", "Reader 2", "Adjudicator"];

  const renderCheckboxList = (items, sectionTitle, selectedItems, setSelectedItems) => items.map((item, i) => (
    <label key={i} style={{ display: 'block', marginBottom: 4 }}>
      <input 
        type="checkbox" 
        checked={selectedItems.includes(item)}
        onChange={(e) => {
          if (e.target.checked) {
            setSelectedItems([...selectedItems, item]);
          } else {
            setSelectedItems(selectedItems.filter(selected => selected !== item));
          }
        }}
      /> {item}
    </label>
  ));

  const sections = [
    { title: "Site", data: sites, color: "#4CAF50", selected: selectedSites, setSelected: setSelectedSites },
    { title: "Participant", data: Array.from({ length: 5 }, (_, i) => `Participant ${i + 1}`), color: "#2196F3", selected: [], setSelected: () => {} },
    { title: "Visit", data: visits, color: "#FF9800", selected: [], setSelected: () => {} },
    { title: "Form version", data: ["Version 1", "Version 2", "Version 3"], color: "#9C27B0", selected: [], setSelected: () => {} },
    { title: "Item OID", data: ["OID 1 / Ver 1", "OID 2 / Ver 2", "OID 3 / Ver 3"], color: "#F44336", selected: [], setSelected: () => {} }
  ];

  // Preview 데이터 생성
  const previewData = [
    { participant: "Participant A001", visit: "Baseline", reviewer: "Reader 1", formVersion: "v1", brdtc: "2023-03-15" },
    { participant: "Participant A001", visit: "Baseline", reviewer: "Reader 2", formVersion: "v2", brdtc: "2023-03-15" },
    { participant: "Participant A001", visit: "Baseline", reviewer: "Adjudicator", formVersion: "v2", brdtc: "2023-03-15" },
    { participant: "Participant A001", visit: "Visit 1", reviewer: "Reader 1", formVersion: "v2", brdtc: "2023-06-21" },
    { participant: "Participant A001", visit: "Visit 1", reviewer: "Reader 2", formVersion: "v2", brdtc: "2023-06-21" },
    { participant: "Participant A001", visit: "Visit 1", reviewer: "Adjudicator", formVersion: "v2", brdtc: "2023-06-21" },
    { participant: "Participant A002", visit: "Baseline", reviewer: "Reader 1", formVersion: "v1", brdtc: "2023-04-16" },
    { participant: "Participant A002", visit: "Baseline", reviewer: "Reader 2", formVersion: "v2", brdtc: "2023-04-16" },
    { participant: "Participant A002", visit: "Baseline", reviewer: "Adjudicator", formVersion: "v1", brdtc: "2023-04-16" },
    { participant: "Participant A002", visit: "Visit 1", reviewer: "Reader 1", formVersion: "v1", brdtc: "2023-07-08" }
  ];

  return (
    <div style={{ padding: 16, fontFamily: 'sans-serif', fontSize: 14 }}>
      <h3>Export Data</h3>
      <div style={{ display: "flex", gap: 12, flexWrap: 'wrap' }}>
        {sections.map((section, idx) => (
          <div key={idx} style={{ 
            border: `2px solid ${section.color}`, 
            borderRadius: '8px', 
            padding: '12px', 
            minWidth: '200px',
            backgroundColor: '#fafafa'
          }}>
            <div style={{ 
              borderBottom: `2px solid ${section.color}`, 
              paddingBottom: '8px', 
              marginBottom: '12px',
              fontWeight: 'bold',
              color: section.color
            }}>
              {section.title}
            </div>
            <input placeholder="search" style={{ width: "100%", marginBottom: 8, padding: '4px' }} />
            <div style={{ maxHeight: '150px', overflowY: 'auto' }}>
              {/* Participant 섹션의 경우 Site가 선택되었을 때만 체크박스 리스트 표시 */}
              {section.title === "Participant" ? (
                selectedSites.length > 0 ? (
                  renderCheckboxList(section.data, section.title, section.selected, section.setSelected)
                ) : (
                  <div style={{ color: '#999', fontStyle: 'italic', padding: '10px 0' }}>
                    Site를 먼저 선택해주세요
                  </div>
                )
              ) : (
                renderCheckboxList(section.data, section.title, section.selected, section.setSelected)
              )}
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 16, borderTop: '2px solid #ddd', paddingTop: '16px' }}>
        <strong>Option</strong><br />
        {["All", "Softlock", "Without softlock"].map(opt => (
          <label key={opt} style={{ marginRight: 10 }}>
            <input
              type="radio"
              name="option"
              value={opt}
              checked={option === opt}
              onChange={() => setOption(opt)}
            /> {opt}
          </label>
        ))}
      </div>

      <div style={{ marginTop: 16, borderTop: '2px solid #ddd', paddingTop: '16px' }}>
        <strong>Reviewer</strong><br />
        {reviewers.map(r => (
          <label key={r} style={{ marginRight: 10 }}>
            <input
              type="checkbox"
              value={r}
              checked={reviewer.includes(r)}
              onChange={(e) => {
                const checked = e.target.checked;
                setReviewer(prev =>
                  checked ? [...prev, r] : prev.filter(val => val !== r)
                );
              }}
            /> {r}
          </label>
        ))}
      </div>

      <div style={{ marginTop: 20, borderTop: '2px solid #ddd', paddingTop: '16px' }}>
        <button onClick={() => setShowPreviewModal(true)}>Preview</button>
        <button style={{ marginLeft: 8 }}>Save</button>
        <button style={{ marginLeft: 8 }}>Export</button>
      </div>

      {/* Preview Modal */}
      {showPreviewModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            width: '80%',
            maxWidth: '800px',
            maxHeight: '80%',
            display: 'flex',
            flexDirection: 'column'
          }}>
            {/* Modal Header */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '20px',
              borderBottom: '1px solid #ddd'
            }}>
              <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold' }}>Preview</h2>
              <button 
                onClick={() => setShowPreviewModal(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '20px',
                  cursor: 'pointer',
                  padding: '5px'
                }}
              >
                ×
              </button>
            </div>

            {/* Info Banner */}
            <div style={{
              backgroundColor: '#e3f2fd',
              padding: '12px 20px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <div style={{
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                backgroundColor: '#2196f3',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                fontWeight: 'bold'
              }}>
                i
              </div>
              <span style={{ color: '#333', fontSize: '14px' }}>
                You can preview up to 10 lines.
              </span>
            </div>

            {/* Table */}
            <div style={{
              flex: 1,
              overflow: 'auto',
              padding: '20px'
            }}>
              <table style={{
                width: '100%',
                borderCollapse: 'collapse',
                fontSize: '14px'
              }}>
                <thead>
                  <tr style={{
                    backgroundColor: '#f5f5f5',
                    borderBottom: '2px solid #ddd'
                  }}>
                    <th style={{ padding: '12px 8px', textAlign: 'left', fontWeight: 'bold' }}>Participant</th>
                    <th style={{ padding: '12px 8px', textAlign: 'left', fontWeight: 'bold' }}>Visit</th>
                    <th style={{ padding: '12px 8px', textAlign: 'left', fontWeight: 'bold' }}>Reviewer</th>
                    <th style={{ padding: '12px 8px', textAlign: 'left', fontWeight: 'bold' }}>Form version</th>
                    <th style={{ padding: '12px 8px', textAlign: 'left', fontWeight: 'bold' }}>BRDTC</th>
                  </tr>
                </thead>
                <tbody>
                  {previewData.map((row, index) => (
                    <tr key={index} style={{
                      borderBottom: '1px solid #eee',
                      backgroundColor: index % 2 === 0 ? 'white' : '#fafafa'
                    }}>
                      <td style={{ padding: '12px 8px' }}>{row.participant}</td>
                      <td style={{ padding: '12px 8px' }}>{row.visit}</td>
                      <td style={{ padding: '12px 8px' }}>{row.reviewer}</td>
                      <td style={{ padding: '12px 8px' }}>{row.formVersion}</td>
                      <td style={{ padding: '12px 8px' }}>{row.brdtc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Modal Footer */}
            <div style={{
              padding: '20px',
              borderTop: '1px solid #ddd',
              display: 'flex',
              justifyContent: 'flex-end'
            }}>
              <button 
                onClick={() => setShowPreviewModal(false)}
                style={{
                  backgroundColor: '#2196f3',
                  color: 'white',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExportData; 