# Setup Instructions for New Repository: atharv_newwst-portfolio

## Step 1: Create Repository on GitHub

1. Go to [GitHub](https://github.com) and sign in
2. Click the "+" icon in the top right corner
3. Select "New repository"
4. Repository name: `atharv_newwst-portfolio`
5. Description: "Full Stack Portfolio Website"
6. Set it to **Public** or **Private** (your choice)
7. **DO NOT** initialize with README, .gitignore, or license (we already have these)
8. Click "Create repository"

## Step 2: Add Remote and Push

After creating the repository, run these commands:

```bash
# Add the new remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/atharv_newwst-portfolio.git

# Push all commits to the new repository
git push -u origin main
```

## Alternative: Using SSH

If you prefer SSH:

```bash
# Add the new remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin git@github.com:YOUR_USERNAME/atharv_newwst-portfolio.git

# Push all commits to the new repository
git push -u origin main
```

## Verification

After pushing, verify by visiting:
`https://github.com/YOUR_USERNAME/atharv_newwst-portfolio`

You should see all your files and commits there!

