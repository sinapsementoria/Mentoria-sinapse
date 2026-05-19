@echo off
cd /d "%~dp0"
echo Iniciando servidor local da Nexus Provas...
echo.
echo Por favor, acesse o seguinte endereco no seu navegador Chrome:
echo http://localhost:8000/src/pages/nexus_provas.html
echo.
python -m http.server 8000
pause
