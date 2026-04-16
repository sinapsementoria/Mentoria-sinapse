Add-Type -AssemblyName System.Drawing
$bmp = [System.Drawing.Bitmap]::FromFile('logo SINAPSE.jpeg')
$color = $bmp.GetPixel(5, 5)
Write-Output "HEX: #$($color.R.ToString('X2'))$($color.G.ToString('X2'))$($color.B.ToString('X2'))"
