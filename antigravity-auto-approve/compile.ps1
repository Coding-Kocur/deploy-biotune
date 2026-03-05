$source = "AutoApprove.cs"
$output = "AutoApprove.exe"
$iconInput = "C:/Users/stani/.gemini/antigravity/brain/9defd393-5f58-4f26-bf94-a0f46457f0c9/uploaded_image_1768941656076.jpg"
$iconIco = "app.ico"

Write-Host "Processing icon..."
try {
    Add-Type -AssemblyName System.Drawing
    if (-not (Test-Path $iconInput)) {
        Write-Error "Icon input file not found: $iconInput"
        exit 1
    }

    $original = [System.Drawing.Bitmap]::FromFile($iconInput)
    $recolored = New-Object System.Drawing.Bitmap($original.Width, $original.Height)
    
    for ($x = 0; $x -lt $original.Width; $x++) {
        for ($y = 0; $y -lt $original.Height; $y++) {
            $c = $original.GetPixel($x, $y)
            $gray = [int](($c.R * 0.3) + ($c.G * 0.59) + ($c.B * 0.11))
            $alpha = $c.A
            if ($gray -lt 30) {
                $newC = [System.Drawing.Color]::FromArgb($alpha, $c.R, $c.G, $c.B)
            }
            else {
                $newC = [System.Drawing.Color]::FromArgb($alpha, $gray, 0, 0)
            }
            $recolored.SetPixel($x, $y, $newC)
        }
    }
    
    $thumb = $recolored.GetThumbnailImage(256, 256, $null, [IntPtr]::Zero)
    $hIcon = $thumb.GetHicon()
    $icon = [System.Drawing.Icon]::FromHandle($hIcon)
    
    $fs = New-Object System.IO.FileStream($iconIco, 'Create')
    $icon.Save($fs)
    $fs.Close()
    
    $icon.Dispose()
    $thumb.Dispose()
    $recolored.Dispose()
    $original.Dispose()
    
    Write-Host "Icon recolored and converted to $iconIco"
}
catch {
    Write-Host "Icon conversion failed: $_" -ForegroundColor Yellow
    exit 1
}

Write-Host "Compiling $source to $output with Icon..."

$csc = "C:\Windows\Microsoft.NET\Framework\v4.0.30319\csc.exe"
if (Test-Path $csc) {
    $cscArgs = @(
        "/target:winexe",
        "/out:$output",
        "/win32icon:$iconIco",
        $source
    )
    & $csc $cscArgs
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Success! Created $output"
    }
    else {
        Write-Host "Compilation failed with CSC" -ForegroundColor Red
    }
}
else {
    Write-Host "CSC.exe not found." -ForegroundColor Red
}
$source = "AutoApprove.cs"
$output = "AutoApprove.exe"
$iconInput = "C:/Users/stani/.gemini/antigravity/brain/9defd393-5f58-4f26-bf94-a0f46457f0c9/uploaded_image_1768941656076.jpg"
$iconIco = "app.ico"

Write-Host "Processing icon..."
try {
    Add-Type -AssemblyName System.Drawing
    if (-not (Test-Path $iconInput)) {
        Write-Error "Icon input file not found: $iconInput"
        exit 1
    }

    $original = [System.Drawing.Bitmap]::FromFile($iconInput)
    $recolored = New-Object System.Drawing.Bitmap($original.Width, $original.Height)
    
    for ($x = 0; $x -lt $original.Width; $x++) {
        for ($y = 0; $y -lt $original.Height; $y++) {
            $c = $original.GetPixel($x, $y)
            $gray = [int](($c.R * 0.3) + ($c.G * 0.59) + ($c.B * 0.11))
            $alpha = $c.A
            if ($gray -lt 30) {
                $newC = [System.Drawing.Color]::FromArgb($alpha, $c.R, $c.G, $c.B)
            }
            else {
                $newC = [System.Drawing.Color]::FromArgb($alpha, $gray, 0, 0)
            }
            $recolored.SetPixel($x, $y, $newC)
        }
    }
    
    $thumb = $recolored.GetThumbnailImage(256, 256, $null, [IntPtr]::Zero)
    $hIcon = $thumb.GetHicon()
    $icon = [System.Drawing.Icon]::FromHandle($hIcon)
    
    $fs = New-Object System.IO.FileStream($iconIco, 'Create')
    $icon.Save($fs)
    $fs.Close()
    
    $icon.Dispose()
    $thumb.Dispose()
    $recolored.Dispose()
    $original.Dispose()
    
    Write-Host "Icon recolored and converted to $iconIco"
}
catch {
    Write-Host "Icon conversion failed: $_" -ForegroundColor Yellow
    exit 1
}

Write-Host "Compiling $source to $output with Icon..."

$csc = "C:\Windows\Microsoft.NET\Framework\v4.0.30319\csc.exe"
if (Test-Path $csc) {
    $cscArgs = @(
        "/target:winexe",
        "/out:$output",
        "/win32icon:$iconIco",
        $source
    )
    & $csc $cscArgs
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Success! Created $output"
    }
    else {
        Write-Host "Compilation failed with CSC" -ForegroundColor Red
    }
}
else {
    Write-Host "CSC.exe not found." -ForegroundColor Red
}
