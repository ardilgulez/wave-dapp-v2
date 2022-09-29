FROM node:16

WORKDIR /app
COPY . /app
RUN npm install
EXPOSE 3000

CMD [ "/usr/local/bin/npm", "start" ]
