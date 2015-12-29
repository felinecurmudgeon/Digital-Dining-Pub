#!/bin/bash
source /home/ec2-user/.bash_profile
cd /home/ec2-user/myApp
echo $PATH
# npm install
sudo env "PATH=$PATH" bower install --allow-root
# forever stopall
# sudo service mysqld start
# forever start server/server.js
cd client-mobile
# npm install
sudo env "PATH=$PATH" bower install --allow-root
ionic serve -a
