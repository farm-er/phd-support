package database

import (
	"database/sql"
)

type Db struct {
	Db *sql.DB
}

func NewDb() (*Db, error) {

	db, r := sql.Open("sqlite3", "./database/database.db")

	if r != nil {
		return nil, r
	}

	r = db.Ping()

	if r != nil {
		return nil, r
	}

	_, r = db.Exec(`
		BEGIN TRANSACTION;
		CREATE TABLE IF NOT EXISTS STATISTICS (
			DAY TEXT NOT NULL PRIMARY KEY,
			CONS FLOAT,
			PROD FLOAT
		);
		CREATE TABLE IF NOT EXISTS TASKS (
			ID INTEGER PRIMARY KEY AUTOINCREMENT,
			LIST TEXT,
			TITLE TEXT,
			CREATED TEXT,
			FOR TEXT,
			BODY TEXT
		);
		COMMIT;
	`)

	if r != nil {
		return nil, r
	}

	return &Db{
		Db: db,
	}, nil
}
