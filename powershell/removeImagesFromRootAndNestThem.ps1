# I only need to run this script once...
# Joplin exports images to a single _resources dir
# I want to move those images into the dirs where they're used instead
# math images should go in my math folder, etc 

# Create a hashtable for the source images
$sourceImageDir = Get-ChildItem -Path "./_resources"
$sourceImageHashtable = @{}

foreach ($image in $sourceImageDir) {
  $sourceImageHashtable.Add($image.Name, $image.FullName)
}

# Find all the md links where I use an image
$markdownImageLinks = Get-ChildItem -Exclude _resources | `
  Get-ChildItem -Recurse | `
  Select-String -Pattern "!\["  

foreach ($imageLink in $markdownImageLinks) {
  # Convert the md image name: [](../img.png) -> img.png
  $mdImageName = $imageLink.Line
  $startIndex = $mdImageName.lastIndexOf('/') + 1
  $endIndex = $mdImageName.indexOf(')') 
  $substringLength = $endIndex - $startIndex

  if ($startIndex -gt 0) {
    $imageName = $mdImageName.substring($startIndex, $substringLength)
  } else {
    continue
  }

  # Check if the image exists in the source dir (could be a deadlink)
  if ($sourceImageHashtable.ContainsKey($imageName)) {
    $sourceImagePath = $sourceImageHashtable[$imageName]
    Write-Output $sourceImagePath
    # Create the new _img folder in the TLD if it doesn't already exist
    # Copy the image from the old _resources to the new _img folder (if it's not there already)
    # Rewrite the image link to point to the images new location (in _img)
  }
}