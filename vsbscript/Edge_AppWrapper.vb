Imports System
Imports System.IO
Imports System.Diagnostics

Public Class EdgeAppWrapper
    Public Shared Sub Main()
        ' 임시 실행 경로 설정
        Dim tempHtmlPath As String = Path.Combine(Path.GetTempPath(), "Edge_UI_" & Guid.NewGuid().ToString("N") & ".html")
        Dim htmlContent As String = GetHtmlContent()
        
        Try
            ' UTF-8 인코딩으로 Edge용 HTML GUI 코드 추출 및 저장
            File.WriteAllText(tempHtmlPath, htmlContent, System.Text.Encoding.UTF8)
            
            ' MS Edge를 앱 모드(--app)로 호출하여 주소창과 메뉴바가 없는 컴포넌트 창 형태로 독자 기동시킴
            Dim psi As New ProcessStartInfo()
            psi.FileName = "msedge.exe"
            psi.Arguments = "--app=""file:///" & tempHtmlPath.Replace("\", "/") & """"
            psi.UseShellExecute = True
            
            Dim edgeProc As Process = Process.Start(psi)
            
            ' Edge 브라우저 창이 종료될 때까지 대기
            If edgeProc IsNot Nothing Then
                edgeProc.WaitForExit()
            End If
            
        Catch ex As Exception
            MsgBox("MS Edge 웹 컴포넌트 기동 오류: " & ex.Message, MsgBoxStyle.Critical, "기동 오류")
        Finally
            ' 프로그램 종료 직전 사용된 임시 파일을 자동으로 정리 (RULE[user_global] 준수)
            Try
                If File.Exists(tempHtmlPath) Then
                    File.Delete(tempHtmlPath)
                End If
            Catch
                ' 프로세스 점유 지연 등 예외 상황 방어
            End Try
        End Try
    End Sub
    
    Private Shared Function GetHtmlContent() As String
        Dim sb As New System.Text.StringBuilder()
        sb.AppendLine("<!DOCTYPE html>")
        sb.AppendLine("<html lang=""ko"">")
        sb.AppendLine("<head>")
        sb.AppendLine("    <meta charset=""UTF-8"">")
        sb.AppendLine("    <meta name=""viewport"" content=""width=device-width, initial-scale=1.0"">")
        sb.AppendLine("    <title>Edge Web Component (Chromium Engine)</title>")
        sb.AppendLine("    <style>")
        sb.AppendLine("        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600&family=Noto+Sans+KR:wght@300;400;700&display=swap');")
        sb.AppendLine("        * { box-sizing: border-box; margin: 0; padding: 0; }")
        sb.AppendLine("        body { font-family: 'Outfit', 'Noto Sans KR', sans-serif; background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); color: #f8fafc; height: 100vh; display: flex; flex-direction: column; overflow: hidden; }")
        sb.AppendLine("        .header-bar { background: rgba(30, 41, 59, 0.75); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); border-bottom: 1px solid rgba(255, 255, 255, 0.1); padding: 14px 24px; display: flex; align-items: center; gap: 20px; z-index: 10; }")
        sb.AppendLine("        .title { font-size: 16px; font-weight: 600; background: linear-gradient(to right, #38bdf8, #818cf8); -webkit-background-clip: text; -webkit-text-fill-color: transparent; white-space: nowrap; letter-spacing: 0.5px; }")
        sb.AppendLine("        .search-container { display: flex; flex-grow: 1; gap: 12px; align-items: center; }")
        sb.AppendLine("        .url-input { flex-grow: 1; background: rgba(15, 23, 42, 0.5); border: 1px solid rgba(255, 255, 255, 0.15); padding: 10px 18px; border-radius: 8px; color: #f8fafc; font-family: 'Outfit', sans-serif; font-size: 14px; outline: none; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }")
        sb.AppendLine("        .url-input:focus { border-color: #38bdf8; box-shadow: 0 0 12px rgba(56, 189, 248, 0.25); background: rgba(15, 23, 42, 0.75); }")
        sb.AppendLine("        .btn-go { background: linear-gradient(to right, #0284c7, #4f46e5); border: none; color: white; padding: 10px 26px; border-radius: 8px; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); outline: none; box-shadow: 0 4px 14px rgba(79, 70, 229, 0.3); }")
        sb.AppendLine("        .btn-go:hover { transform: translateY(-1px); box-shadow: 0 6px 18px rgba(79, 70, 229, 0.45); filter: brightness(1.1); }")
        sb.AppendLine("        .btn-go:active { transform: translateY(1px); }")
        sb.AppendLine("        .web-viewport { flex-grow: 1; position: relative; background: #ffffff; }")
        sb.AppendLine("        iframe { width: 100%; height: 100%; border: none; background: #ffffff; }")
        sb.AppendLine("    </style>")
        sb.AppendLine("</head>")
        sb.AppendLine("<body>")
        sb.AppendLine("    <div class=""header-bar"">")
        sb.AppendLine("        <div class=""title"">Edge Web View</div>")
        sb.AppendLine("        <div class=""search-container"">")
        sb.AppendLine("            <input type=""text"" id=""urlInput"" class=""url-input"" value=""http://172.10.12.45:8081/RP_105451_cktest.html"" placeholder=""주소 입력 (예: http://localhost:8080)"">")
        sb.AppendLine("            <input type=""text"" id=""urlInput2"" class=""url-input"" value="""" placeholder=""추가 경로 (예: /index.html)"">")
        sb.AppendLine("            <button onclick=""navigateTo()"" class=""btn-go"">이동</button>")
        sb.AppendLine("        </div>")
        sb.AppendLine("    </div>")
        sb.AppendLine("    <div class=""web-viewport"">")
        sb.AppendLine("        <iframe id=""viewport"" src=""about:blank""></iframe>")
        sb.AppendLine("    </div>")
        sb.AppendLine("    <script>")
        sb.AppendLine("        function navigateTo() {")
        sb.AppendLine("            var url = document.getElementById('urlInput').value.trim();")
        sb.AppendLine("            var url2 = document.getElementById('urlInput2').value.trim();")
        sb.AppendLine("            var finalUrl = url + url2;")
        sb.AppendLine("            if (finalUrl) {")
        sb.AppendLine("                if (!/^https?:\/\//i.test(finalUrl)) {")
        sb.AppendLine("                    finalUrl = 'http://' + finalUrl;")
        sb.AppendLine("                }")
        sb.AppendLine("                document.getElementById('viewport').src = finalUrl;")
        sb.AppendLine("            }")
        sb.AppendLine("        }")
        sb.AppendLine("        document.getElementById('urlInput').addEventListener('keydown', function(e) {")
        sb.AppendLine("            if (e.key === 'Enter') { navigateTo(); }")
        sb.AppendLine("        });")
        sb.AppendLine("        document.getElementById('urlInput2').addEventListener('keydown', function(e) {")
        sb.AppendLine("            if (e.key === 'Enter') { navigateTo(); }")
        sb.AppendLine("        });")
        sb.AppendLine("        window.onload = function() { navigateTo(); };")
        sb.AppendLine("    </script>")
        sb.AppendLine("</body>")
        sb.AppendLine("</html>")
        Return sb.ToString()
    End Function
End Class
