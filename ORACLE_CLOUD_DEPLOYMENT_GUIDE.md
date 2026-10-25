# Complete Oracle Cloud + Free `is-a.dev` Domain Deployment Guide

This guide walks you through the exact end-to-end process in sequential order:
1. **Create and prepare your Oracle Cloud VM** (Always Free).
2. **Deploy and run your portfolio code** on the VM using PM2.
3. **Configure Nginx reverse proxy** (verify it loads via Public IP).
4. **Apply for your free `is-a.dev` domain on GitHub** pointing to your VM IP.
5. **Secure your domain with free SSL (HTTPS)** using Certbot.

---

## Phase 1: Create Oracle Cloud VM & Configure Firewall

### Step 1.1: Create Compute Instance (Always Free)
1. Sign in to your [Oracle Cloud Console](https://cloud.oracle.com/).
2. From the navigation menu, go to **Compute** > **Instances**.
3. Click **Create Instance**.
4. Configure the instance:
   - **Name**: `portfolio-server` (or any name you prefer)
   - **Image**: Click *Change Image* and select **Ubuntu 24.04** or **Ubuntu 22.04 LTS**.
   - **Shape**:
     - *Option A (Recommended)*: **VM.Standard.A1.Flex (Ampere ARM)** — Always Free allows up to 4 OCPUs and 24 GB RAM.
     - *Option B*: **VM.Standard.E2.1.Micro (AMD)** — Always Free (1 OCPU, 1 GB RAM).
   - **Networking**:
     - Select or create a Virtual Cloud Network (VCN).
     - Make sure **"Assign a public IPv4 address"** is selected.
   - **SSH Keys**:
     - Select **Generate a key pair for me**.
     - Click **Save Private Key** (download the `.key` file, e.g. `ssh-key.key`). **Keep this safe!**
5. Click **Create**.
6. Wait 1–2 minutes until the state turns green (**RUNNING**).
7. Copy your **Public IP Address** (e.g. `129.153.xxx.xxx`).

---

### Step 1.2: Open Ports 80 & 443 in Oracle VCN Security List
Oracle blocks all public HTTP/HTTPS traffic by default. You must allow it:

1. On your instance page, scroll down and click on your **Subnet** link under *Primary VNIC*.
2. Click on the **Default Security List for...**.
3. Click **Add Ingress Rules**:
   - **Source Type**: CIDR
   - **Source CIDR**: `0.0.0.0/0`
   - **IP Protocol**: `TCP`
   - **Source Port Range**: *(leave empty)*
   - **Destination Port Range**: `80,443`
   - **Description**: `Allow HTTP and HTTPS`
4. Click **Add Ingress Rules**.

---

## Phase 2: Connect to VM & Deploy the Portfolio

### Step 2.1: Connect via SSH
Open PowerShell or Terminal on your local machine:

```powershell
ssh -i "path\to\your-ssh-key.key" ubuntu@YOUR_ORACLE_PUBLIC_IP
```
*(If you see permissions warnings on Windows, make sure only your user has read access to the key file).*

---

### Step 2.2: Open Firewall Ports Inside Ubuntu
Run these commands in your VM shell to allow traffic through Ubuntu's internal iptables:

```bash
sudo iptables -I INPUT 6 -m state --state NEW -p tcp --dport 80 -j ACCEPT
sudo iptables -I INPUT 6 -m state --state NEW -p tcp --dport 443 -j ACCEPT
sudo netfilter-persistent save
```

---

### Step 2.3: Install System Dependencies (Node 20, Git, Nginx, PM2)
Run inside the VM:

```bash
# Update Ubuntu packages
sudo apt update && sudo apt upgrade -y

# Install Node.js 20 LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs git nginx

# Verify installation
node -v
npm -v

# Install PM2 process manager globally
sudo npm install -g pm2
```

---

### Step 2.4: Clone & Build Your Portfolio Code
```bash
# Clone the repository
git clone https://github.com/Atharv1136/Portfolio_atharv.git app
cd app

# Install dependencies
npm install

# Setup environment variables
nano .env
```

Paste your `.env` configuration (press `Ctrl + O`, `Enter` to save, and `Ctrl + X` to exit):
```env
NODE_ENV=production
PORT=8080
STORAGE_TYPE=mongodb
MONGODB_URI=your_mongodb_connection_string
SESSION_SECRET=your_super_secret_session_key
FORCE_HTTPS=false
```
*(Keep `FORCE_HTTPS=false` initially until your SSL certificate is installed).*

Build and launch the application:
```bash
# Build frontend and bundled server
npm run build

# Start with PM2
pm2 start "npm start" --name "portfolio"

# Enable auto-start on server reboot
pm2 startup
# (Run the sudo env PATH=... command that pm2 prompts you with, if shown)
pm2 save
```

Check status:
```bash
pm2 status
```
Your app is now running locally on port `8080` inside the VM.

---

## Phase 3: Setup Nginx Reverse Proxy (Test via IP)

### Step 3.1: Create Nginx Config
```bash
sudo nano /etc/nginx/sites-available/portfolio
```

Paste the following block (this listens on port 80 and passes requests to port 8080):
```nginx
server {
    listen 80;
    server_name _;

    location / {
        proxy_pass http://localhost:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Enable the configuration:
```bash
sudo ln -s /etc/nginx/sites-available/portfolio /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl restart nginx
```

**Test:** Open your browser and navigate to `http://YOUR_ORACLE_PUBLIC_IP`. Your portfolio should load!

---

## Phase 4: Apply for Your Free `is-a.dev` Domain

Now that your VM is running and accessible via its public IP, claim your free domain:

### Step 4.1: Fork the Register Repository
1. Visit [github.com/is-a-dev/register](https://github.com/is-a-dev/register).
2. Click the **Fork** button in the top right to create a fork under your GitHub account (`Atharv1136`).

### Step 4.2: Create Your Domain JSON File
Decide on your desired subdomain name (e.g. `atharv` for `atharv.is-a.dev`).

1. In your forked repository, navigate into the **`domains/`** folder.
2. Click **Add file** > **Create new file**.
3. Name the file: `<your-subdomain>.json` (example: `atharv.json`).
4. Paste the following JSON (replace with your details):

```json
{
  "owner": {
    "username": "Atharv1136",
    "email": "your-email@example.com"
  },
  "records": {
    "A": "YOUR_ORACLE_PUBLIC_IP"
  }
}
```

> [!IMPORTANT]
> - Put your exact Oracle VM Public IP in place of `YOUR_ORACLE_PUBLIC_IP`.
> - Do not include `http://` or port numbers in the `"A"` record, only the raw IPv4 address (e.g., `"129.153.25.40"`).

### Step 4.3: Submit Pull Request
1. Commit the file to your repository.
2. Click **Contribute** > **Open Pull Request**.
3. Give your PR a clear title: `Register atharv.is-a.dev`.
4. Automated GitHub Actions checks will run to validate your JSON file syntax.
5. Maintainers will review and merge it. Once merged, DNS takes approximately 1–12 hours to propagate worldwide.

---

## Phase 5: Update Nginx with Domain & Enable Free SSL (HTTPS)

Once your domain is active and pointing to your IP:

### Step 5.1: Update Nginx `server_name`
```bash
sudo nano /etc/nginx/sites-available/portfolio
```

Change `server_name _;` to your domain:
```nginx
server_name your-subdomain.is-a.dev;
```

Reload Nginx:
```bash
sudo nginx -t
sudo systemctl reload nginx
```

### Step 5.2: Install Free Let's Encrypt SSL
```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Obtain and install SSL certificate automatically
sudo certbot --nginx -d your-subdomain.is-a.dev
```

Follow the prompts:
- Enter your email address for renewal notices.
- Agree to terms.
- Certbot will automatically modify your Nginx config to enable HTTPS and HTTP-to-HTTPS redirect.

### Step 5.3: Enable FORCE_HTTPS in Your App
Update your `.env` inside `~/app`:
```bash
nano ~/app/.env
```
Change:
```env
FORCE_HTTPS=true
```
Then restart PM2:
```bash
pm2 restart portfolio
```

---

## Maintenance & Useful Commands

| Task | Command |
| :--- | :--- |
| **Check app logs** | `pm2 logs portfolio` |
| **Restart app** | `pm2 restart portfolio` |
| **Update code after git push** | `cd ~/app && git pull && npm run build && pm2 restart portfolio` |
| **Check Nginx status** | `sudo systemctl status nginx` |
| **Test SSL auto-renewal** | `sudo certbot renew --dry-run` |
