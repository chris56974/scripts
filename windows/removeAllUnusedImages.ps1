# $images = Get-ChildItem -Path "./_resources" 
# 
# $usedImages = Get-ChildItem -Recurse -Path "./" | Select-String $images 
# 
# Write-Output $usedImages
# 
# Get-ChildItem -Path "./_resources" -Exclude $usedImages.Pattern 