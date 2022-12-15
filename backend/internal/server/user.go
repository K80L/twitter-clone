package server

import (
	"fmt"
	"net/http"

	"github.com/93lykevin/go-twit-backend/internal/store"
	"github.com/gin-gonic/gin"
)

// handlers only handle database errors now since we took care of binding in router.go
func signUp(ctx *gin.Context) {
  // we don't have to worry about binding in the handlers now.
  // they grab the bounded user via context and using ctx.MustGet
  // we bound the user inside router.go
  user := ctx.MustGet(gin.BindKey).(*store.User)

  // attempt to add the new User to the database
  if err := store.AddUser(user); err != nil {
    ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": err.Error()})
    return
  }

  ctx.JSON(http.StatusOK, gin.H{
    "msg": "Signed up successfully.",
    "jwt": generateJWT(user),
  })
}
 
func signIn(ctx *gin.Context) {
  fmt.Println("BBBBBBBBBBBBBBBB")
  user := ctx.MustGet(gin.BindKey).(*store.User)

  user, err := store.Authenticate(user.Username, user.Password)
  if err != nil {
    ctx.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Sign in failed."})
    return
  }

  ctx.JSON(http.StatusOK, gin.H{
    "msg": "Signed in successfully.",
    "jwt": generateJWT(user),
  })
}
