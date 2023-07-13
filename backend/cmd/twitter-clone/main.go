package main

import (
	"fmt"

	"github.com/93lykevin/go-twit-backend/internal/cli"
	"github.com/93lykevin/go-twit-backend/internal/conf"
	"github.com/93lykevin/go-twit-backend/internal/server"
)

func main() {
	fmt.Println("STARTINGGGGGGG 123123123")

	// start the server from backend/server package using the cli script
	env := cli.Parse()
	server.Start(conf.NewConfig(env))
}
