param([string]$JsonFile)
$c = Get-Content $JsonFile -Raw -Encoding UTF8
$m = [regex]::Match($c, '"version"\s*:\s*"([^"]+)"')
if ($m.Success) { $m.Groups[1].Value }
