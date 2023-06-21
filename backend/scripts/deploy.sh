#! /bin/bash

# script to automatically source and run the backend
# default ENV is dev
env=dev

# read aguments passed to the script
while test $# -gt 0; do
  # if we found -env argument, we will set the env variable to the -env argument that was passed in
  case "$1" in
    -env)
      shift
      if test $# -gt 0; then
        env=$1
      fi
      # shift
      ;;
    *)
    break
    ;;
  esac
done

#### NEW WAY OF STARTING SERVER WITH AIR
cd ../../backend
source .env
air

#### OLD WAY OF STARTING SERVER WITH go build AND EXECUTING THE `twitter_clone` file
# cd ../../backend
# source .env
# go build -o cmd/twitter-clone/twitter-clone cmd/twitter-clone/main.go
# cmd/twitter-clone/twitter-clone -env $env &
