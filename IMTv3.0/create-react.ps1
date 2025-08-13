# React 프로젝트 생성 PowerShell 스크립트
param(
    [Parameter(Mandatory=$true)]
    [string]$ProjectName
)

Write-Host "🚀 IMT React 프로젝트 생성 중..." -ForegroundColor Green

# 현재 스크립트 위치
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$TemplateDir = Join-Path $ScriptDir "template"
$TargetDir = Join-Path (Get-Location) $ProjectName

# 디렉토리 복사 함수
function Copy-Directory {
    param($Source, $Destination)
    
    if (!(Test-Path $Destination)) {
        New-Item -ItemType Directory -Path $Destination -Force | Out-Null
    }
    
    Get-ChildItem -Path $Source -Recurse | ForEach-Object {
        $TargetPath = $_.FullName.Replace($Source, $Destination)
        
        if ($_.PSIsContainer) {
            if (!(Test-Path $TargetPath)) {
                New-Item -ItemType Directory -Path $TargetPath -Force | Out-Null
            }
        } else {
            Copy-Item $_.FullName -Destination $TargetPath -Force
        }
    }
}

try {
    # 템플릿 복사
    Copy-Directory -Source $TemplateDir -Destination $TargetDir
    
    # package.json 수정
    $PackagePath = Join-Path $TargetDir "package.json"
    if (Test-Path $PackagePath) {
        $PackageContent = Get-Content $PackagePath -Raw -Encoding UTF8
        $PackageContent = $PackageContent -replace '"name": "update_history"', "`"name`": `"$ProjectName`""
        Set-Content -Path $PackagePath -Value $PackageContent -Encoding UTF8
    }
    
    Write-Host "✅ 프로젝트 생성 완료!" -ForegroundColor Green
    Write-Host "📁 프로젝트 폴더: $ProjectName" -ForegroundColor Cyan
    Write-Host "🔧 다음 명령어로 개발 서버를 시작하세요:" -ForegroundColor Yellow
    Write-Host "   cd $ProjectName" -ForegroundColor White
    Write-Host "   npm install" -ForegroundColor White
    Write-Host "   npm start" -ForegroundColor White
    
} catch {
    Write-Host "❌ 프로젝트 생성 실패: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
} 