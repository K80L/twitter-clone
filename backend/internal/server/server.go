package server

import (
	"github.com/93lykevin/go-twit-backend/internal/conf"
	"github.com/93lykevin/go-twit-backend/internal/database"
	"github.com/93lykevin/go-twit-backend/internal/store"
)

func Start(cfg conf.Config) {
	// call jwtSetup to create signer and verifier that will later be used in authentication
	jwtSetup(cfg)

	// set the store database connection
	store.SetDBConnection(database.NewDBOptions(conf.NewConfig()))

	// set the router
	router := setRouter()

	// start listening and serving requests on port :8080
	router.Run(":8080")
}
