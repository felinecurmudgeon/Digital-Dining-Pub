#!/bin/bash
source /home/ec2-user/.bash_profile
cd /home/ec2-user/myApp
echo $PATH
npm install
bower install --allow-root
forever stopall
sudo service mysqld start
forever start server/server.js
forever start server/mobileServer.js
cd client-mobile
npm install
bower install --allow-root

