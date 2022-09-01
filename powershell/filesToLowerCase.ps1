<#
  See dirsToLowerCase.ps1
#>

Get-ChildItem -File | ForEach-Object {
  $NewName = $_.Name.ToLowerInvariant()
  $TempItem = Rename-Item -LiteralPath $_.FullName -NewName "a" -PassThru
  Rename-Item -LiteralPath $TempItem.FullName -NewName $NewName
}
