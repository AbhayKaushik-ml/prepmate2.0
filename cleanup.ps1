# Cleanup script to remove redundant files
# This improves application performance by reducing unnecessary code

# Remove test files
if (Test-Path "app\api\test-inngest\route.js") {
    Remove-Item -Path "app\api\test-inngest\route.js" -Force
    Write-Host "Removed test-inngest API route"
}

# Remove redundant config file
if (Test-Path "next.config.mjs") {
    Remove-Item -Path "next.config.mjs" -Force
    Write-Host "Removed redundant next.config.mjs"
}

# Remove helper script that's not needed for production
if (Test-Path "restart-server.js") {
    Remove-Item -Path "restart-server.js" -Force
    Write-Host "Removed restart-server.js"
}

Write-Host "Cleanup completed successfully!"
