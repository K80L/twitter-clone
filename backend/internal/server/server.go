package server

import (
	"context"
	"errors"
	"net/http"
	"os"
	"os/signal"

	"syscall"
	"time"

	"github.com/93lykevin/go-twit-backend/internal/conf"
	"github.com/93lykevin/go-twit-backend/internal/database"
	"github.com/93lykevin/go-twit-backend/internal/store"

	"github.com/rs/zerolog/log"
)

const InternalServerError = "Something went wrong!"

func Start(cfg conf.Config) {
	// call jwtSetup to create signer and verifier that will later be used in authentication
	jwtSetup(cfg)

	// set the store database connection
	store.SetDBConnection(database.NewDBOptions(conf.NewConfig()))

	// set the router
	router := setRouter()

	server := &http.Server{
		Addr: cfg.Host + ":" + cfg.Port,
		Handler: router,
	}

	// Initializing the server in a goroutine so that 
	// it won't block the graceful shutdown handling below
	go func() {
		if err := server.ListenAndServe(); err != nil && errors.Is(err, http.ErrServerClosed) {
			log.Error().Err(err).Msg("Server ListenAndServe error")
		}
	}()

	// Wait for interrupt signal to gracefully shutdown the server with
	// a timeout of 5 seconds.
	quit := make(chan os.Signal)
	// kill (no param) default send syscall.SIGTERM
	// kill -2 is syscall.SIGINT
	// kill -9 is syscall.SIGKILL but can't be catch, so don't need to add it 
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<- quit
	log.Info().Msg("Shutting down server...")

	// The context is used to inform the server that it has 5 seconds to finish
	//the request it is currently handling
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	if err := server.Shutdown(ctx); err != nil {
		log.Fatal().Err(err).Msg("Server forced to shutdown")
	}

	log.Info().Msg("Server exiting.")
}

