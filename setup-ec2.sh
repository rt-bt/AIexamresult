#!/bin/bash
set -e

echo "=== AI Exam Result - EC2 Setup ==="

# 1. System update & dependencies
sudo apt update -y
sudo apt install -y nginx git curl build-essential

# 2. Add swap (important for t2.micro - 1GB RAM)
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab

# 3. Install Node.js 22 LTS
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo bash -
sudo apt install -y nodejs
node -v && npm -v

# 4. Install PM2
sudo npm install -g pm2

# 5. Clone project
cd /home/ubuntu
git clone https://github.com/rt-bts-projects/a-iexamresult.git
cd a-iexamresult
npm install

# 6. Build
NODE_OPTIONS="--max-old-space-size=512" npm run build

# 7. Data directory
mkdir -p data/posts

# 8. Setup nginx reverse proxy
sudo tee /etc/nginx/sites-available/aiexamresult << 'NGINX'
server {
    listen 80;
    server_name _;

    location /_next/static {
        alias /home/ubuntu/a-iexamresult/.next/static;
        expires 365d;
        add_header Cache-Control "public, immutable";
    }

    location /static {
        alias /home/ubuntu/a-iexamresult/public;
        expires 30d;
    }

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
        client_max_body_size 50M;
    }
}
NGINX

sudo ln -sf /etc/nginx/sites-available/aiexamresult /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t && sudo systemctl restart nginx

# 9. Start Next.js with PM2 (limit memory)
pm2 start npm --name "aiexamresult" -- start
pm2 save
sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u ubuntu --hp /home/ubuntu

echo ""
echo "=== EC2 Setup Complete ==="
echo ""
echo "Next steps:"
echo "  1. Upload data files (run locally):"
echo "     .\\deploy-ec2.ps1 -HostIP <EC2_PUBLIC_IP>"
echo ""
echo "  2. Configure SSL (after DNS points to this server):"
echo "     sudo apt install -y certbot python3-certbot-nginx"
echo "     sudo certbot --nginx -d www.aiexamresult.com"
echo ""
echo "  3. If build fails due to memory, upgrade to t3.small or run build on local and upload .next folder"
