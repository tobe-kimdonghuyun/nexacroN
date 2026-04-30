param(
    [string]$TargetDir,
    [string]$Version
)

$files = Get-ChildItem $TargetDir -Recurse -Filter '*.json'
foreach ($f in $files) {
    $c = Get-Content $f.FullName -Raw -Encoding UTF8
    $u = $c -replace '"version"\s*:\s*"[^"]*"', ('"version":"' + $Version + '"')
    if ($c -ne $u) {
        Set-Content $f.FullName $u -NoNewline -Encoding UTF8
        Write-Host "[CHANGED] $($f.Name)"
    }
}
