# PowerShell script to push to new GitHub repository
# Usage: .\push_to_new_repo.ps1 YOUR_GITHUB_USERNAME

param(
    [Parameter(Mandatory=$true)]
    [string]$GitHubUsername
)

$RepoName = "atharv_newwst-portfolio"
$RepoUrl = "https://github.com/$GitHubUsername/$RepoName.git"

Write-Host "Setting up new repository: $RepoName" -ForegroundColor Green
Write-Host "Repository URL: $RepoUrl" -ForegroundColor Cyan

# Check if remote already exists
$remoteExists = git remote | Select-String -Pattern "origin" -Quiet

if ($remoteExists) {
    Write-Host "Remote 'origin' already exists. Removing it..." -ForegroundColor Yellow
    git remote remove origin
}

# Add new remote
Write-Host "Adding new remote..." -ForegroundColor Green
git remote add origin $RepoUrl

# Verify remote was added
Write-Host "Verifying remote..." -ForegroundColor Green
git remote -v

Write-Host "`nReady to push! Run the following command:" -ForegroundColor Yellow
Write-Host "git push -u origin main" -ForegroundColor Cyan
Write-Host "`nOr if you want to push now, press Y to continue..." -ForegroundColor Yellow

$response = Read-Host
if ($response -eq "Y" -or $response -eq "y") {
    Write-Host "Pushing to repository..." -ForegroundColor Green
    git push -u origin main
    if ($LASTEXITCODE -eq 0) {
        Write-Host "`nSuccess! Repository pushed to: $RepoUrl" -ForegroundColor Green
    } else {
        Write-Host "`nError: Make sure the repository exists on GitHub first!" -ForegroundColor Red
        Write-Host "Create it at: https://github.com/new" -ForegroundColor Yellow
    }
}

