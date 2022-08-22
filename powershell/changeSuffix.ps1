Write-Output ""
Get-ChildItem -Path (Get-Location) -Name
Write-Output ""

$oldSuffix = Read-Host -Prompt "What suffix would you like to change?"
$newSuffix = Read-Host -Prompt "What should the new suffix be?"

# $_ is the current item in the pipeline
# ` is an escape character that let's me write on a new line
Get-ChildItem -Path (Get-Location) -Filter "*$oldSuffix" `
| Rename-Item -NewName { $_.BaseName.Replace($oldSuffix, $newSuffix) + $_.Extension }

Clear-Host