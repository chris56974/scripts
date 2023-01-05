param(
  [Parameter(Mandatory)]
  [string]$svgFileName
)

if (Test-Path $svgFileName) {
  $foo = (Get-Content $svgFileName) | Foreach-Object {
    $_ -replace "stroke-miterlimit", "strokeMiterlimit" `
       -replace "stroke-width", "strokeWidth" `
       -replace "stroke-linecap", "strokeLinecap" `
       -replace "stroke-linejoin", "strokeLineJoin"
  }

  Write-Output $foo
}