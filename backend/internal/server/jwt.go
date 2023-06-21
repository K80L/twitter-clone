package server

import (
	"encoding/json"
	"errors"
	"fmt"
	"strconv"
	"time"

	"github.com/93lykevin/go-twit-backend/internal/conf"
	"github.com/93lykevin/go-twit-backend/internal/store"

	"github.com/cristalhq/jwt/v4"
	"github.com/rs/zerolog/log"
)

var (
	jwtSigner   jwt.Signer
	jwtVerifier jwt.Verifier
)

type TokenBody struct {
}

// jwtSetup creates a new signer and verifier to be used in authentication
func jwtSetup(conf conf.Config) {
	var err error

	// get the jwt secret key from config
	key := []byte(conf.JwtSecret)

	// create new signer from secret key
	jwtSigner, err = jwt.NewSignerHS(jwt.HS256, key)
	if err != nil {
		log.Panic().Err(err).Msg("Error creating JWT signer")
	}

	// create new verifier from secret key
	jwtVerifier, err = jwt.NewVerifierHS(jwt.HS256, key)
	if err != nil {
		log.Panic().Err(err).Msg("Error creating JWT verifier")
	}
}

func generateJWT(user *store.User) string {
	claims := &jwt.RegisteredClaims{
		ID:        fmt.Sprint(user.ID),
		ExpiresAt: jwt.NewNumericDate(time.Now().Add(time.Hour * 24 * 30)),
	}

	builder := jwt.NewBuilder(jwtSigner)
	token, err := builder.Build(claims)
	if err != nil {
		log.Panic().Err(err).Msg("Error building JWT")
	}
	return token.String()
}

func verifyJWT(tokenStr string) (int, error) {
	token, err := jwt.Parse([]byte(tokenStr), jwtVerifier)
	if err != nil {
		log.Error().Err(err).Str("tokenStr", tokenStr).Msg("Error parsing JWT")
		return 0, err
	}

	fmt.Printf("Algorithm %v\n", token.Header().Algorithm)
	fmt.Printf("Type      %v\n", token.Header().Type)
	fmt.Printf("Claims    %v\n", string(token.Claims()))
	fmt.Printf("Payload   %v\n", string(token.PayloadPart()))
	fmt.Printf("Token     %v\n", string(token.Bytes()))
	if err := jwtVerifier.Verify(token); err != nil {
		log.Error().Err(err).Msg("Error verifying JWT")
		return 0, err
	}

	var claims jwt.RegisteredClaims
	fmt.Println(string(token.ClaimsPart()))
	if err := json.Unmarshal(token.Claims(), &claims); err != nil {
		log.Error().Err(err).Msg("Error unmarshalling JWT claims")
		return 0, err
	}

	if notExpired := claims.IsValidAt(time.Now()); !notExpired {
		return 0, errors.New("Token Expired.")
	}

	id, err := strconv.Atoi(claims.ID)
	if err != nil {
		log.Error().Err(err).Str("claims.ID", claims.ID).Msg("Error converting claims ID to number")
		return 0, errors.New("ID in token is not valid")
	}

	return id, err
}
