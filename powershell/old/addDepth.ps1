# This adds the appropriate amount of nesting to all markdown image links

$paths = Get-ChildItem */* -Exclude _resources

foreach ($path in $paths) {
  $mdImgLinks = Get-ChildItem $path | `
    Get-ChildItem -Recurse | `
    Select-String -Pattern "!\[" 
  
  $mdImgLinksUniquePaths = $mdImgLinks.Path | Get-Unique

  foreach ($mdImgLinkPath in $mdImgLinksUniquePaths) {
    $depth = $mdImgLinkPath.ToString().Split('\').Count - 7

    while ($depth -gt 0) {
      $depth = $depth - 1
      (Get-Content $mdImgLinkPath) -replace "\]\(", "](../"  | Set-Content $mdImgLinkPath
    }
  }
}
