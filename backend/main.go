package main

import (
	"fmt"

	"github.com/93lykevin/go-twit-backend/conf"
	"github.com/93lykevin/go-twit-backend/server"
)

func main() {
	fmt.Println("Starting our app")

	// start the server from backend/server package
	server.Start(conf.NewConfig())
}
