@echo off
setlocal
set "BRANCH=%~1"
if "%BRANCH%"=="" set /p BRANCH="branch 명을 입력하세요: "
if "%BRANCH%"=="" echo [ERROR] No branch name provided. & pause & exit /b 1

set "SOURCE_DIR=E:\git\Antigravity_WORK800\WORK800"
set "FRAMEWORK_SRC=%SOURCE_DIR%\Lib\FrameworkJS"
set "PROJECT_ROOT=%~dp0.."
set "DEST_DIR=%PROJECT_ROOT%\FrameworkJS"

echo [1/2] Updating source repository: %SOURCE_DIR% (Branch: %BRANCH%) ...
pushd "%SOURCE_DIR%"
git checkout %BRANCH%
if %ERRORLEVEL% neq 0 echo [ERROR] Failed to checkout branch: %BRANCH% & popd & pause & exit /b %ERRORLEVEL%

git pull origin %BRANCH%
if %ERRORLEVEL% neq 0 echo [ERROR] Git pull failed for branch: %BRANCH% & popd & pause & exit /b %ERRORLEVEL%
popd

echo [2/2] Copying framework to %DEST_DIR% ...
if exist "%DEST_DIR%" rd /s /q "%DEST_DIR%"
xcopy "%FRAMEWORK_SRC%" "%DEST_DIR%" /E /I /Y

REM Check status after copy
if %ERRORLEVEL% equ 0 (
    echo [SUCCESS] Update and Copy completed successfully [%BRANCH% branch].
) else (
    echo [ERROR] Folder copy failed. & pause
)
endlocal
