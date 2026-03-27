@echo off
REM stop_tomcat.bat - Stop Tomcat from the current CMD/Terminal
setlocal
call "%~dp0env.bat"

echo Stopping Tomcat server...
"%CATALINA_HOME%\bin\shutdown.bat"
echo Tomcat server stopped.

endlocal
exit /b %ERRORLEVEL%
