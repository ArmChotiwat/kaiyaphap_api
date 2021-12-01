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

FROM node:12.16.1-buster
# FROM node:14.9.0-buster

# Arguments
ARG HTTPPORT=8800

# Environments
ENV HTTPPORT=${HTTPPORT}
ENV JWTSECRET=orangesGO2Stop
ENV CORSURL=*
ENV MORGANLOG=dev
ENV ADMINEMAIL=kaiyaphap@imd.co.th
ENV NOREPLYEMAIL=kaiyaphap@imd.co.th
ENV NOREPLYSERVER=mail.imd.co.th
ENV NOREPLYPASSWORD=rsP8KVHwzP
ENV MONGODB_URI=mongodb://root:1qaz2wsx@192.168.12.24:27017/imd_kaiyaparp?authSource=admin&readPreference=primary&ssl=false
ENV TZ=Asia/Bangkok

RUN mkdir -p /root/app
WORKDIR /root/app
COPY . /root/app
RUN yarn install
RUN yarn global add pm2
EXPOSE ${HTTPPORT}
# CMD yarn start_pm2
CMD yarn start