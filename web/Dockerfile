FROM node
WORKDIR /web
COPY package*.json .
RUN ["npm", "install"]
COPY . .
RUN ["npm", "run", "build"]
FROM node
WORKDIR /web
RUN ["npm", "install", "-g", "serve"]
COPY --from=0 /web/build .
ENTRYPOINT ["serve"]
