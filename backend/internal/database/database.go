package database

import (
	"github.com/93lykevin/go-twit-backend/internal/conf"
	"github.com/go-pg/pg/v10"
)

// to connect to database with psql:
// $ psql twitter-clon
func NewDBOptions(cfg conf.Config) *pg.Options {
	return &pg.Options{
		Addr:     cfg.DbHost + ":" + cfg.DbPort,
		Database: cfg.DbName,
		User:     cfg.DbUser,
		Password: cfg.DbPassword,
	}
}
