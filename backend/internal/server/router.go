package server

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

// same recipe for all CRUD methods
// 1. implement function to communicate w/ database for required action
// 2. implenent Gin handler which will use function from step 1
// 3. add route with handler to router

func setRouter() *gin.Engine {
	// creates default gin router with Logger and Recovery middleware already attached
	router := gin.Default()

	// Enables automatic redirection if the current route can't be matched but a
	// handler for the path with (without) the trailing slash exists
	router.RedirectTrailingSlash = true

	// create API route group
	api := router.Group("/api")
	{
		api.POST("/signup", signUp)
		api.POST("/signin", signIn)
	}

	authorized := api.Group("/")
	authorized.Use(authorization)
	{
		authorized.GET("/tweets", indexTweets)
		authorized.POST("/tweets", createTweet)
		authorized.PUT("/tweets", updateTweet)
		authorized.DELETE("/tweets/:id", deleteTweet)
	}

	router.NoRoute(func(ctx *gin.Context) { ctx.JSON(http.StatusNotFound, gin.H{}) })

	return router
}
