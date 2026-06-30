@echo off
chcp 65001 >nul
echo ========================================================
echo VB.NET 컴파일러를 사용하여 웹 컴포넌트 프로그램 빌드를 시작합니다.
echo ========================================================

set COMPILER=C:\Windows\Microsoft.NET\Framework64\v4.0.30319\vbc.exe

if not exist "%COMPILER%" (
    echo [에러] vbc.exe 컴파일러를 찾을 수 없습니다.
    exit /b 1
)

echo [1/2] IE 웹 컴포넌트 프로그램 빌드 중... (IE_WebComponent.exe)
"%COMPILER%" /target:winexe /out:IE_WebComponent.exe IE_WebForm.vb
if %ERRORLEVEL% equ 0 (
    echo [성공] IE_WebComponent.exe 빌드가 성공적으로 완료되었습니다.
) else (
    echo [실패] IE_WebComponent.exe 빌드 중 에러가 발생했습니다.
)

echo.
echo [2/2] Edge 웹 컴포넌트 프로그램 빌드 중... (Edge_WebComponent.exe)
"%COMPILER%" /target:winexe /out:Edge_WebComponent.exe Edge_AppWrapper.vb
if %ERRORLEVEL% equ 0 (
    echo [성공] Edge_WebComponent.exe 빌드가 성공적으로 완료되었습니다.
) else (
    echo [실패] Edge_WebComponent.exe 빌드 중 에러가 발생했습니다.
)

echo ========================================================
echo 빌드 공정이 모두 종료되었습니다.
echo ========================================================
