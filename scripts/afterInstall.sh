#!/bin/bash
source /home/ec2-user/.bash_profile
cd /home/ec2-user/myApp
npm install
forever stopall
forever start server/server.js