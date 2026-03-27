@echo off
REM stop_tomcat_apache_tomecat_11.bat - Stop Tomcat 11 from the current CMD/Terminal
setlocal
REM 1. Override JAVA_HOME to Java 21
set "JAVA_HOME=C:\microsoft-jdk-21.0.9-windows-x64\jdk-21.0.9+10"
set "JRE_HOME="

REM 2. Prepend to PATH
set "PATH=%JAVA_HOME%\bin;%PATH%"

REM 3. Set CATALINA_HOME to Tomcat 11.0.20
set "CATALINA_HOME=%~dp0..\apache-tomcat-11.0.20"

echo Stopping Tomcat 11 server...
"%CATALINA_HOME%\bin\shutdown.bat"
echo Tomcat 11 server stopped.

endlocal
exit /b %ERRORLEVEL%
