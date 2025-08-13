const fs = require('fs');
const path = require('path');

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
  if (fs.existsSync(packagePath)) {
    let packageContent = fs.readFileSync(packagePath, 'utf8');
    packageContent = packageContent.replace(/"name": "update_history"/, `"name": "${projectName}"`);
    fs.writeFileSync(packagePath, packageContent);
  }
  
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
