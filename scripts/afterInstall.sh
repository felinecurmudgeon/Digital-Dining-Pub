#!/bin/bash
source /home/ec2-user/.bash_profile
cd /home/ec2-user/myApp
echo $PATH
echo 'hi mom'
# npm install
bower install --allow-root
echo 'hi dad'
# forever stopall
# sudo service mysqld start
# # forever start server/server.js
cd client-mobile
# # npm install
bower install --allow-root
echo 'flag M'
ionic serve -a

