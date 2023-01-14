$currentDirectoryName = grabCurrentDir

if (New-Item README.md) {
  Write-Output "# $currentDirectoryName`n`n## IO`n`n## External" >> README.md
}

cargo init rust --vcs none

dotnet new console -o csharp

Clear-Host