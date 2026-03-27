@echo off
REM env.bat - Project specific environment variables
REM This isolates the project from system environment variables.

REM 1. Override JAVA_HOME to Java 21
set "JAVA_HOME=C:\microsoft-jdk-21.0.9-windows-x64\jdk-21.0.9+10"
set "JRE_HOME="

REM 2. Prepend to PATH
set "PATH=%JAVA_HOME%\bin;%PATH%"

REM 3. Set CATALINA_HOME to Tomcat 9.0.89
set "CATALINA_HOME=%~dp0..\apache-tomcat-9.0.89"
