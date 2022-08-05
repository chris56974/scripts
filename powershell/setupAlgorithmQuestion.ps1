$currentDirectoryName = getCurrentDirectoryName

if (New-Item README.md) {
  Write-Output "# $currentDirectoryName`n`n## IO`n`n## External" >> README.md
}

mkdir go, python, swift, cpp, java, ts, ruby, kotlin

cargo init rust --vcs none

dotnet new console -o csharp

Clear-Host