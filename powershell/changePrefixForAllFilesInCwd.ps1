# This doesn't do what I think it does
# replace "_" in _fred_ will change it to fred

Write-Output ""
Get-ChildItem -Path (Get-Location) -Name
Write-Output ""

$oldPrefix = Read-Host -Prompt "What prefix would you like to change?"
$newPrefix = Read-Host -Prompt "What should the new prefix be?"

# $_ is the current item in the pipeline
# ` is an escape character that let's me write on a new line
Get-ChildItem -Path $cwd -Filter "$oldPrefix*" `
| Rename-Item -NewName { $_.BaseName.Replace($oldPrefix, $newPrefix) + $_.Extension }

Clear-Host