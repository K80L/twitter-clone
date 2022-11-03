FROM node:16 AS frontendBuilder
 
# set app work dir
WORKDIR ../../backend
 
# copy frontend files to the container
COPY ../../frontend/ .
 
# set frontend/ as work dir to build frontend static files
# WORKDIR ../../frontend
RUN npm install
RUN npm run build
 
FROM golang:1.16.3 AS backendBuilder
 
# set app work dir
WORKDIR /Users/kevintly1/projects/twitter-clone/backend
 
# copy all files to the container
COPY . .
 
RUN echo "$PWD"
# build app executable
RUN CGO_ENABLED=0 GOOS=linux go build -o /Users/kevintly1/projects/twitter-clone/backend/cmd/twitter-clone/twitter-clone Users/kevintly1/projects/twitter-clone/backend/cmd/twitter-clone/main.go
 
# build migrations executable
RUN CGO_ENABLED=0 GOOS=linux go build -o Users/kevintly1/projects/twitter-clone/backend/migrations/migrations Users/kevintly1/projects/twitter-clone/backend/migrations/*.go
 
FROM alpine:3.14
 
# Create a group and user deploy
RUN addgroup -S deploy && adduser -S deploy -G deploy
 
ARG ROOT_DIR=/home/deploy/twitter-clone
 
WORKDIR ${ROOT_DIR}
 
RUN chown deploy:deploy ${ROOT_DIR}
 
# copy static assets file from frontend build
COPY --from=frontendBuilder --chown=deploy:deploy /Users/kevintly1/projects/twitter-clone/backend/build /Users/kevintly1/projects/twitter-clone/frontend/build
 
# copy app and migrations executables from backend builder
COPY --from=backendBuilder --chown=deploy:deploy ../../backend/twitter-clone/migrations/migrations ./migrations/
COPY --from=backendBuilder --chown=deploy:deploy ../../backend/twitter-clone/cmd/twitter-clone/twitter-clone .
 
# set user deploy as current user
USER deploy
 
# start app
CMD [ "./twitter-clone", "-env", "prod" ]
