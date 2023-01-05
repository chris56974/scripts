# I only need to run this script once
# Joplin exports all the images for my notes to a root _resources/ dir 
# I want to move all images from that dir into each respective dir instead
# Math images should go in the math folder, etc

$rootImages = @{} 
Get-ChildItem -Path "./_resources" | ForEach-Object {
  # Name -> example.png
  # FullName -> C:\Users\me\Math\example.png
  $rootImages.Add($_.Name, $_.FullName)
}

$targetDirs = @{}
Get-ChildItem -Path "." -Exclude _resources -Directory | ForEach-Object {
  # Name -> Math
  # FullName -> C:\Users\me\Math
  $targetDirs.Add($_.FullName, $_.Name)
}

# Search through all my notes and find where I used an image
$mdImgLinks = Get-ChildItem -Exclude _resources | `
  Get-ChildItem -Recurse | `
  Select-String -Pattern "!\[" # all images are ![foo[(bar)

foreach ($mdImgLink in $mdImgLinks) {
  # grab the image name from the markdown link 
  # [[(example.png) -> example.png
  $startIndex = $mdImgLink.Line.lastIndexOf('/') + 1
  $endIndex = $mdImgLink.Line.indexOf(')') 

  if ($startIndex -gt 0) {
    $imgName = $mdImgLink.Line.substring($startIndex, $endIndex - $startIndex)
  }
  else {
    continue
  }

  # if the image doesn't exist in the root folder, ignore it
  if (!$rootImages.ContainsKey($imgName)) { continue } 

  # Find out which target dir to put the image into
  $targetDirPath = $mdImgLink.Path

  while ($null -ne $targetDirPath -and !$targetDirs.ContainsKey($targetDirPath)) {
    $targetDirPath = $targetDirPath | Split-Path -Parent
  }

  if ($null -eq $targetDirPath) { 
    continue 
  }

  if (!(Test-Path $targetDirPath\_resources)) {
    New-Item -Path $targetDirPath -ItemType "Directory" -Name "_resources"
  } 
  
  # Copy the image from the old _resources to the new _img folder (if it's not there already)
  Copy-Item $rootImages[$imgName] -Destination $targetDirPath\_resources
}