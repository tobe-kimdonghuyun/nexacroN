param([string]$TargetDir)
$files = Get-ChildItem -Path $TargetDir -Filter '*.js' -Recurse
$count = 0
foreach ($file in $files) {
    $bytes = [System.IO.File]::ReadAllBytes($file.FullName)
    if ($bytes.Length -ge 3 -and $bytes[0] -eq 0xEF -and $bytes[1] -eq 0xBB -and $bytes[2] -eq 0xBF) { continue }
    try { $text = [System.IO.File]::ReadAllText($file.FullName, [System.Text.Encoding]::UTF8) }
    catch { $text = [System.IO.File]::ReadAllText($file.FullName, [System.Text.Encoding]::GetEncoding(949)) }
    $utf8Bom = New-Object System.Text.UTF8Encoding($true)
    [System.IO.File]::WriteAllText($file.FullName, $text, $utf8Bom)
    Write-Host ('  Converted: ' + $file.FullName)
    $count++
}
Write-Host ('[INFO] Converted ' + $count + ' file(s) to UTF-8 BOM.')