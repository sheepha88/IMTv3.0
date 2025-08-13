# 전역 템플릿 설정 스크립트
Write-Host "🌍 전역 템플릿 설정 중..." -ForegroundColor Green

# 1. npm 전역 패키지 생성
Write-Host "📦 npm 전역 패키지 생성 중..." -ForegroundColor Yellow

# package.json 생성
$packageJson = @"
{
  "name": "react-template-imt",
  "version": "1.0.0",
  "description": "IMT React 프로젝트 템플릿",
  "main": "index.js",
  "bin": {
    "create-imt-react": "./bin/create.js"
  },
  "keywords": ["react", "template", "imt"],
  "author": "Your Name",
  "license": "MIT",
  "files": [
    "template/**/*"
  ]
}
"@

# bin 디렉토리 생성
New-Item -ItemType Directory -Path "bin" -Force | Out-Null

# create.js 스크립트 생성
$createScript = @"
#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const projectName = process.argv[2];

if (!projectName) {
  console.error('프로젝트 이름을 입력해주세요.');
  console.error('사용법: create-imt-react <project-name>');
  process.exit(1);
}

const templateDir = path.join(__dirname, '../template');
const targetDir = path.join(process.cwd(), projectName);

// 디렉토리 복사 함수
function copyDir(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  
  const entries = fs.readdirSync(src, { withFileTypes: true });
  
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

try {
  console.log('🚀 IMT React 프로젝트 생성 중...');
  
  // 템플릿 복사
  copyDir(templateDir, targetDir);
  
  // package.json 수정
  const packagePath = path.join(targetDir, 'package.json');
  let packageContent = fs.readFileSync(packagePath, 'utf8');
  packageContent = packageContent.replace(/"name": "update_history"/, `"name": "${projectName}"`);
  fs.writeFileSync(packagePath, packageContent);
  
  console.log('✅ 프로젝트 생성 완료!');
  console.log(`📁 프로젝트 폴더: ${projectName}`);
  console.log('🔧 다음 명령어로 개발 서버를 시작하세요:');
  console.log(`   cd ${projectName}`);
  console.log('   npm install');
  console.log('   npm start');
  
} catch (error) {
  console.error('❌ 프로젝트 생성 실패:', error.message);
  process.exit(1);
}
"@

# 파일들 생성
$packageJson | Out-File -FilePath "package.json" -Encoding UTF8
$createScript | Out-File -FilePath "bin/create.js" -Encoding UTF8

# 실행 권한 설정 (Unix 시스템용)
# chmod +x bin/create.js

Write-Host "✅ 전역 템플릿 설정 완료!" -ForegroundColor Green
Write-Host "📦 npm 패키지 게시 방법:" -ForegroundColor Yellow
Write-Host "   1. npm login" -ForegroundColor White
Write-Host "   2. npm publish" -ForegroundColor White
Write-Host "" -ForegroundColor White
Write-Host "🔧 로컬 설치 방법:" -ForegroundColor Yellow
Write-Host "   npm link" -ForegroundColor White
Write-Host "" -ForegroundColor White
Write-Host "🚀 사용 방법:" -ForegroundColor Yellow
Write-Host "   create-imt-react my-new-project" -ForegroundColor White 