@echo off
REM start_tomcat.bat - Start Tomcat in the current CMD/Terminal (no new window)
REM Update the paths below if your Tomcat or JDK are installed elsewhere.

setlocal
call "%~dp0env.bat"
REM Try to use UTF-8 output in the terminal
chcp 65001 >nul

echo Starting Tomcat server in this terminal...
"%CATALINA_HOME%\bin\catalina.bat" run

endlocal
exit /b %ERRORLEVEL%
