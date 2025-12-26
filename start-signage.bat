@echo off
cd /d %~dp0

REM Kill previous chrome (optional but recommended)
taskkill /F /IM chrome.exe >nul 2>&1

REM Start python server
start "" python -m http.server 8000
timeout /t 2 >nul

REM Start Chrome with TEMP profile & no cache
start "" chrome ^
  --kiosk ^
  --incognito ^
  --disable-application-cache ^
  --disk-cache-dir="%TEMP%\signage-cache" ^
  --user-data-dir="%TEMP%\signage-profile" ^
  --disable-features=TranslateUI ^
  --enable-features=AutoplayIgnoreWebAudio ^
  --autoplay-policy=no-user-gesture-required ^
  http://localhost:8000
