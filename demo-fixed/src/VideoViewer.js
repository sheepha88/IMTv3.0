import React, { useState, useRef, useEffect } from 'react';
import './VideoViewer.css';

function VideoViewer() {
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [comments, setComments] = useState([
    {
      id: 1,
      time: 15.5,
      text: "여기서 중요한 기능이 소개됩니다",
      author: "김개발",
      timestamp: "2024-01-15 14:30",
      color: "#ff6b6b"
    },
    {
      id: 2,
      time: 32.8,
      text: "이 부분은 주의해서 봐야 합니다",
      author: "이리액트",
      timestamp: "2024-01-15 14:35",
      color: "#4ecdc4"
    },
    {
      id: 3,
      time: 45.2,
      text: "새로운 업데이트 기능 설명",
      author: "박서버",
      timestamp: "2024-01-15 14:40",
      color: "#45b7d1"
    }
  ]);
  const [newComment, setNewComment] = useState('');
  const [showCommentForm, setShowCommentForm] = useState(false);
  const videoRef = useRef(null);

  // 비디오 메타데이터 로드
  const handleLoadedMetadata = () => {
    setDuration(videoRef.current.duration);
  };

  // 시간 업데이트
  const handleTimeUpdate = () => {
    setCurrentTime(videoRef.current.currentTime);
  };

  // 재생/일시정지 토글
  const togglePlay = () => {
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  // 볼륨 변경
  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    videoRef.current.volume = newVolume;
  };

  // 시간 이동
  const handleSeek = (e) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    videoRef.current.currentTime = newTime;
  };

  // 주석 추가
  const addComment = () => {
    if (newComment.trim()) {
      const comment = {
        id: comments.length + 1,
        time: currentTime,
        text: newComment,
        author: "사용자",
        timestamp: new Date().toLocaleString('ko-KR'),
        color: `hsl(${Math.random() * 360}, 70%, 60%)`
      };
      setComments([...comments, comment]);
      setNewComment('');
      setShowCommentForm(false);
    }
  };

  // 주석 삭제
  const deleteComment = (id) => {
    setComments(comments.filter(comment => comment.id !== id));
  };

  // 주석으로 이동
  const jumpToComment = (time) => {
    videoRef.current.currentTime = time;
    setCurrentTime(time);
  };

  // 시간 포맷팅
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // 현재 시간에 해당하는 주석들
  const currentComments = comments.filter(comment => 
    Math.abs(comment.time - currentTime) < 2
  );

  return (
    <div className="video-viewer-page">
      <header className="viewer-header">
        <h1>🎥 동영상 뷰어</h1>
        <p>IMT v3.0 시스템 소개 동영상과 실시간 주석 기능을 제공합니다.</p>
      </header>

      <main className="viewer-content">
        <div className="video-container">
          <div className="video-wrapper">
            <video
              ref={videoRef}
              className="main-video"
              onLoadedMetadata={handleLoadedMetadata}
              onTimeUpdate={handleTimeUpdate}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              controls={false}
            >
              <source src="https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4" type="video/mp4" />
              브라우저가 비디오를 지원하지 않습니다.
            </video>

            {/* 현재 주석 표시 */}
            {currentComments.map(comment => (
              <div 
                key={comment.id} 
                className="current-comment"
                style={{ backgroundColor: comment.color }}
              >
                <span className="comment-author">{comment.author}</span>
                <span className="comment-text">{comment.text}</span>
              </div>
            ))}

            {/* 비디오 컨트롤 */}
            <div className="video-controls">
              <button onClick={togglePlay} className="control-button play">
                {isPlaying ? '⏸️' : '▶️'}
              </button>
              
              <div className="time-controls">
                <span className="time-display">{formatTime(currentTime)}</span>
                <input
                  type="range"
                  min="0"
                  max={duration}
                  value={currentTime}
                  onChange={handleSeek}
                  className="time-slider"
                />
                <span className="time-display">{formatTime(duration)}</span>
              </div>

              <div className="volume-controls">
                <span className="volume-icon">🔊</span>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="volume-slider"
                />
              </div>

              <button 
                onClick={() => setShowCommentForm(!showCommentForm)}
                className="control-button comment"
              >
                💬
              </button>
            </div>
          </div>

          {/* 주석 입력 폼 */}
          {showCommentForm && (
            <div className="comment-form">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="현재 시간에 주석을 추가하세요..."
                className="comment-input"
                onKeyPress={(e) => e.key === 'Enter' && addComment()}
              />
              <button onClick={addComment} className="comment-submit">
                추가
              </button>
            </div>
          )}
        </div>

        <div className="comments-panel">
          <h2>💬 주석 목록</h2>
          
          <div className="comments-list">
            {comments
              .sort((a, b) => a.time - b.time)
              .map(comment => (
                <div key={comment.id} className="comment-item">
                  <div className="comment-header">
                    <button 
                      onClick={() => jumpToComment(comment.time)}
                      className="comment-time"
                    >
                      {formatTime(comment.time)}
                    </button>
                    <span className="comment-author">{comment.author}</span>
                    <button 
                      onClick={() => deleteComment(comment.id)}
                      className="comment-delete"
                    >
                      🗑️
                    </button>
                  </div>
                  
                  <div className="comment-content">
                    <span className="comment-text">{comment.text}</span>
                  </div>
                  
                  <div className="comment-footer">
                    <span className="comment-timestamp">{comment.timestamp}</span>
                    <div 
                      className="comment-color-indicator"
                      style={{ backgroundColor: comment.color }}
                    ></div>
                  </div>
                </div>
              ))}
          </div>

          {comments.length === 0 && (
            <div className="no-comments">
              <span className="no-comments-icon">💬</span>
              <p>아직 주석이 없습니다.</p>
              <p>동영상 재생 중에 주석을 추가해보세요!</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default VideoViewer; 