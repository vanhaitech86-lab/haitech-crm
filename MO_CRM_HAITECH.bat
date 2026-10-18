@echo off
chcp 65001 > nul
echo ========================================================
echo   HE THONG HAITECH CRM - AI ALL-IN-ONE OMNICHANNEL
echo ========================================================
echo Dang kiem tra may chu HAITECH CRM tren Port 3005...

netstat -ano | findstr :3005 > nul
if %errorlevel% neq 0 (
    echo [THONG BAO] Dang khoi dong may chu CRM Port 3005...
    start /b npx next start -p 3005
    timeout /t 5 /nobreak > nul
)

echo [OK] Dang mo trinh duyet HAITECH CRM...
start http://localhost:3005
