#!/bin/bash

container_find=${RM_CONTAINER:=imd_kp_api}

docker ps -a | grep -q $container_find

find_iszero=$?

if [ $find_iszero -eq 0 ]
    then
        echo 'container' $container_find 'found! going to stop' $container_find
        sudo docker stop $container_find
        sleep 10
    else
        echo 'container' $container_find 'not found'
fi