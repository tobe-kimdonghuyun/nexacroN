@echo off
setlocal

set "ROOT=%~dp0.."

for %%F in (deploy deploy_engine output nexacrolib) do (
    if exist "%ROOT%\%%F" (
        echo [INFO] Deleting: %ROOT%\%%F
        rd /s /q "%ROOT%\%%F"
        if errorlevel 1 (
            echo [WARN] Failed to delete: %%F
        ) else (
            echo [INFO] Deleted: %%F
        )
    ) else (
        echo [SKIP] Not found: %%F
    )
)

echo.
echo [DONE] Cleanup complete.
endlocal
