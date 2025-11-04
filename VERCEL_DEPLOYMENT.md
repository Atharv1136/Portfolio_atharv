# Vercel Deployment Guide

This guide will help you deploy your Full Portfolio Hub application to Vercel.

## Prerequisites

1. A Vercel account (sign up at [vercel.com](https://vercel.com))
2. MongoDB Atlas cluster set up and running
3. Your MongoDB connection string
4. Git repository (GitHub, GitLab, or Bitbucket)

## Step 1: Prepare Your Repository

1. Make sure all your code is committed to your Git repository
2. Ensure your `.env` file is **NOT** committed (it should be in `.gitignore`)

## Step 2: Deploy to Vercel

### Option A: Deploy via Vercel Dashboard

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your Git repository
3. Configure the project:
   - **Framework Preset**: Other
   - **Build Command**: `npm run build:static`
   - **Output Directory**: `dist/public`
   - **Install Command**: `npm install`
4. Click **Deploy**

### Option B: Deploy via Vercel CLI

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Deploy:
   ```bash
   vercel
   ```

4. For production deployment:
   ```bash
   vercel --prod
   ```

## Step 3: Configure Environment Variables

After deployment, you need to set up environment variables in Vercel:

1. Go to your project dashboard on Vercel
2. Navigate to **Settings** → **Environment Variables**
3. Add the following variables:

   | Variable Name | Value | Description |
   |--------------|-------|-------------|
   | `STORAGE_TYPE` | `mongodb` | Use MongoDB for data storage |
   | `MONGODB_URI` | `your_mongodb_connection_string` | Your MongoDB Atlas connection string |
   | `SESSION_SECRET` | `your_random_secret_key` | A random secret key for sessions (generate one) |

4. **Important**: Make sure to add these for **Production**, **Preview**, and **Development** environments

### Generate a Session Secret

You can generate a secure session secret using:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Step 4: MongoDB Atlas Configuration

1. **Whitelist IP Addresses**:
   - Go to MongoDB Atlas → Network Access
   - Click **Add IP Address**
   - Click **Allow Access from Anywhere** (or add Vercel's IP ranges)
   - For Vercel, you can use `0.0.0.0/0` (allows all IPs) - only recommended if your MongoDB user has proper authentication

2. **Database User**:
   - Ensure you have a database user with read/write permissions
   - The connection string should include the username and password

## Step 5: Verify Deployment

1. After deployment completes, visit your Vercel URL
2. Test the admin login:
   - Click "Atharv Bhosale" in the navbar 5 times quickly
   - Login with:
     - Username: `admin`
     - Password: `Atharv@1136`
3. Check MongoDB connection:
   - Open Vercel dashboard → **Functions** tab
   - Check function logs for MongoDB connection status

## Step 6: Create Admin User (if needed)

If the admin user wasn't auto-created, you can create it manually:

1. SSH into your Vercel deployment (or use MongoDB Compass)
2. Or create a temporary script to run locally that connects to the same MongoDB:
   ```bash
   npm run create-admin-user
   ```

## Troubleshooting

### Issue: "MongoDB Connection Error"

**Solutions**:
- Verify `MONGODB_URI` is set correctly in Vercel environment variables
- Check MongoDB Atlas IP whitelist includes Vercel IPs (or `0.0.0.0/0`)
- Ensure MongoDB cluster is running
- Check connection string format: `mongodb+srv://username:password@cluster.mongodb.net/dbname?retryWrites=true&w=majority`

### Issue: "Session not persisting"

**Solutions**:
- Verify `SESSION_SECRET` is set in environment variables
- Check that MongoDB session store is working (look for "✅ Using MongoDB session store" in logs)
- Ensure cookies are being sent (check browser DevTools → Application → Cookies)

### Issue: "Static files not loading"

**Solutions**:
- Verify `outputDirectory` is set to `dist/public` in `vercel.json`
- Check that build completed successfully
- Ensure routes in `vercel.json` are configured correctly

### Issue: "API routes returning 404"

**Solutions**:
- Verify `vercel.json` routes are configured correctly
- Check that `/api/index.ts` exists and exports a default handler
- Review Vercel function logs for errors

### Issue: "Build fails"

**Solutions**:
- Check build logs in Vercel dashboard
- Ensure all dependencies are in `package.json`
- Verify Node.js version compatibility (Vercel uses Node 18.x by default)
- Check for TypeScript errors: `npm run check`

## Environment Variables Reference

```env
# Required
STORAGE_TYPE=mongodb
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname?retryWrites=true&w=majority
SESSION_SECRET=your_random_secret_key_here

# Optional (defaults shown)
NODE_ENV=production
```

## Project Structure for Vercel

```
FullPortfolioHub/
├── api/
│   └── index.ts          # Vercel serverless function handler
├── client/                # Frontend React app
├── server/                # Backend Express routes
├── dist/                  # Build output (generated)
│   └── public/            # Static files served by Vercel
├── vercel.json            # Vercel configuration
└── package.json           # Dependencies and scripts
```

## Custom Domain (Optional)

1. Go to Vercel project → **Settings** → **Domains**
2. Add your custom domain
3. Follow DNS configuration instructions
4. Wait for SSL certificate provisioning

## Updating Your Deployment

After making changes:

1. Commit and push to your Git repository
2. Vercel will automatically redeploy
3. Or manually trigger deployment from Vercel dashboard

## Monitoring

- **Logs**: Vercel dashboard → **Functions** → View logs
- **Analytics**: Vercel dashboard → **Analytics** tab
- **Performance**: Check function execution times and errors

## Support

- Vercel Documentation: https://vercel.com/docs
- MongoDB Atlas Documentation: https://docs.atlas.mongodb.com
- Project Issues: Check your repository's issue tracker

