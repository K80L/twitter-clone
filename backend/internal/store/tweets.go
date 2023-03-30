package store

import (
	"time"

	"github.com/go-pg/pg/v10/orm"
	"github.com/rs/zerolog/log"
)

type Tweet struct {
	ID        int
	Content   string `binding:"required,min=1,max=144"`
	CreatedAt time.Time
	UpdatedAt time.Time
	UserID    int `json:"-"`
}

// reminder, only packages in the store can communicate with the database
// AddTweet is the actual function that communicates with the database to create a new Tweet
// This gets called by server/tweet.go
func AddTweet(user *User, tweet *Tweet) error {
	tweet.UserID = user.ID
	_, err := db.Model(tweet).Returning("*").Insert()
	if err != nil {
		log.Error().Err(err).Msg("Error inserting new tweet")
	}
	return err
}

func FetchUserTweets(user *User) error {
	err := db.Model(user).
		Relation("Tweets", func(q *orm.Query) (*orm.Query, error) {
			return q.Order("id ASC"), nil
		}).
		Select()
	if err != nil {
		log.Error().Err(err).Msg("Error fetching user's tweets")
	}
	return err
}

func FetchTweet(id int) (*Tweet, error) {
	tweet := new(Tweet)
	tweet.ID = id
	err := db.Model(tweet).WherePK().Select()
	if err != nil {
		log.Error().Err(err).Msg("Error fetching tweet")
		return nil, err
	}
	return tweet, nil
}

func UpdateTweet(tweet *Tweet) error {
	_, err := db.Model(tweet).WherePK().UpdateNotZero()
	if err != nil {
		log.Error().Err(err).Msg("Error updating tweet")
	}
	return err
}

func DeleteTweet(tweet *Tweet) error {
	_, err := db.Model(tweet).WherePK().Delete()
	if err != nil {
		log.Error().Err(err).Msg("Error deleting tweet")
	}
	return err
}
