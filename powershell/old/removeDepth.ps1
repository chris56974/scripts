# This script removes the nesting of markdown image links with images 5 levels deep
$paths = Get-ChildItem */* -Exclude _resources

foreach ($path in $paths) {
  $mdImgLinks = Get-ChildItem $path | `
    Get-ChildItem -Recurse | `
    Select-String -Pattern "!\["  

  foreach ($mdImgLink in $mdImgLinks) {
    (Get-Content $mdImgLink.Path) -replace "\(../", "(" | Set-Content $mdImgLink.Path
    (Get-Content $mdImgLink.Path) -replace "\(../", "(" | Set-Content $mdImgLink.Path
    (Get-Content $mdImgLink.Path) -replace "\(../", "(" | Set-Content $mdImgLink.Path
    (Get-Content $mdImgLink.Path) -replace "\(../", "(" | Set-Content $mdImgLink.Path
    (Get-Content $mdImgLink.Path) -replace "\(../", "(" | Set-Content $mdImgLink.Path
  }
}
