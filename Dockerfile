FROM node:16

WORKDIR /app
COPY . /app
RUN npm install
ENV NETWORK=host
EXPOSE 3000

CMD [ "/bin/bash", "entrypoint.sh" ]
