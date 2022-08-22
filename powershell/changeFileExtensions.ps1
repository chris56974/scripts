Write-Output ""
Get-ChildItem -Path (Get-Location) -Name
Write-Output ""

$oldExt = Read-Host -Prompt "What file extension would you like to change?"
$newExt = Read-Host -Prompt "What should the new file extension be?"

Get-ChildItem -Path (Get-Location) -Filter "*$oldExt" `
| Rename-Item -NewName { $_.BaseName + $_.Extension.Replace($oldExt, $newExt) }

Clear-Host