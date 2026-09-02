@echo off
if "%~1"=="" (
  echo Arraste o arquivo de backup .json do CardDex para cima deste arquivo.
  pause
  exit /b 1
)
copy /Y "%~1" "%~dp0collection.json" >nul
echo Colecao publica atualizada. Agora abra o GitHub Desktop, faca commit e Publish.
pause
