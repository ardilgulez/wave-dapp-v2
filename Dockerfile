FROM node:16

COPY . .
RUN npm install 
RUN npm run hardhat compile
EXPOSE 3000

CMD [ "/usr/local/bin/npm", "start" ]
