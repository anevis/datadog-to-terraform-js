FROM node:12.16 as node

COPY package.json yarn.lock .eslintrc.yml sonar-project.properties tsconfig.json audit-ignore.json /root/app/

WORKDIR /root/app
RUN yarn install

COPY public/ /root/app/public/
COPY src/ /root/app/src/
COPY ci/indocker/ /root/app/ci/indocker/
