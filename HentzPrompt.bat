@echo off
chcp 65001 >nul
title HentzPrompt
cd /d "%~dp0"

where node >nul 2>nul
if errorlevel 1 (
  echo [HentzPrompt] Node.js nao encontrado. Instale em https://nodejs.org (versao 20 ou superior^) e execute novamente.
  pause
  exit /b 1
)

if not exist "node_modules\" (
  echo [HentzPrompt] Instalando dependencias (apenas na primeira vez^)...
  call npm install
  if errorlevel 1 (
    echo [HentzPrompt] Falha ao instalar dependencias.
    pause
    exit /b 1
  )
)

if not exist ".next\BUILD_ID" (
  echo [HentzPrompt] Gerando build de producao...
  call npm run build
  if errorlevel 1 (
    echo [HentzPrompt] Falha no build.
    pause
    exit /b 1
  )
)

echo [HentzPrompt] Iniciando em http://localhost:3000 ...
start "" /b cmd /c "timeout /t 4 >nul & start http://localhost:3000"
call npm run start
pause
