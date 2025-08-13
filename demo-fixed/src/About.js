import React from 'react';
import './About.css';

function About() {
  return (
    <div className="about-page">
      <header className="about-header">
        <h1>About IMT v3.0</h1>
        <p>시스템 정보 및 개발팀 소개</p>
      </header>
      
      <main className="about-content">
        <section className="about-section">
          <h2>📋 시스템 개요</h2>
          <p>
            IMT v3.0은 최신 기술을 활용하여 개발된 차세대 관리 시스템입니다.
            사용자 친화적인 인터페이스와 강력한 기능을 제공합니다.
          </p>
        </section>
        
        <section className="about-section">
          <h2>🚀 주요 기능</h2>
          <ul className="feature-list">
            <li>📊 실시간 데이터 모니터링</li>
            <li>🔍 고급 검색 및 필터링</li>
            <li>📱 반응형 디자인</li>
            <li>🔒 보안 강화 시스템</li>
            <li>📈 성능 최적화</li>
          </ul>
        </section>
        
        <section className="about-section">
          <h2>👥 개발팀</h2>
          <div className="team-info">
            <p><strong>프로젝트 매니저:</strong> 김개발</p>
            <p><strong>프론트엔드 개발:</strong> 이리액트</p>
            <p><strong>백엔드 개발:</strong> 박서버</p>
            <p><strong>UI/UX 디자인:</strong> 최디자인</p>
          </div>
        </section>
        
        <section className="about-section">
          <h2>📞 연락처</h2>
          <div className="contact-info">
            <p>📧 Email: dev@imt-system.com</p>
            <p>📱 Phone: 02-1234-5678</p>
            <p>🏢 Address: 서울시 강남구 개발로 123</p>
          </div>
        </section>
      </main>
    </div>
  );
}

export default About; 