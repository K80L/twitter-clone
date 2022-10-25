package conf

import (
	"log"
	"os"
	"strconv"
)

const (
	hostKey = "TWIT_HOST"
	portKey = "TWIT_PORT"
	dbHostKey = "TWIT_DB_HOST"
	dbPortKey = "TWIT_DB_PORT"
	dbNameKey = "TWIT_DB_NAME"
	dbUserKey = "TWIT_DB_USER"
	dbPasswordKey = "TWIT_DB_PASSWORD"
	jwtSecretKey = "TWIT_JWT_SECRET"
)

type Config struct {
	Host string
	Port string
	DbHost string
	DbPort string
	DbName string
	DbUser string
	DbPassword string
	JwtSecret string
}

func NewConfig() Config {
	host, ok := os.LookupEnv(hostKey)
	if !ok || host == "" {
		logAndPanic(hostKey)
	}

	port, ok := os.LookupEnv(portKey)
	if !ok || port == "" {
		if _, err := strconv.Atoi(port); err != nil {
			logAndPanic(portKey)
		}
	}

	dbHost, ok := os.LookupEnv(dbHostKey)
	if !ok || dbHost == "" {
		logAndPanic(dbHostKey)
	}

	dbPort, ok := os.LookupEnv(dbPortKey)
	if !ok || dbPort == "" {
		if _, err := strconv.Atoi(dbPort); err != nil {
			logAndPanic(dbPortKey)
		}
	}

	dbName, ok := os.LookupEnv(dbNameKey)
	if !ok || dbName == "" {
		logAndPanic(dbNameKey)
	}
	
	dbUser, ok := os.LookupEnv(dbUserKey)
	if !ok || dbUser == "" {
		logAndPanic(dbUserKey)
	}

	dbPassword, ok := os.LookupEnv(dbPasswordKey)
	if !ok || dbPassword == "" {
		logAndPanic(dbPasswordKey)
	}

	jwtSecret, ok := os.LookupEnv(jwtSecretKey)
	if !ok || jwtSecret == "" {
		logAndPanic(jwtSecretKey)
	}

	return Config{
		Host: host,
		Port: port,
		DbHost: dbHost,
		DbPort: dbPort,
		DbName: dbName,
		DbUser: dbUser,
		DbPassword: dbPassword,
		JwtSecret: jwtSecret,
	}
}

func logAndPanic(envVar string) {
	log.Panicf("ENV variable not set or value not valid, %s", envVar)
	// log.Panic("ENV variable not set or value not valid)
	// log.Println("ENV variable not set or value not valid")
	panic(envVar)
}

