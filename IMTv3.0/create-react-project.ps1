# React 프로젝트 생성 스크립트
param(
    [Parameter(Mandatory=$true)]
    [string]$ProjectName,
    
    [Parameter(Mandatory=$false)]
    [switch]$UseVite,
    
    [Parameter(Mandatory=$false)]
    [switch]$TypeScript
)

Write-Host "🚀 React 프로젝트 생성 중..." -ForegroundColor Green

if ($UseVite) {
    # Vite 사용
    if ($TypeScript) {
        Write-Host "📦 Vite + React + TypeScript 프로젝트 생성 중..." -ForegroundColor Yellow
        npm create vite@latest $ProjectName -- --template react-ts
    } else {
        Write-Host "📦 Vite + React 프로젝트 생성 중..." -ForegroundColor Yellow
        npm create vite@latest $ProjectName -- --template react
    }
} else {
    # Create React App 사용
    if ($TypeScript) {
        Write-Host "📦 Create React App + TypeScript 프로젝트 생성 중..." -ForegroundColor Yellow
        npx create-react-app $ProjectName --template typescript
    } else {
        Write-Host "📦 Create React App 프로젝트 생성 중..." -ForegroundColor Yellow
        npx create-react-app $ProjectName
    }
}

Write-Host "✅ 프로젝트 생성 완료!" -ForegroundColor Green
Write-Host "📁 프로젝트 폴더: $ProjectName" -ForegroundColor Cyan
Write-Host "🔧 다음 명령어로 개발 서버를 시작하세요:" -ForegroundColor Yellow

if ($UseVite) {
    Write-Host "   cd $ProjectName" -ForegroundColor White
    Write-Host "   npm install" -ForegroundColor White
    Write-Host "   npm run dev" -ForegroundColor White
} else {
    Write-Host "   cd $ProjectName" -ForegroundColor White
    Write-Host "   npm start" -ForegroundColor White
} 