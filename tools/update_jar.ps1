# JAR/ZIP update script for bunri_Jar (Double extraction only)
$baseUrl = "http://59.10.169.82:9900/NexacroN/serverN/Deploy_JAVA/%EB%B6%84%EB%A6%AC_Jar/"
$targetDir = "d:\git_prj\nexacroN\Jar"

try {
    Write-Host "=========================================="
    Write-Host "Updating JAR (BUNRI_JAR)..."
    
    # 0. Clean target directory contents
    if (Test-Path $targetDir) {
        Write-Host "Cleaning $targetDir contents..." -ForegroundColor Yellow
        Get-ChildItem -Path $targetDir | ForEach-Object {
            Write-Host "   -> Deleting: $($_.Name)"
            Remove-Item $_.FullName -Recurse -Force -ErrorAction SilentlyContinue
        }
    } else {
        New-Item -ItemType Directory -Path $targetDir | Out-Null
        Write-Host "Created $targetDir directory."
    }

    # 1. Browse for latest year
    $response = Invoke-WebRequest -Uri $baseUrl -UseBasicParsing
    $latestYear = @($response.Links | Where-Object { $_.href -match '/(\d{4})/?$' } | ForEach-Object { 
        if ($_.href -match '(\d{4})') { $matches[1] }
    } | Sort-Object -Descending)[0]
    if (-not $latestYear) { throw "Year folder not found." }
    Write-Host "Latest Year: $latestYear"

    # 2. Browse for latest file
    $yearUrl = "$baseUrl$latestYear/"
    $response = Invoke-WebRequest -Uri $yearUrl -UseBasicParsing
    $latestFile = @($response.Links | Where-Object { $_.href -match '\.(zip|jar)$' } | ForEach-Object { 
        ($_.href.TrimEnd('/') -split '/')[-1] 
    } | Sort-Object -Descending)[0]
    if (-not $latestFile) { throw "No zip/jar found in $latestYear." }
    Write-Host "Latest File: $latestFile"

    # 3. Download
    $downloadPath = Join-Path $targetDir "download.zip"
    Write-Host "Downloading $latestFile ..."
    Invoke-WebRequest -Uri ($yearUrl + $latestFile) -OutFile $downloadPath

    # 4. Level 1 Extraction
    Write-Host "Extracting Level 1..."
    $level1Dir = Join-Path $targetDir "level1"
    New-Item -ItemType Directory -Path $level1Dir | Out-Null
    Expand-Archive -LiteralPath $downloadPath -DestinationPath $level1Dir -Force
    Remove-Item $downloadPath -Force

    # 5. Level 2 Extraction (Find nested ZIP)
    $innerZip = Get-ChildItem -Path $level1Dir -Filter "*.zip" | Select-Object -First 1
    if ($innerZip) {
        Write-Host "Nested ZIP found: $($innerZip.Name). Extracting Level 2..."
        # Extract Level 2 to targetDir directly
        Expand-Archive -LiteralPath $innerZip.FullName -DestinationPath $targetDir -Force
        # Move other files from level1 (like .json) to targetDir too
        Get-ChildItem -Path $level1Dir -Exclude "*.zip" | ForEach-Object {
            $dest = Join-Path $targetDir $_.Name
            if (Test-Path $dest) { Remove-Item $dest -Recurse -Force }
            Move-Item $_.FullName $targetDir -Force
        }
    } else {
        Write-Host "No nested ZIP found. Finalizing Level 1 contents..."
        Get-ChildItem -Path $level1Dir | ForEach-Object {
            $dest = Join-Path $targetDir $_.Name
            if (Test-Path $dest) { Remove-Item $dest -Recurse -Force }
            Move-Item $_.FullName $targetDir -Force
        }
    }
    
    # 6. Cleanup
    if (Test-Path $level1Dir) { Remove-Item $level1Dir -Recurse -Force }

    # 7. Check if final output is a folder and move its content up if needed
    # (Optional: the user's zip contains a single folder named after the file)
    $finalFolders = Get-ChildItem -Path $targetDir -Directory
    if ($finalFolders.Count -eq 1 -and $finalFolders[0].Name -match '^NexacroN_Deploy_JAVA_') {
        Write-Host "Detected single subfolder structure. Moving contents up..."
        $subFolder = $finalFolders[0]
        Get-ChildItem -Path $subFolder.FullName | ForEach-Object {
            $dest = Join-Path $targetDir $_.Name
            if (Test-Path $dest) { Remove-Item $dest -Recurse -Force }
            Move-Item $_.FullName $targetDir -Force
        }
        Remove-Item $subFolder.FullName -Recurse -Force
    }

    Write-Host "Update completed successfully."
    Write-Host "=========================================="
} catch {
    Write-Error "Error: $_"
    exit 1
}
