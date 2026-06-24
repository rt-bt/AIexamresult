#!/bin/bash
set -e

echo "=== AI Exam Result - Lightsail Setup ==="

# 1. System update & dependencies
sudo apt update -y
sudo apt install -y nginx git curl build-essential

# 2. Install Node.js 24
curl -fsSL https://deb.nodesource.com/setup_24.x | sudo bash -
sudo apt install -y nodejs
node -v && npm -v

# 3. Install PM2 globally
sudo npm install -g pm2

# 4. Clone project
cd /home/ubuntu
git clone https://github.com/rt-bts-projects/a-iexamresult.git
cd a-iexamresult
npm install

# 5. Build
npm run build

# 6. Create data directories
mkdir -p data/posts

# 7. Setup nginx reverse proxy
sudo tee /etc/nginx/sites-available/aiexamresult << 'NGINX'
server {
    listen 80;
    server_name www.aiexamresult.com aiexamresult.com;

    # Static files
    location /_next/static {
        alias /home/ubuntu/a-iexamresult/.next/static;
        expires 365d;
        add_header Cache-Control "public, immutable";
    }

    location /static {
        alias /home/ubuntu/a-iexamresult/public;
        expires 30d;
    }

    # Next.js reverse proxy
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # Increase body size for data sync
        client_max_body_size 50M;
    }
}
NGINX

sudo ln -sf /etc/nginx/sites-available/aiexamresult /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t && sudo systemctl restart nginx

# 8. Start Next.js with PM2
pm2 start npm --name "aiexamresult" -- start
pm2 save
sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u ubuntu --hp /home/ubuntu

echo ""
echo "=== Setup Complete ==="
echo "Next: Copy your data files (data/scraped.json and data/posts/*.json) to /home/ubuntu/a-iexamresult/data/"
echo "Then: sudo certbot --nginx -d www.aiexamresult.com -d aiexamresult.com"
echo "Then: pm2 restart aiexamresult"
