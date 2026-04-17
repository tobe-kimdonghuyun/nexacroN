@echo off
setlocal enabledelayedexpansion

set SCRIPT_DIR=%~dp0
set CONFIG_FILE=%SCRIPT_DIR%deploy_config.txt
set START_BAT=D:\git_prj\nexacroN\Jar\bin\start.bat

rem --- 1. Check deploy_config.txt exists ---
if not exist "%CONFIG_FILE%" (
    echo [ERROR] deploy_config.txt not found: %CONFIG_FILE%
    exit /b 1
)

rem --- 2. Parse deploy_config.txt ---
for /f "usebackq tokens=1,* delims==" %%A in ("%CONFIG_FILE%") do (
    set "_K=%%A"
    set "_V=%%B"
    set "_K=!_K: =!"
    if /i "!_K!"=="ProjectPath"    set "ProjectPath=!_V!"
    if /i "!_K!"=="OutputPath"     set "OutputPath=!_V!"
    if /i "!_K!"=="DeployPath"     set "DeployPath=!_V!"
    if /i "!_K!"=="NexacroLibPath" set "NexacroLibPath=!_V!"
    if /i "!_K!"=="GenerateRule"   set "GenerateRule=!_V!"
    if /i "!_K!"=="-MERGE"         set "OPT_MERGE=1"
    if /i "!_K!"=="-COMPRESS"      set "OPT_COMPRESS=1"
    if /i "!_K!"=="-SHRINK"        set "OPT_SHRINK=1"
)

rem --- 3. Check required fields ---
set MISSING=
if not defined ProjectPath    set "MISSING=!MISSING! ProjectPath"
if not defined OutputPath     set "MISSING=!MISSING! OutputPath"
if not defined DeployPath     set "MISSING=!MISSING! DeployPath"
if not defined NexacroLibPath set "MISSING=!MISSING! NexacroLibPath"
if not defined GenerateRule   set "MISSING=!MISSING! GenerateRule"

if defined MISSING (
    echo [ERROR] Missing fields in deploy_config.txt:!MISSING!
    exit /b 1
)

rem --- 4. Clean and recreate OutputPath / DeployPath ---
for %%F in ("%OutputPath%" "%DeployPath%") do (
    if exist %%F (
        echo [INFO] Deleting: %%~F
        rd /s /q %%F
    )
    echo [INFO] Creating: %%~F
    md %%F
)

rem --- 5. Find JAVA_HOME if not set ---
if "%JAVA_HOME%"=="" (
    echo [INFO] JAVA_HOME not set. Searching...

    rem Priority 1: Known fixed path
    if exist "C:\microsoft-jdk-21.0.9-windows-x64\jdk-21.0.9+10\bin\java.exe" (
        set "JAVA_HOME=C:\microsoft-jdk-21.0.9-windows-x64\jdk-21.0.9+10"
        goto java_found
    )

    rem Priority 2: Registry JDK (Java 9+)
    for /f "tokens=2*" %%A in ('reg query "HKLM\SOFTWARE\JavaSoft\JDK" /v CurrentVersion 2^>nul') do set "_JDK_VER=%%B"
    if defined _JDK_VER (
        for /f "tokens=2*" %%A in ('reg query "HKLM\SOFTWARE\JavaSoft\JDK\!_JDK_VER!" /v JavaHome 2^>nul') do set "JAVA_HOME=%%B"
    )
    if not "%JAVA_HOME%"=="" goto java_found

    rem Priority 3: Registry JRE (Java 8)
    for /f "tokens=2*" %%A in ('reg query "HKLM\SOFTWARE\JavaSoft\Java Runtime Environment" /v CurrentVersion 2^>nul') do set "_JRE_VER=%%B"
    if defined _JRE_VER (
        for /f "tokens=2*" %%A in ('reg query "HKLM\SOFTWARE\JavaSoft\Java Runtime Environment\!_JRE_VER!" /v JavaHome 2^>nul') do set "JAVA_HOME=%%B"
    )
    if not "%JAVA_HOME%"=="" goto java_found

    rem Priority 4: Detect from PATH
    for /f "delims=" %%A in ('where java 2^>nul') do (
        if "!JAVA_HOME!"=="" (
            for %%B in ("%%A\..\..") do set "JAVA_HOME=%%~fB"
        )
    )
    if not "%JAVA_HOME%"=="" goto java_found

    echo [ERROR] JAVA_HOME not found. Please set JAVA_HOME and retry.
    exit /b 1
)

:java_found
echo [INFO] JAVA_HOME: %JAVA_HOME%

rem --- 6. Check start.bat exists ---
if not exist "%START_BAT%" (
    echo [ERROR] start.bat not found: %START_BAT%
    exit /b 1
)

rem --- 7. Build command ---
set "DEPLOY_CMD=%START_BAT% -P "%ProjectPath%" -B "%NexacroLibPath%" -O "%OutputPath%" -GENERATERULE "%GenerateRule%" -D "%DeployPath%""

if defined OPT_MERGE    set "DEPLOY_CMD=!DEPLOY_CMD! -MERGE"
if defined OPT_COMPRESS set "DEPLOY_CMD=!DEPLOY_CMD! -COMPRESS"
if defined OPT_SHRINK   set "DEPLOY_CMD=!DEPLOY_CMD! -SHRINK"

echo.
echo [INFO] Command:
echo        !DEPLOY_CMD!
echo.

rem --- 8. Run (cd to start.bat dir so relative paths resolve correctly) ---
pushd "%~dp0..\Jar\bin"
call !DEPLOY_CMD!
popd

rem --- 9. Post-deploy: copy nexacrolib and GenerateRule to deploy_engine ---
for %%F in ("%~dp0..") do set "ENGINE_DIR=%%~fF\deploy_engine"

echo.
echo [INFO] Creating deploy_engine: %ENGINE_DIR%
if exist "%ENGINE_DIR%" rd /s /q "%ENGINE_DIR%"
mkdir "%ENGINE_DIR%"

echo [INFO] Copying nexacrolib to deploy_engine ...
xcopy "%DeployPath%\nexacrolib" "%ENGINE_DIR%\nexacrolib" /E /I /Y /Q
if errorlevel 1 echo [WARN] nexacrolib copy may have failed.

echo [INFO] Copying GenerateRule to deploy_engine ...
for %%G in ("%GenerateRule%") do set "GR_NAME=%%~nxG"
xcopy "%GenerateRule%" "%ENGINE_DIR%\!GR_NAME!" /E /I /Y /Q
if errorlevel 1 echo [WARN] GenerateRule copy may have failed.

echo [INFO] deploy_engine ready: %ENGINE_DIR%

rem --- 10. Copy component JSON files and subfolders from nexacrolib source ---
set "COMP_SRC=%~dp0..\nexacrolib\nexacrolib\component"
set "COMP_DEST=%ENGINE_DIR%\nexacrolib\component"

echo [INFO] Copying component JSON files to deploy_engine ...
xcopy "%COMP_SRC%\*.json" "%COMP_DEST%\" /Y /Q
if errorlevel 1 echo [WARN] component JSON copy may have failed.

echo [INFO] Copying component subfolders to deploy_engine ...
for %%D in (ComComp CompBase CompBaseEx DesignComp DeviceAPI Graphics Grid ListView MobileComp Push XAgent) do (
    if exist "%COMP_SRC%\%%D" (
        set "HAS_SUB=0"
        for /d %%S in ("%COMP_SRC%\%%D\*") do (
            set "HAS_SUB=1"
            xcopy "%%S" "%COMP_DEST%\%%D\%%~nxS" /E /I /Y /Q
            if errorlevel 1 echo [WARN] Failed to copy: %%D\%%~nxS
        )
        if "!HAS_SUB!"=="0" echo [INFO] No subfolders in %%D, skipping.
    ) else (
        echo [INFO] %%D not found, skipping.
    )
)

echo [INFO] Component copy complete.

rem --- 10-1. Replace *.json with *.min.json in component folder ---
rem    규칙: *.min.json 이 존재하면 기존 *.json 삭제 후 *.min.json -> *.json 으로 이름 변경
echo [INFO] Replacing *.json with *.min.json in component folder ...
set "MIN_COUNT=0"
if not exist "%COMP_DEST%\" (
    echo [WARN]   COMP_DEST not found, skipping min.json replacement.
    goto :skip_min_replace
)
pushd "%COMP_DEST%"
for /f "usebackq delims=" %%M in (`dir /b /s /a-d "*.min.json" 2^>nul`) do (
    set "_MINNAME=%%~nM"
    set "_BASE=!_MINNAME:~0,-4!"
    set "_PARENTDIR=%%~dpM"
    if exist "!_PARENTDIR!!_BASE!.json" (
        del /q "!_PARENTDIR!!_BASE!.json"
        echo [INFO]   Deleted  : !_BASE!.json
    )
    ren "%%~fM" "!_BASE!.json"
    echo [INFO]   Renamed  : %%~nxM -^> !_BASE!.json
    set /a MIN_COUNT+=1
)
popd
:skip_min_replace
if !MIN_COUNT!==0 (
    echo [INFO]   No *.min.json files found, skipping.
) else (
    echo [INFO]   Replaced !MIN_COUNT! files.
)

rem --- 10-2. Copy nexacrolib.json to deploy_engine\nexacrolib ---
set "NEXLIB_JSON_SRC=%~dp0..\nexacrolib\nexacrolib\nexacrolib.json"
set "NEXLIB_JSON_DEST=%ENGINE_DIR%\nexacrolib\nexacrolib.json"

echo [INFO] Copying nexacrolib.json to deploy_engine ...
if exist "%NEXLIB_JSON_SRC%" (
    copy /Y "%NEXLIB_JSON_SRC%" "%NEXLIB_JSON_DEST%" >nul
    if errorlevel 1 (
        echo [WARN] Failed to copy nexacrolib.json
    ) else (
        echo [INFO] nexacrolib.json ready: %NEXLIB_JSON_DEST%
    )
) else (
    echo [WARN] nexacrolib.json not found: %NEXLIB_JSON_SRC%
)

rem --- 10-3. Copy DesignComp folder to deploy_engine\nexacrolib ---
set "DESIGNCOMP_SRC=%~dp0..\nexacrolib\nexacrolib\component\DesignComp"
set "DESIGNCOMP_DEST=%ENGINE_DIR%\nexacrolib\component\DesignComp"

echo [INFO] Copying DesignComp to deploy_engine ...
if exist "%DESIGNCOMP_SRC%\" (
    xcopy "%DESIGNCOMP_SRC%" "%DESIGNCOMP_DEST%" /E /I /Y /Q
    if errorlevel 1 (
        echo [WARN] Failed to copy DesignComp folder.
    ) else (
        echo [INFO] DesignComp ready: %DESIGNCOMP_DEST%
    )
) else (
    echo [WARN] DesignComp not found: %DESIGNCOMP_SRC%
)

rem --- 10-4. Copy Resource.json to deploy_engine\nexacrolib\resources ---
set "RESOURCE_JSON_SRC=%~dp0..\nexacrolib\nexacrolib\resources\Resource.json"
set "RESOURCE_JSON_DEST=%ENGINE_DIR%\nexacrolib\resources\Resource.json"

echo [INFO] Copying Resource.json to deploy_engine ...
if exist "%RESOURCE_JSON_SRC%" (
    if not exist "%ENGINE_DIR%\nexacrolib\resources\" mkdir "%ENGINE_DIR%\nexacrolib\resources"
    copy /Y "%RESOURCE_JSON_SRC%" "%RESOURCE_JSON_DEST%" >nul
    if errorlevel 1 (
        echo [WARN] Failed to copy Resource.json
    ) else (
        echo [INFO] Resource.json ready: %RESOURCE_JSON_DEST%
    )
) else (
    echo [WARN] Resource.json not found: %RESOURCE_JSON_SRC%
)

rem --- 11. Copy Framework.min.json as Framework.json and metainfo folder ---
set "FW_SRC=%~dp0..\nexacrolib\nexacrolib\framework"
set "FW_DEST=%ENGINE_DIR%\nexacrolib\framework"

echo [INFO] Copying Framework.min.json as Framework.json ...
copy /Y "%FW_SRC%\Framework.min.json" "%FW_DEST%\Framework.json" >nul
if errorlevel 1 (
    echo [WARN] Failed to copy Framework.min.json
) else (
    echo [INFO] Framework.json ready: %FW_DEST%\Framework.json
)

echo [INFO] Copying framework\metainfo folder ...
xcopy "%FW_SRC%\metainfo" "%FW_DEST%\metainfo" /E /I /Y /Q
if errorlevel 1 (
    echo [WARN] Failed to copy metainfo folder
) else (
    echo [INFO] metainfo ready: %FW_DEST%\metainfo
)

rem --- 12. Replace "version": "21.0.0.9999" -> "24.0.0.9999" in all JSON files under deploy_engine\nexacrolib ---
echo.
echo [INFO] Replacing version string in JSON files under %ENGINE_DIR%\nexacrolib ...
set "VER_COUNT=0"
for /f "usebackq delims=" %%J in (`dir /b /s /a-d "%ENGINE_DIR%\nexacrolib\*.json" 2^>nul`) do (
    powershell -NoProfile -ExecutionPolicy Bypass -Command ^
        "(Get-Content '%%J' -Raw) -replace '\"version\"\s*:\s*\"21\.0\.0\.9999\"', '\"version\": \"24.0.0.9999\"' | Set-Content '%%J' -NoNewline"
    if errorlevel 1 (
        echo [WARN] Failed to process: %%J
    ) else (
        set /a VER_COUNT+=1
    )
)
echo [INFO] Version replacement done. Processed !VER_COUNT! file(s).

rem --- 13. Compress deploy_engine subfolders into nexacrolib_merge_compress_shrink.zip ---
set "ZIP_OUT=%ENGINE_DIR%\nexacrolib_Merge_Compress_Shrink.zip"
for %%Z in ("%ZIP_OUT%") do set "ZIP_OUT=%%~fZ"

echo.
echo [INFO] Compressing deploy_engine to: %ZIP_OUT%
if exist "%ZIP_OUT%" del /q "%ZIP_OUT%"

powershell -NoProfile -ExecutionPolicy Bypass -Command ^
    "Compress-Archive -Path '%ENGINE_DIR%\*' -DestinationPath '%ZIP_OUT%'"
if errorlevel 1 (
    echo [WARN] Failed to create nexacrolib_merge_compress_shrink.zip
) else (
    echo [INFO] nexacrolib_merge_compress_shrink.zip created: %ZIP_OUT%
)

endlocal
