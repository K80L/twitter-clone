package store

import (
	"time"

	"github.com/go-pg/pg/v10/orm"
	"github.com/rs/zerolog/log"
)

// Our Tweet model - This is what we are storing in the DB
type Tweet struct {
	ID        int
	Content   string `binding:"required,min=1,max=144"`
	CreatedAt time.Time
	UpdatedAt time.Time
	UserID    int   `json:"-"` // the `json:"-"` tag instructs the JSON encoder to ignore the UserID field when marshallig the Tweet
	User      *User `pg:"rel:has-one"`
}

type TweetWithUser struct {
	Tweet
	User *User `pg:"rel:has-one"`
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

func GetAllTweets() ([]TweetWithUser, error) {
	tweets := make([]Tweet, 0)

	err := db.Model(&tweets).
		Relation("User").
		Select()

	if err != nil {
		log.Error().Err(err).Msg("Error fetching all tweets")
	}

	tweetsWithUser := make([]TweetWithUser, 0, len(tweets))

	// Convert the tweets to tweet responses
	for _, tweet := range tweets {
		tweetWithUser := TweetWithUser{
			Tweet: tweet,
			User:  tweet.User,
		}

		tweetsWithUser = append(tweetsWithUser, tweetWithUser)
	}

	return tweetsWithUser, err
}

func GetCurrentUserTweets(user *User) error {
	err := db.Model(user).
		WherePK(). // `WherePK()` clause adds the primary key condition to the query
		Relation("Tweets", func(q *orm.Query) (*orm.Query, error) {
			return q.Order("id ASC"), nil
		}).
		Select()

	// We are hitting this error for some reason
	if err != nil {
		log.Error().Err(err).Msg("Error fetching current user's tweets")
	}

	return err
}

func GetTweetsByUserId(userId int) ([]TweetWithUser, error) {
	tweets := make([]Tweet, 0)

	err := db.Model(&tweets).
		Where("user_id = ?", userId).
		Relation("User").
		Select()

	if err != nil {
		log.Error().Err(err).Msg("Error fetching user's tweets")
		return nil, err
	}

	// Create a separate slice for the response
	tweetsWithUser := make([]TweetWithUser, 0, len(tweets))

	// Convert the tweets to tweet responses
	for _, tweet := range tweets {
		tweetWithUser := TweetWithUser{
			Tweet: tweet,
			User:  tweet.User,
		}

		tweetsWithUser = append(tweetsWithUser, tweetWithUser)
	}

	return tweetsWithUser, err
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
