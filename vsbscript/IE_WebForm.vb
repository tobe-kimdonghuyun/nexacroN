Imports System
Imports System.Windows.Forms
Imports System.Drawing

Public Class IEWebComponentForm
    Inherits Form

    Private txtUrl As TextBox
    Private txtUrl2 As TextBox
    Private btnGo As Button
    Private webBrowser As WebBrowser
    Private panelTop As Panel

    Public Sub New()
        Me.Text = "IE Web Component (Trident Engine)"
        Me.Size = New Size(1024, 768)
        Me.StartPosition = FormStartPosition.CenterScreen

        ' 상단 패널 생성 (높이를 늘려 두 개의 입력 필드 수용)
        panelTop = New Panel()
        panelTop.Dock = DockStyle.Top
        panelTop.Height = 96
        panelTop.BackColor = Color.FromArgb(243, 244, 246)

        ' 첫 번째 주소 입력창 (Edit Box 1)
        txtUrl = New TextBox()
        txtUrl.Location = New Point(20, 16)
        txtUrl.Size = New Size(760, 27)
        txtUrl.Font = New Font("Segoe UI", 11)
        txtUrl.Text = "http://172.10.12.45:8081/RP_105451_cktest.html"

        ' 두 번째 추가 경로 입력창 (Edit Box 2 - 새로 추가됨)
        txtUrl2 = New TextBox()
        txtUrl2.Location = New Point(20, 52)
        txtUrl2.Size = New Size(760, 27)
        txtUrl2.Font = New Font("Segoe UI", 11)
        txtUrl2.Text = ""

        ' 이동 버튼 (두 텍스트박스 높이에 맞춰 크기 조정)
        btnGo = New Button()
        btnGo.Text = "이동"
        btnGo.Location = New Point(800, 15)
        btnGo.Size = New Size(120, 64)
        btnGo.Font = New Font("맑은 고딕", 10, FontStyle.Bold)
        btnGo.BackColor = Color.FromArgb(37, 99, 235)
        btnGo.ForeColor = Color.White
        btnGo.FlatStyle = FlatStyle.Flat
        btnGo.FlatAppearance.BorderSize = 0
        AddHandler btnGo.Click, AddressOf NavigateToUrl

        ' 웹 브라우저 컴포넌트 (IE 엔진)
        webBrowser = New WebBrowser()
        webBrowser.Dock = DockStyle.Fill
        webBrowser.ScriptErrorsSuppressed = True

        ' 폼에 컨트롤 배치 및 레이아웃 정리
        panelTop.Controls.Add(txtUrl)
        panelTop.Controls.Add(txtUrl2)
        panelTop.Controls.Add(btnGo)
        Me.Controls.Add(webBrowser)
        Me.Controls.Add(panelTop)
        
        Me.Controls.SetChildIndex(webBrowser, 0)
        Me.Controls.SetChildIndex(panelTop, 1)

        ' 엔터키 처리 등록
        AddHandler txtUrl.KeyDown, AddressOf TxtUrl_KeyDown
        AddHandler txtUrl2.KeyDown, AddressOf TxtUrl_KeyDown

        ' 화면 로딩 시 자동 이동
        NavigateToUrl(Nothing, Nothing)
    End Sub

    Private Sub NavigateToUrl(sender As Object, e As EventArgs)
        ' 두 개의 Edit 박스에 입력된 값을 결합하여 최종 주소를 생성합니다.
        Dim url As String = txtUrl.Text.Trim() & txtUrl2.Text.Trim()
        If Not String.IsNullOrEmpty(url) Then
            If Not url.Contains("://") Then
                url = "http://" & url
            End If
            Try
                webBrowser.Navigate(New Uri(url))
            Catch ex As Exception
                MessageBox.Show("올바르지 않은 URL 형식입니다: " & ex.Message, "오류", MessageBoxButtons.OK, MessageBoxIcon.Error)
            End Try
        End If
    End Sub

    Private Sub TxtUrl_KeyDown(sender As Object, e As KeyEventArgs)
        If e.KeyCode = Keys.Enter Then
            btnGo.PerformClick()
            e.SuppressKeyPress = True
        End If
    End Sub

    <STAThread>
    Public Shared Sub Main()
        ' IE11 렌더링 호환성 지정을 위해 레지스트리 설정 반영 시도
        Try
            Dim appName As String = System.AppDomain.CurrentDomain.FriendlyName
            Dim regKey As Microsoft.Win32.RegistryKey = Microsoft.Win32.Registry.CurrentUser.OpenSubKey(
                "SOFTWARE\Microsoft\Internet Explorer\Main\FeatureControl\FEATURE_BROWSER_EMULATION", True)
            If regKey IsNot Nothing Then
                regKey.SetValue(appName, 11001, Microsoft.Win32.RegistryValueKind.DWord)
                regKey.SetValue(appName & ".exe", 11001, Microsoft.Win32.RegistryValueKind.DWord)
                regKey.Close()
            End If
        Catch
            ' 권한 제약 시 예외 발생 무시
        End Try

        Application.EnableVisualStyles()
        Application.SetCompatibleTextRenderingDefault(False)
        Application.Run(New IEWebComponentForm())
    End Sub
End Class
