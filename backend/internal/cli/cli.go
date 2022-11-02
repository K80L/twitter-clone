package cli

import (
	"flag"
	"fmt"
	"os"

	"github.com/93lykevin/go-twit-backend/internal/logging"
)

// set usage text to be printed if app is started with some invalid options or args
func usage() {
	fmt.Print(`This program runs twitter-clone backend server.

	Usage:

	twitter-clone [arguments]

	Supported arguments:
	`)
	flag.PrintDefaults()
	os.Exit(1)
}

func Parse() string {
	flag.Usage = usage
	env := flag.String("env", "dev", `Sets run environment. Possible values are "dev" and "prod"`)
	// parse all CLI flags with flag.Parse()
	flag.Parse()
	logging.ConfigureLogger(*env)
	if *env == "prod" {
		logging.SetGinLogToFile()
	}
	return *env
}
