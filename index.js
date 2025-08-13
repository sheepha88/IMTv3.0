const express = require('express');
const { chromium } = require('playwright');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// 미들웨어 설정
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.static('public'));

// PDF 저장 디렉토리 생성
const pdfDir = path.join(__dirname, 'pdfs');
if (!fs.existsSync(pdfDir)) {
  fs.mkdirSync(pdfDir);
}

// HTML을 PDF로 변환하는 함수
async function convertHtmlToPdf(htmlContent, options = {}) {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  
  try {
    // HTML 콘텐츠 설정
    await page.setContent(htmlContent, { waitUntil: 'networkidle' });
    
    // PDF 생성 옵션 설정
    const pdfOptions = {
      format: options.format || 'A4',
      printBackground: options.printBackground !== false,
      margin: options.margin || {
        top: '1cm',
        right: '1cm',
        bottom: '1cm',
        left: '1cm'
      },
      ...options
    };
    
    // PDF 생성
    const pdfBuffer = await page.pdf(pdfOptions);
    
    return pdfBuffer;
  } finally {
    await browser.close();
  }
}

// HTML을 PDF로 변환하는 API 엔드포인트
app.post('/convert', async (req, res) => {
  try {
    const { html, options = {} } = req.body;
    
    if (!html) {
      return res.status(400).json({ error: 'HTML 콘텐츠가 필요합니다.' });
    }
    
    console.log('PDF 변환 시작...');
    const pdfBuffer = await convertHtmlToPdf(html, options);
    
    // 고유한 파일명 생성
    const timestamp = Date.now();
    const filename = `converted_${timestamp}.pdf`;
    const filepath = path.join(pdfDir, filename);
    
    // PDF 파일 저장
    fs.writeFileSync(filepath, pdfBuffer);
    
    console.log(`PDF 생성 완료: ${filename}`);
    
    res.json({
      success: true,
      message: 'PDF 변환이 완료되었습니다.',
      filename: filename,
      filepath: filepath,
      size: pdfBuffer.length
    });
    
  } catch (error) {
    console.error('PDF 변환 오류:', error);
    res.status(500).json({
      error: 'PDF 변환 중 오류가 발생했습니다.',
      details: error.message
    });
  }
});

// 생성된 PDF 파일 다운로드
app.get('/download/:filename', (req, res) => {
  const filename = req.params.filename;
  const filepath = path.join(pdfDir, filename);
  
  if (fs.existsSync(filepath)) {
    res.download(filepath, filename, (err) => {
      if (err) {
        res.status(500).json({ error: '파일 다운로드 중 오류가 발생했습니다.' });
      }
    });
  } else {
    res.status(404).json({ error: '파일을 찾을 수 없습니다.' });
  }
});

// 생성된 PDF 파일 목록 조회
app.get('/files', (req, res) => {
  try {
    const files = fs.readdirSync(pdfDir)
      .filter(file => file.endsWith('.pdf'))
      .map(file => {
        const filepath = path.join(pdfDir, file);
        const stats = fs.statSync(filepath);
        return {
          filename: file,
          size: stats.size,
          created: stats.birthtime
        };
      });
    
    res.json({ files });
  } catch (error) {
    res.status(500).json({ error: '파일 목록 조회 중 오류가 발생했습니다.' });
  }
});

// 서버 시작
app.listen(PORT, () => {
  console.log(`서버가 포트 ${PORT}에서 실행 중입니다.`);
  console.log(`http://localhost:${PORT}`);
});

