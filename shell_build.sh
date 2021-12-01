#! /bin/bash

sudo docker system prune -f
sudo docker build --no-cache -t imd_kaiyaphap_api .