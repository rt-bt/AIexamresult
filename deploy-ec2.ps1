param(
    [Parameter(Mandatory=$true)]
    [string]$HostIP,

    [Parameter(Mandatory=$true)]
    [string]$KeyPath
)

$ProjectDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$RemoteUser = "ubuntu"
$RemoteDir = "/home/ubuntu/a-iexamresult"
$SSHOpts = "-i `"$KeyPath`" -o StrictHostKeyChecking=no"

Write-Host "=== Deploying to EC2 ($HostIP) ==="

# 1. Sync data files
Write-Host "`n[1/3] Uploading data files..."
$dataDir = Join-Path $ProjectDir "data"
if (Test-Path $dataDir) {
    scp $SSHOpts -r "$dataDir\posts" "$RemoteUser@$HostIP`:$RemoteDir\data\"
    if (Test-Path "$dataDir\scraped.json") {
        scp $SSHOpts "$dataDir\scraped.json" "$RemoteUser@$HostIP`:$RemoteDir\data\"
    }
    if (Test-Path "$dataDir\scraped-data.ts") {
        scp $SSHOpts "$dataDir\scraped-data.ts" "$RemoteUser@$HostIP`:$RemoteDir\data\"
    }
} else {
    Write-Host "WARNING: data/ directory not found locally. Skipping data upload."
}

# 2. Pull latest code & rebuild
Write-Host "`n[2/3] Pulling latest code & rebuilding..."
ssh $SSHOpts "$RemoteUser@$HostIP" "cd $RemoteDir && git pull && npm install && NODE_OPTIONS='--max-old-space-size=512' npm run build"

# 3. Restart PM2
Write-Host "`n[3/3] Restarting PM2..."
ssh $SSHOpts "$RemoteUser@$HostIP" "pm2 restart aiexamresult"

Write-Host "`n=== Deploy Complete! ==="
Write-Host "Visit: http://$HostIP"
