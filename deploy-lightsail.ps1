# AI Exam Result - Deploy to Lightsail
param(
    [Parameter(Mandatory=$true)]
    [string]$HostIP
)

$ProjectDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$RemoteUser = "ubuntu"
$RemoteDir = "/home/ubuntu/a-iexamresult"

Write-Host "=== Deploying to Lightsail ($HostIP) ==="

# 1. Sync data files
Write-Host "`n[1/3] Uploading data files..."
scp -r "$ProjectDir\data\posts" "$RemoteUser@$HostIP`:$RemoteDir\data\"
scp "$ProjectDir\data\scraped.json" "$RemoteUser@$HostIP`:$RemoteDir\data\"
scp "$ProjectDir\data\scraped-data.ts" "$RemoteUser@$HostIP`:$RemoteDir\data\"

# 2. Rebuild on Lightsail (pulls latest code changes)
Write-Host "`n[2/3] Rebuilding on Lightsail..."
ssh "$RemoteUser@$HostIP" "cd $RemoteDir && git pull && npm install && npm run build"

# 3. Restart PM2
Write-Host "`n[3/3] Restarting PM2..."
ssh "$RemoteUser@$HostIP" "pm2 restart aiexamresult"

Write-Host "`n=== Deploy Complete! ==="
Write-Host "Site: https://www.aiexamresult.com"
