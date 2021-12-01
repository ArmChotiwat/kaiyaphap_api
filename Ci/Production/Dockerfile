# ***** Environments *****
# HTTPPORT : 'this is api out port || Example `EXPRESSPORT=8800` '
# JWTSECRET : 'JWT Secret Encrypt || Example `SECRET=fishWasE8enbyCat007` '
# CORSURL : 'Cors Origin Rule || Example `CORSURL=*` || Example `CORSURL=http://kaiyaphap.imd.co.th` || Example `CORSURL=http://kaiyaphap.imd.co.th,http://kaiyaphap.imd.co.th:8802` '
# MORGANLOG : 'Morgan {ref: Morgan NodeJS} HTTP Tracker Log || Example `MORGANLOG=dev` Example `MORGANLOG=common` '
# ADMINEMAIL : 'IMD Protal Login User || Example `ADMINEMAIL=kaiyaphap@imd.co.th` '
# NOREPLYEMAIL : 'no-reply System email || Example `NOREPLYEMAIL=kaiyaphap@imd.co.th` '
# NOREPLYSERVER : 'no-reply System email Server || Example `NOREPLYSERVER=mail.imd.co.th` '
# NOREPLYPASSWORD : 'no-reply System email Password || Example `NOREPLYPASSWORD=rsP8KVHwzP` '
# MONGODB_URI : mongodb url connection string || Example `MONGODB_URI=mongodb://${username}:${password}@${hostname}:${ports}/${database}?authSource=admin&readPreference=primary&ssl=false`

# Docker Image
FROM node:12.16.1-buster

# Arguments
ARG HTTPPORT=8081

# Environments
ENV HTTPPORT=${HTTPPORT}
ENV MONGODB_URI=mongodb://username:password@127.0.0.1:27017/kaiyaphap_database?authSource=admin&authMechanism=SCRAM-SHA-256&readPreference=primary&ssl=false
ENV TZ=Asia/Bangkok

USER node

RUN mkdir -p /home/node/app
WORKDIR /home/node/app

RUN mkdir -p /home/node/app/Log
RUN mkdir -p /home/node/app/media

COPY ./Config /home/node/app/Config
COPY ./Controller /home/node/app/Controller
COPY ./Middleware /home/node/app/Middleware
COPY ./Model /home/node/app/Model
COPY ./Route /home/node/app/Route
COPY ./package.json /home/node/app/package.json
COPY ./yarn.lock /home/node/app/yarn.lock
COPY ./index.js /home/node/app/index.js

RUN yarn install
RUN yarn global add pm2

EXPOSE ${HTTPPORT}
CMD yarn start_pm2