package server

import (
	"net/http"
	"testing"

	"github.com/93lykevin/go-twit-backend/internal/store"

	"github.com/stretchr/testify/assert"
)

func TestSignUp(t *testing.T) {
	router := testSetup()

	body := userJSON(store.User{
		Username: "batman",
		Password: "secret123",
	})
	rec := performRequest(router, "POST", "/api/signup", body)

	assert.Equal(t, http.StatusOK, rec.Code)
	assert.Equal(t, "Signed up successfully.", jsonRes(rec.Body)["msg"])
	assert.NotEmpty(t, jsonRes(rec.Body)["jwt"])
}
