@echo off
setlocal
set "BRANCH=%~1"
if "%BRANCH%"=="" set /p BRANCH="branch 명을 입력하세요: "
if "%BRANCH%"=="" echo [ERROR] No branch name provided. & pause & exit /b 1

set "SOURCE_DIR=E:\git\Antigravity_WORK800\WORK800"
set "FRAMEWORK_SRC=%SOURCE_DIR%\Lib\FrameworkJS"
set "PROJECT_ROOT=%~dp0.."
set "DEST_DIR=%PROJECT_ROOT%\nexacrolib\nexacrolib"
set "GENERATERULE_SRC1=%SOURCE_DIR%\Tools\Lib\TiMetainfoLib\res"
set "GENERATERULE_SRC2=%SOURCE_DIR%\Tools\Lib\TiGenerateLib\Template\24"
set "GENERATERULE_DEST=%PROJECT_ROOT%\nexacrolib\generate"

echo [1/3] Updating source repository: %SOURCE_DIR% (Branch: %BRANCH%) ...
pushd "%SOURCE_DIR%"
git checkout %BRANCH%
if %ERRORLEVEL% neq 0 echo [ERROR] Failed to checkout branch: %BRANCH% & popd & pause & exit /b %ERRORLEVEL%


git pull origin %BRANCH%
if %ERRORLEVEL% neq 0 echo [ERROR] Git pull failed for branch: %BRANCH% & popd & pause & exit /b %ERRORLEVEL%
for /f %%H in ('git rev-parse HEAD') do set "COMMIT_HASH=%%H"
popd

echo [2/3] Copying framework to %DEST_DIR% ...
if not exist "%DEST_DIR%" mkdir "%DEST_DIR%"

set COPY_OK=1

for %%F in (component framework resources) do (
    if exist "%DEST_DIR%\%%F" rd /s /q "%DEST_DIR%\%%F"
    xcopy "%FRAMEWORK_SRC%\%%F" "%DEST_DIR%\%%F" /E /I /Y
    if errorlevel 1 (
        echo [ERROR] Failed to copy folder: %%F
        set COPY_OK=0
    )
)

if exist "%DEST_DIR%\nexacrolib.json" del /q "%DEST_DIR%\nexacrolib.json"
copy /Y "%FRAMEWORK_SRC%\nexacrolib.json" "%DEST_DIR%\nexacrolib.json"
if errorlevel 1 (
    echo [ERROR] Failed to copy nexacrolib.json
    set COPY_OK=0
)

echo [3/3] Converting JS files in %DEST_DIR% to UTF-8 BOM ...
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0convert_utf8bom.ps1" -TargetDir "%DEST_DIR%"
if errorlevel 1 (
    echo [ERROR] Failed to convert JS file encoding.
    set COPY_OK=0
)

echo [4/4] Copying generate rules to %GENERATERULE_DEST% ...
if exist "%GENERATERULE_DEST%" rd /s /q "%GENERATERULE_DEST%"
mkdir "%GENERATERULE_DEST%"

xcopy "%GENERATERULE_SRC1%\*" "%GENERATERULE_DEST%" /Y
if errorlevel 1 (
    echo [ERROR] Failed to copy from TiMetainfoLib\res
    set COPY_OK=0
)

xcopy "%GENERATERULE_SRC2%\*" "%GENERATERULE_DEST%" /Y
if errorlevel 1 (
    echo [ERROR] Failed to copy from TiGenerateLib\Template\24
    set COPY_OK=0
)

if "%COPY_OK%"=="1" (
    echo [SUCCESS] All steps completed successfully [%BRANCH% branch, %COMMIT_HASH%].
) else (
    echo [ERROR] Some steps failed. & pause
)
endlocal
