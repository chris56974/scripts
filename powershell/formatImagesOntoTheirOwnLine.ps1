# This adds a return between images that are touching each other 

# Example: ![](a.png)![](b.png) -> ![](a.png) \n ![](b.png)

# gci twice to filter dirs I don't want
# Select-String returns all files that have images in them 
# -like finds if the images are touching

# GCI twice to filter out a dir
# Select-String searches files for a pattern 
$imageFiles = Get-ChildItem -Exclude _resources | `
  Get-ChildItem -Recurse | `
  Select-String -Pattern "!\["  

# $imageFiles. <- autocomplete help

foreach ($file in $imageFiles) {
  # isolate the images that are touching each other
  if ($file.Line -like ("*)!*")) {
    (Get-Content $file.Path) -replace "\)!", ")`n!" | Set-Content -Path $file.Path
  }
}