package store

import (
	"errors"
	"fmt"
	"log"
	"regexp"
	"strings"

	"github.com/go-pg/pg/v10"
)

// store package will be the only thing to ever communicate with the database

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

func dbError(_err interface{}) error {
	if _err == nil {
		return nil
	}

	switch _err.(type) {
	case pg.Error:
		err := _err.(pg.Error)
		switch err.Field(82) {
		case "_bt_check_unique":
			return errors.New(extractColumnName(err.Field(110)))
		}
	case error:
		err := _err.(error)
		switch err.Error() {
		case "pg: no rows in result set":
			return errors.New("Not found.")
		}
		return err
	}
	return errors.New(fmt.Sprint(_err))
}

func extractColumnName(text string) string {
	reg := regexp.MustCompile(`.+_(.+)_.+`)
	if reg.MatchString(text) {
		return strings.Title(reg.FindStringSubmatch(text)[1])
	}
	return "Unknown"
}

// TODO: FIXME
// func ResetTestDatabase() {
// 	// connect to test database
// 	SetDBConnection(database.NewDBOptions(conf.NewTestConfig()))

// 	// empty all tables and restart sequence counters
// 	tables := []string{"users", "tweets"}
// 	for _, table := range tables {
// 		_, err := db.Exec(fmt.Sprintf("DELETE FROM %s;", table))
// 		if err != nil {
// 			log.Panic().Err(err).Str("Table", table).Msg("Error clearing test database")
// 		}

// 		_, err := db.Exec(fmt.Sprintf("ALTER SEQUENCE %s_id_seq RESTART;", table))
// 	}
// }
