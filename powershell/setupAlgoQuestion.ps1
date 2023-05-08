$currentDirectoryName = grabCurrentDir

if (New-Item README.md) {
  Write-Output "# $currentDirectoryName`n`n## IO`n`n## External" >> README.md
}

Clear-Host