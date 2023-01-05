$codeFiles = Get-ChildItem

foreach ($file in $codeFiles) {
  (Get-Content $file)
}