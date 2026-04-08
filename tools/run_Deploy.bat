@echo off
setlocal enabledelayedexpansion

set SCRIPT_DIR=%~dp0
set CONFIG_FILE=%SCRIPT_DIR%deploy_config.txt
set START_BAT=D:\git_prj\nexacroN\Jar\bin\start.bat

rem --- 1. Check deploy_config.txt exists ---
if not exist "%CONFIG_FILE%" (
    echo [ERROR] deploy_config.txt not found: %CONFIG_FILE%
    pause
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
    pause
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
    pause
    exit /b 1
)

:java_found
echo [INFO] JAVA_HOME: %JAVA_HOME%

rem --- 6. Check start.bat exists ---
if not exist "%START_BAT%" (
    echo [ERROR] start.bat not found: %START_BAT%
    pause
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

rem --- 12. Compress deploy_engine subfolders into deploy_engine.zip ---
set "ZIP_OUT=%ENGINE_DIR%\deploy_engine.zip"
for %%Z in ("%ZIP_OUT%") do set "ZIP_OUT=%%~fZ"

echo.
echo [INFO] Compressing deploy_engine to: %ZIP_OUT%
if exist "%ZIP_OUT%" del /q "%ZIP_OUT%"

powershell -NoProfile -ExecutionPolicy Bypass -Command ^
    "Compress-Archive -Path '%ENGINE_DIR%\*' -DestinationPath '%ZIP_OUT%'"
if errorlevel 1 (
    echo [WARN] Failed to create deploy_engine.zip
) else (
    echo [INFO] deploy_engine.zip created: %ZIP_OUT%
)

endlocal
