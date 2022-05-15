#! /bin/bash

# script to automatically source and run the backend
# default ENV is dev
env=dev

while test $# -gt 0; do
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

cd ../../backend
source .env
go build -o cmd/twitter-clone/twitter-clone cmd/twitter-clone/main.go
cmd/twitter-clone/twitter-clone -env $env &
