package store

import (
	"context"
	"crypto/rand"
	"time"

	"github.com/go-pg/pg/v10"
	"github.com/rs/zerolog/log"
	"golang.org/x/crypto/bcrypt"
)

type User struct {
	ID             int
	Username       string `binding:"required,min=5,max=30"`
	Password       string `pg:"-" binding:"required,min=7,max=32"`
	HashedPassword []byte `json:"-"`
	Salt           []byte `json:"-"`
	CreatedAt      time.Time
	UpdatedAt      time.Time
	Tweets         []*Tweet `json:"-" pg:"fk:user_id,rel:has-many,on_delete:CASCADE"`
}

// AfterSelectHook will be executed after every Select() query. if there is no tweets,
// the db will return nil but that will be bad for the FE. this hook will instead return an empty slice
var _ pg.AfterSelectHook = (*User)(nil)

func (user *User) AfterSelect(ctx context.Context) error {
	if user.Tweets == nil {
		user.Tweets = []*Tweet{}
	}
	return nil
}

// AddUser creates a user and adds it to the database
func AddUser(user *User) error {
	salt, err := GenerateSalt()
	if err != nil {
		return err
	}

	toHash := append([]byte(user.Password), salt...)
	hashedPassword, err := bcrypt.GenerateFromPassword(toHash, bcrypt.DefaultCost)
	if err != nil {
		return err
	}

	user.Salt = salt
	user.HashedPassword = hashedPassword

	_, err = db.Model(user).Returning("*").Insert()
	if err != nil {
		return err
	}

	return err
}

// Authenticate verifies if a username and password are valid for a user
func Authenticate(username, password string) (*User, error) {
	user := new(User)
	if err := db.Model(user).Where(
		"username = ?", username).Select(); err != nil {
		return nil, err
	}
	salted := append([]byte(password), user.Salt...)
	if err := bcrypt.CompareHashAndPassword(user.HashedPassword, salted); err != nil {
		return nil, err
	}
	return user, nil
}

func GenerateSalt() ([]byte, error) {
	salt := make([]byte, 16)
	if _, err := rand.Read(salt); err != nil {
		log.Error().Err(err).Msg("Unable to create salt")
		return nil, err
	}
	return salt, nil
}

func FetchUser(id int) (*User, error) {
	user := new(User)
	user.ID = id
	err := db.Model(user).Returning("*").WherePK().Select()
	if err != nil {
		log.Error().Err(err).Msg("Error fetching user")
		return nil, err
	}
	return user, nil
}
