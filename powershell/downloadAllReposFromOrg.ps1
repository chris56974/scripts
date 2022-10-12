$org = Read-Host -Prompt "`nWhat organization do you want to download from?"
Write-Output ""

if ($org.StartsWith("https")) {
  $org = $org.Split('/')[-1]
}

if (!(Test-Path $org)) {
  mkdir $org
} 

$repos = gh repo list $org -L 1000 --json nameWithOwner | ConvertFrom-Json 
$repos = $repos | Select-Object -ExpandProperty nameWithOwner

Set-Location $org
$cwd = Get-Location

foreach ($repo in $repos) {
  Start-Job -Name $repo -ScriptBlock { Set-Location $args[0]; gh repo clone $args[1] } -ArgumentList $cwd, $repo
}

Set-Location .. 