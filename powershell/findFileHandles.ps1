$targetfile = "C:\Users\yi8sy\s\powershell\Math\Proofs\AND,OR,NOT.md"
$result = Invoke-Expression "C:\Users\yi8sy\Downloads\handle.exe $targetfile" | Select-String ([System.IO.Path]::GetFileNameWithoutExtension($targetfile))
Write-Output $result
