@echo off
chcp 65001 > nul
setlocal enabledelayedexpansion
set "BRANCH="
set "OPT_IGNORE=0"
set "OPT_VERSION="
set "OPT_HELP=0"
:parse_args
if "%~1"=="" goto done_args
if /i "%~1"=="-help"    ( set "OPT_HELP=1"              & shift & goto parse_args )
if /i "%~1"=="-ignore"  ( set "OPT_IGNORE=1"            & shift & goto parse_args )
if /i "%~1"=="-version" ( set "OPT_VERSION=%~2"         & shift & shift & goto parse_args )
if "!BRANCH!"==""       ( set "BRANCH=%~1"              & shift & goto parse_args )
shift & goto parse_args
:done_args

if "!OPT_HELP!"=="1" goto :show_help

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
for /f "usebackq delims=" %%M in (`git log -1 --pretty^=format:%%s`) do set "COMMIT_MSG=%%M"
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

if "!OPT_VERSION!"=="" goto :skip_ver_upd
echo [INFO] Updating version to !OPT_VERSION! in JSON files...
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0update_version.ps1" -TargetDir "!DEST_DIR!" -Version "!OPT_VERSION!"
if errorlevel 1 ( echo [ERROR] Failed to update version in JSON files & set COPY_OK=0 )
:skip_ver_upd

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

rem --- [5/5] Compress nexacrolib and generate folders ---
if "!OPT_IGNORE!"=="1" (
    echo.
    echo [5/5] Skipping zip creation (-ignore option set^).
) else (
    rem nexacrolib.json 에서 version 값 읽기
    set "JSON_VER="
    for /f "usebackq delims=" %%V in (`powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0get_version.ps1" -JsonFile "!DEST_DIR!\nexacrolib.json"`) do set "JSON_VER=%%V"

    if "!JSON_VER!"=="" (
        set "ZIP_OUT=!PROJECT_ROOT!\nexacrolib\nexacrolib_noMerge_noCompress_noShrink.zip"
    ) else (
        set "ZIP_OUT=!PROJECT_ROOT!\nexacrolib\nexacrolib_noMerge_noCompress_noShrink(!JSON_VER!).zip"
    )

    echo.
    echo [5/5] Compressing nexacrolib and generate folders ...
    echo        Target: !ZIP_OUT!
    if exist "!ZIP_OUT!" del /q "!ZIP_OUT!"

    powershell -NoProfile -ExecutionPolicy Bypass -Command "Compress-Archive -Path '!PROJECT_ROOT!\nexacrolib\nexacrolib', '!PROJECT_ROOT!\nexacrolib\generate' -DestinationPath '!ZIP_OUT!'"
    if errorlevel 1 (
        echo [WARN] Failed to create zip
        set COPY_OK=0
    ) else (
        echo [INFO] zip created: !ZIP_OUT!
    )
)

if "%COPY_OK%"=="1" (
    echo [SUCCESS] All steps completed successfully.
    echo          Branch  : %BRANCH%
    echo          Hash    : %COMMIT_HASH%
    echo          Message : !COMMIT_MSG!
    if not "!OPT_VERSION!"=="" echo          Version : !OPT_VERSION!
) else (
    echo [ERROR] Some steps failed. & pause
)
endlocal
goto :eof

rem ============================================================
:show_help
echo.
echo  사용법:
echo    update_framework.bat ^<branch^> [옵션...]
echo    update_framework.bat -help
echo.
echo  설명:
echo    소스 저장소에서 지정한 브랜치를 pull 하여 Nexacro 프레임워크 파일을
echo    로컬 nexacrolib 폴더에 복사하고, 선택적으로 버전 변경 및 zip 압축을
echo    수행하는 배포 준비 스크립트입니다.
echo.
echo  인자:
echo    ^<branch^>             소스 저장소 브랜치명 (필수)
echo                         생략 시 실행 중 입력 요청
echo.
echo  옵션:
echo    -version ^<값^>        nexacrolib 하위 모든 .json 파일의 "version" 값 변경
echo                         예: -version "24.0.0.1031"
echo.
echo    -ignore              zip 파일 생성 단계 [5/5] 를 건너뜁니다.
echo.
echo    -help                이 도움말을 출력합니다.
echo                         다른 옵션과 함께 사용해도 도움말만 출력됩니다.
echo.
echo  실행 단계:
echo    [1/5] 소스 저장소 git checkout + pull
echo    [2/5] 프레임워크 파일 복사
echo           component / framework / resources / nexacrolib.json
echo    [ver] (옵션) nexacrolib 하위 모든 .json 파일의 version 값 변경
echo    [3/5] JS 파일 UTF-8 BOM 변환
echo    [4/5] Generate Rule 복사
echo    [5/5] zip 압축 (-ignore 시 생략)
echo           nexacrolib_noMerge_noCompress_noShrink(버전).zip
echo.
echo  사용 예:
echo    update_framework.bat main
echo    update_framework.bat main -version "24.0.0.1031"
echo    update_framework.bat main -ignore
echo    update_framework.bat main -version "24.0.0.1031" -ignore
echo    update_framework.bat -help
echo.
endlocal
goto :eof
