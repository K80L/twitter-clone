package store

import (
	"log"

	"github.com/go-pg/pg/v10"
)

// database connector for the store package
var db *pg.DB

// setter function for database connection.
// will be used immediately b/c we need to set our db connector
func SetDBConnection(dbOpts *pg.Options) {
	if dbOpts == nil {
		log.Panicln("DB options cannot be nil")
	} else {
		db = pg.Connect(dbOpts)
	}
}

// getter function for database connection.
// will be used to run migrations.
func GetDBConnection() *pg.DB { return db }
