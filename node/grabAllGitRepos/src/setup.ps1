param (
    [string] $TESTDIR = $(Join-Path $PSScriptRoot test)
)

$fooFolder = Join-Path $TESTDIR foo 
$barFolder = Join-Path $TESTDIR bar
$bazFolder = Join-Path $barFolder baz
$quxFolder = Join-Path $TESTDIR qux

New-Item -ItemType Directory -Path $fooFolder, $barFolder, $bazFolder, $quxFolder 

Set-Location $fooFolder
git init -q
git remote add origin git@github.com:Chris56974/node-scripts.git

Set-Location $barFolder
git init -q
git remote add origin git@github.com:Chris56974/node-scripts.git

Set-Location $bazFolder
git init -q
git remote add origin git@github.com:Chris56974/node-scripts.git
