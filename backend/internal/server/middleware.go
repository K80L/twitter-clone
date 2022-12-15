package server

import (
	"errors"
	"fmt"
	"net/http"
	"strings"

	"github.com/93lykevin/go-twit-backend/internal/store"
	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"
	"github.com/rs/zerolog/log"
)

// authorization middleware extracts token from Authorization header.
// it first checks if header exists, if it's in a valid format, and then calls verifyJWT() function.
// if JWT verification passes, users's ID is returned.
// User with that ID is fetched from the database and is set as the current user for this context
func authorization(ctx *gin.Context) {
	authHeader := ctx.GetHeader("Authorization")
	if authHeader == "" {
		ctx.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Authorization header missing."})
		return
	}
	headerParts := strings.Split(authHeader, " ")
	if len(headerParts) != 2 {
		ctx.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Authorization header format is not valid."})
		return
	}
	if headerParts[0] != "Bearer" {
		ctx.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Authorization header is missing bearer part."})
		return
	}
	userID, err := verifyJWT(headerParts[1])
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		return
	}
	user, err := store.FetchUser(userID)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		return
	}

	ctx.Set("user", user)
	ctx.Next()
}

// first check if user is set for this context. if not, error is returned
// since ctx.Get() returns interface, must check if value is type of *store.User. if not, error is returned
// else, return current user
func currentUser(ctx *gin.Context) (*store.User, error) {
	var err error
	_user, exists := ctx.Get("user")
	if !exists {
		err = errors.New("Current context user not set")
		log.Error().Err(err).Msg("")
		return nil, err
	}

	user, ok := _user.(*store.User)
	if !ok {
		err = errors.New("Context user is not a valid type")
		log.Error().Err(err).Msg("")
		return nil, err
	}

	return user, err
}

func customErrors(ctx *gin.Context) {
	ctx.Next()
	if len(ctx.Errors) > 0 {
		for _, err := range ctx.Errors {
			switch err.Type {
			case gin.ErrorTypePublic:
				// show public errors only if nothing has been written yet
				if !ctx.Writer.Written() {
					ctx.AbortWithStatusJSON(ctx.Writer.Status(), gin.H{"error": err.Error()})
				}
			case gin.ErrorTypeBind:
				errMap := make(map[string]string)
				if errs, ok := err.Err.(validator.ValidationErrors); ok {
					for _, fieldErr := range []validator.FieldError(errs) {
						errMap[fieldErr.Field()] = customValidationError(fieldErr)
					}
				}

				status := http.StatusBadRequest
				// preserve the current status
				if ctx.Writer.Status() != http.StatusOK {
					status = ctx.Writer.Status()
				}

				ctx.AbortWithStatusJSON(status, gin.H{"error": errMap})
			default:
				// log other errors
				log.Error().Err(err.Err).Msg("Other error")
			}
		}

		// if there was no public or bind error, display default 500 message
		if !ctx.Writer.Written() {
			ctx.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": InternalServerError})
		}
	}
}

func customValidationError(err validator.FieldError) string {
	switch err.Tag() {
	case "required":
		return fmt.Sprintf("%s is required", err.Field())
	case "min":
		return fmt.Sprintf("%s must be longer than or equal to %s characters.", err.Field, err.Param())
	case "max":
		return fmt.Sprintf("%s cannot be longer than %s characters.", err.Field(), err.Param())
	default:
		return err.Error()
	}
}
