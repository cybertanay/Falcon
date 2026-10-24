@echo off
title Falcon dev server
cd /d "%~dp0"
if not exist node_modules call npm install
call npm run dev
pause
