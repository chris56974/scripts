# Get-Location = pwd
# Tee-Object -> Outputs to the console and saves to a variable
$cwd = Get-Location

Write-Output ""
Get-ChildItem -Path $cwd -Name
Write-Output ""

$oldPrefix = Read-Host -Prompt "What prefix would you like to change?"
$newPrefix = Read-Host -Prompt "What should the new prefix be?"

# $_ is the current item in the pipeline
Get-ChildItem -Path $cwd -Filter "$oldPrefix*" `
| Rename-Item -NewName { $_.BaseName.Replace($oldPrefix, $newPrefix) + $_.Extension }

Write-Output ""
Write-Output "voila!"
Write-Output ""

Clear-Host