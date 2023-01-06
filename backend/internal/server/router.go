package server

import (
	"net/http"

	"github.com/93lykevin/go-twit-backend/internal/conf"
	"github.com/93lykevin/go-twit-backend/internal/store"

	"github.com/gin-contrib/cors"
	"github.com/gin-contrib/static"
	"github.com/gin-gonic/gin"
)

// same recipe for all CRUD methods
// 1. implement function to communicate w/ database for required action (this is in the store package)
// 2. implenent Gin handler which will use function from step 1 (this is in the server package eg. /server/tweets.go)
// 3. add route with handler to router (this is here)

func setRouter(cfg conf.Config) *gin.Engine {
	// creates default gin router with Logger and Recovery middleware already attached
	router := gin.Default()

	// TODO: Using default for now but shall add more fine-tuned configs
	// https://github.com/gin-contrib/cors
	// router.Use(cors.Default())
	router.Use(cors.New(cors.Config{
		AllowOrigins: []string{"*"},
		AllowMethods: []string{"GET", "POST", "PUT", "PATCH", "DELETE"},
		AllowHeaders: []string{"Content-Type,access-control-allow-origin,access-control-allow-headers,Authorization"},
	}))

	if cfg.Env == "prod" {
		router.Use(static.Serve("/", static.LocalFile("./assets/build", true)))
	}
	// Enables automatic redirection if the current route can't be matched but a
	// handler for the path with (without) the trailing slash exists
	router.RedirectTrailingSlash = true

	// create API route group
	// use customErrors defined in middleware.go
	// we are trying to bind request data before even hitting the signUp and login handlers
	// with binding like this, handlers don't need to think about binding errors because there was none if the handler is reached!!
	api := router.Group("/api")
	api.Use(customErrors)
	{
		api.GET("/validateToken", checkIfTokenIsValid)
		api.POST("/signup", gin.Bind(store.User{}), signUp)
		api.POST("/login", gin.Bind(store.User{}), login)
	}

	// TODO: Make sure it's hitting authorized
	authorized := router.Group("/")
	authorized.Use(authorization)
	{
		authorized.GET("/logout/:userId", logout)
		authorized.GET("/tweets", indexTweets)
		authorized.POST("/tweets", createTweet)
		authorized.PUT("/tweets", updateTweet)
		authorized.DELETE("/tweets/:id", deleteTweet)
	}

	router.NoRoute(func(ctx *gin.Context) { ctx.JSON(http.StatusNotFound, gin.H{}) })

	return router
}
