@echo off
REM start_tomcat_apache_tomecat_11.bat - Start Tomcat 11 in the current CMD/Terminal (no new window)
REM Update the paths below if your Tomcat or JDK are installed elsewhere.

setlocal
REM 1. Override JAVA_HOME to Java 21
set "JAVA_HOME=C:\microsoft-jdk-21.0.9-windows-x64\jdk-21.0.9+10"
set "JRE_HOME="

REM 2. Prepend to PATH
set "PATH=%JAVA_HOME%\bin;%PATH%"

REM 3. Set CATALINA_HOME to Tomcat 11.0.20
set "CATALINA_HOME=%~dp0..\apache-tomcat-11.0.20"
REM Try to use UTF-8 output in the terminal
chcp 65001 >nul

echo Starting Tomcat 11 server in this terminal...
"%CATALINA_HOME%\bin\catalina.bat" run

endlocal
exit /b %ERRORLEVEL%
