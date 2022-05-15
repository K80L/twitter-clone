package main

import (
	"fmt"

	"github.com/go-pg/migrations/v8"
)

func init() {
	migrations.MustRegisterTx(func(db migrations.DB) error {
		fmt.Println("creating table tweets...")
		_, err := db.Exec(`CREATE TABLE tweets(
			id SERIAL PRIMARY KEY,
			content TEXT NOT NULL,
			created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
			updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
			user_id INT REFERENCES users ON DELETE CASCADE
		)`)
		return err
	}, func(db migrations.DB) error {
		fmt.Println("dropping table tweets...")
		_, err := db.Exec(`DROP TABLE tweets`)
		return err
	})
}
