$paths = Get-ChildItem -Depth 3

foreach ($path in $paths) {
  $path
}