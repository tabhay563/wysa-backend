#!/bin/bash
echo "Starting Wysa Backend Deployment..."

sudo apt update && sudo apt upgrade -y

curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

sudo npm install -g pm2

npm install

npx prisma generate

npm run build

mkdir -p logs

pm2 start ecosystem.config.js

pm2 save

pm2 startup

echo "Deployment completed!"
echo "API running on port 3000"
echo "Check status: pm2 status"
echo "View logs: pm2 logs wysa-backend" 