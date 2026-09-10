$ErrorActionPreference = 'Continue'

$projectRoot = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
$projectMarker = 'Ambreen-s_portfolio'
$projectNodeModules = Join-Path $projectRoot 'node_modules'
$lockPath = Join-Path $projectRoot '.next\dev\lock'
$ports = @(3000, 4001, 9000)
$foreignOwnerFound = $false

function Get-ProcessCommandLine {
  param([int]$ProcessId)

  try {
    $process = Get-CimInstance -ClassName Win32_Process -Filter "ProcessId=$ProcessId" -ErrorAction Stop
    return [string]$process.CommandLine
  } catch {
    return ''
  }
}

function Test-BelongsToThisProject {
  param([string]$CommandLine)

  if ([string]::IsNullOrWhiteSpace($CommandLine)) {
    return $false
  }

  return (
    $CommandLine.IndexOf($projectMarker, [System.StringComparison]::OrdinalIgnoreCase) -ge 0 -or
    $CommandLine.IndexOf($projectNodeModules, [System.StringComparison]::OrdinalIgnoreCase) -ge 0
  )
}

function Get-ListeningProcessIds {
  param([int]$Port)

  try {
    return @(
      Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue |
        Select-Object -ExpandProperty OwningProcess -Unique
    )
  } catch {
    return @()
  }
}

function Test-IsProjectCmsProcess {
  param([string]$CommandLine)

  if (-not (Test-BelongsToThisProject -CommandLine $CommandLine)) {
    return $false
  }

  return (
    $CommandLine -match 'tinacms' -or
    $CommandLine -match 'next\\dist\\bin\\next' -or
    $CommandLine -match 'next\\dist\\server' -or
    $CommandLine -match 'next-server' -or
    $CommandLine -match '\.next\\dev\\build\\postcss' -or
    $CommandLine -match 'next(\.js)?\s+dev'
  )
}

function Get-ProjectCmsProcesses {
  return @(
    Get-CimInstance Win32_Process -ErrorAction SilentlyContinue |
      Where-Object {
        -not [string]::IsNullOrWhiteSpace($_.CommandLine) -and
        (Test-IsProjectCmsProcess -CommandLine $_.CommandLine)
      }
  )
}

Write-Host 'Checking CMS development ports...'
Write-Host ''

foreach ($port in $ports) {
  Write-Host "Port ${port}:"
  $processIds = Get-ListeningProcessIds -Port $port

  if ($processIds.Count -eq 0) {
    Write-Host '- no stale project process found'
    Write-Host ''
    continue
  }

  foreach ($processId in $processIds) {
    if ($processId -le 0) {
      continue
    }

    $commandLine = Get-ProcessCommandLine -ProcessId $processId
    $belongsToProject = Test-BelongsToThisProject -CommandLine $commandLine

    if ($belongsToProject) {
      $label = 'stale project process'
      if ($port -eq 4001) { $label = 'stale Tina process' }
      if ($port -eq 9000) { $label = 'stale Tina datalayer' }
      if ($port -eq 3000) { $label = 'stale Next.js process' }

      try {
        Stop-Process -Id $processId -Force -ErrorAction Stop
        Write-Host "- stopped $label PID $processId"
      } catch {
        Write-Host "- failed to stop PID $processId : $($_.Exception.Message)"
        $foreignOwnerFound = $true
      }
    } else {
      $foreignOwnerFound = $true
      Write-Host "Port $port is occupied by PID $processId but does not appear to belong to $projectMarker."
      Write-Host 'Nothing was terminated.'
      Write-Host 'Please close that application manually.'
    }
  }

  Write-Host ''
}

$leftovers = Get-ProjectCmsProcesses
foreach ($leftover in $leftovers) {
  try {
    Stop-Process -Id $leftover.ProcessId -Force -ErrorAction Stop
    Write-Host "Stopped leftover project CMS process PID $($leftover.ProcessId)"
  } catch {
    Write-Host "Failed to stop leftover PID $($leftover.ProcessId) : $($_.Exception.Message)"
  }
}

Start-Sleep -Seconds 1

if ((Get-ProjectCmsProcesses).Count -eq 0) {
  if (Test-Path -LiteralPath $lockPath) {
    Remove-Item -Force -LiteralPath $lockPath -ErrorAction SilentlyContinue
    Write-Host 'Removed stale .next/dev/lock'
  } else {
    Write-Host 'No .next/dev/lock to remove'
  }
} else {
  Write-Host 'A project Next.js process is still running, so .next/dev/lock was left in place.'
}

Write-Host ''
if ($foreignOwnerFound) {
  Write-Host 'CMS cleanup stopped safely because a watched port is owned by another application.'
  exit 1
}

Write-Host 'CMS environment is clean.'
exit 0
