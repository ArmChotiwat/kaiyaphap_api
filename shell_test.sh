#! /bin/bash

sudo docker stop imd_kp_api
sudo docker run --rm -i -t -d --name imd_kp_api --hostname imd_kp_api -p 8800:8800/tcp imd_kaiyaphap_api