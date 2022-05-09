package cli

import (
	"flag"
	"fmt"
	"os"

	"github.com/93lykevin/go-twit-backend/internal/logging"
)

func usage() {
	fmt.Print(`This program runs twitter-clone backend server.

	Usage:

	twitter-clone [arguments]

	Supported arguments:
	`)
	flag.PrintDefaults()
	os.Exit(1)
}

func Parse() {
	flag.Usage = usage
	env := flag.String("env", "dev", `Sets run environment. Possible values are "dev" and "prod"`)
	flag.Parse()
	logging.ConfigureLogger(*env)
	if *env == "prod" {
		logging.SetGinLoggingToFile()
	}
}
