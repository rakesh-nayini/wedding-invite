# Asset optimization fallback (when Node/sharp unavailable)
$root = Split-Path -Parent $PSScriptRoot
$outImages = Join-Path $root "public\assets\images"
$outVideo = Join-Path $root "public\assets\video"

New-Item -ItemType Directory -Force -Path $outImages | Out-Null
New-Item -ItemType Directory -Force -Path $outVideo | Out-Null

Add-Type -AssemblyName System.Drawing

$imageMap = @{
    "ABS03709.jpg.jpeg" = "hero"
    "ABS04067.jpg.jpeg" = "story-1"
    "ABS04381.jpg.jpeg" = "story-2"
    "ABS04736.jpg.jpeg" = "story-3"
    "ABS04959.jpg.jpeg" = "story-4"
    "ABS05245.jpg.jpeg" = "gallery-1"
    "ABS05477.jpg.jpeg" = "gallery-2"
    "ABS05624.jpg.jpeg" = "gallery-3"
    "ABS05880.jpg.jpeg" = "gallery-4"
    "ABS05924.jpg.jpeg" = "gallery-5"
    "ABS06046.jpg.jpeg" = "gallery-6"
    "ABS06137.jpg.jpeg" = "gallery-7"
    "ABS06182.jpg.jpeg" = "gallery-8"
    "slide1.jpeg" = "slide-1"
    "slide2.jpeg" = "slide-2"
    "slide3.jpeg" = "slide-3"
    "slide4.jpeg" = "slide-4"
    "brideslide0.jpeg" = "slide-0-bride"
    "brideslide0.1.jpeg" = "slide-0b-bride"
    "grromslide0.jpeg" = "slide-0-groom"
    "grromslide0.1.jpeg" = "slide-0b-groom"
    "brideengagementplace.jpeg" = "engagement-bride"
    "groomengagementplace.jpeg" = "engagement-groom"
    "underwedding.jpeg" = "story-wedding"
    "underrecepsection.jpeg" = "story-reception"
    "DSC_6742 copy.jpg.jpeg" = "gallery-9"
    "DSC_6842 copy.jpg.jpeg" = "gallery-10"
    "DSC_6951 copy.jpg.jpeg" = "gallery-11"
    "DSC_7589 copy.jpg.jpeg" = "gallery-12"
    "DSC_7679 copy.jpg.jpeg" = "gallery-13"
    "DSC_7698 copy.jpg.jpeg" = "gallery-14"
}

$widths = @(640, 1080, 1920)

function Resize-Image($inputPath, $outputPath, $maxWidth, $quality) {
    $img = [System.Drawing.Image]::FromFile($inputPath)
    try {
        $ratio = [Math]::Min($maxWidth / $img.Width, $maxWidth / $img.Height)
        if ($ratio -gt 1) { $ratio = 1 }
        $newW = [int]($img.Width * $ratio)
        $newH = [int]($img.Height * $ratio)
        $bmp = New-Object System.Drawing.Bitmap $newW, $newH
        $g = [System.Drawing.Graphics]::FromImage($bmp)
        $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
        $g.DrawImage($img, 0, 0, $newW, $newH)
        $g.Dispose()
        $codec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq "image/jpeg" }
        $encParams = New-Object System.Drawing.Imaging.EncoderParameters 1
        $encParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter ([System.Drawing.Imaging.Encoder]::Quality, [long]$quality)
        $bmp.Save($outputPath, $codec, $encParams)
        $bmp.Dispose()
    } finally {
        $img.Dispose()
    }
}

foreach ($entry in $imageMap.GetEnumerator()) {
    $src = Join-Path $root $entry.Key
    if (-not (Test-Path $src)) { Write-Warning "Missing: $($entry.Key)"; continue }
    foreach ($w in $widths) {
        $q = if ($w -le 640) { 75 } elseif ($w -le 1080) { 80 } else { 85 }
        $out = Join-Path $outImages "$($entry.Value)-$w.jpg"
        Resize-Image $src $out $w $q
        Write-Host "OK $($entry.Value)-$w.jpg"
    }
}

$videos = @(
    @{ Src = "Asritha .mp4"; Dest = "asritha.mp4" },
    @{ Src = "Rakesh Reddy .mp4"; Dest = "rakesh-reddy.mp4" }
)
foreach ($v in $videos) {
    $src = Join-Path $root $v.Src
    $dest = Join-Path $outVideo $v.Dest
    if (Test-Path $src) {
        Copy-Item $src $dest -Force
        Write-Host "OK video $($v.Dest)"
    }
}

Write-Host "`nPowerShell asset optimization complete."
