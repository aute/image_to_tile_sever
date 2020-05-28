FROM node:12

WORKDIR /usr/app

VOLUME /usr/app/files

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8080

CMD [ "/bin/bash", "start.sh" ]

