<#
  This is ridiculous. 
 
  Rename-Item only works if the result produces a different path.
  But "FOO".ToLower() produces the SAME path, and therefore can't be renamed...

  credit to https://stackoverflow.com/questions/69738230
#>

Get-ChildItem -Directory | ForEach-Object {
  $NewName = $_.Name.ToLowerInvariant()
  $TempItem = Rename-Item -LiteralPath $_.FullName -NewName "a" -PassThru
  Rename-Item -LiteralPath $TempItem.FullName -NewName $NewName
}