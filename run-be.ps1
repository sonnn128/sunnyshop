# Script chạy API Server trên Windows PowerShell
$PSScriptRoot = Split-Path -Parent -MyInvocation.MyCommand.Definition
Set-Location "$PSScriptRoot\api-server"

Write-Host "Đang build project..." -ForegroundColor Cyan
mvn clean install -DskipTests

if ($LASTEXITCODE -eq 0) {
    Write-Host "Build thành công! Đang khởi động API Server..." -ForegroundColor Green
    java -jar ./target/trendwearshop-0.0.1-SNAPSHOT.jar
} else {
    Write-Host "Build thất bại!" -ForegroundColor Red
    exit 1
}
