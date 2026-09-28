$pem = "d:\AIexamresult\aiexamresult.pem"

Write-Host "Resetting permissions on $pem..."
icacls $pem /reset /t /c /q
icacls $pem /inheritance:r
icacls $pem /grant:r "$($env:USERNAME):R"

Write-Host "Running deploy-ec2.ps1..."
& ".\deploy-ec2.ps1" -HostIP "65.0.146.40" -KeyPath $pem
