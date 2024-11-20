package database

import (
	"database/sql"
)

type Db struct {
	Db *sql.DB
}

// TODO: create database.db file if it does not exist

// TODO: make all operations at the start one transaction using db.begin()

func NewDb() (*Db, error) {

	db, r := sql.Open("sqlite3", "./database/database.db")

	if r != nil {
		return nil, r
	}

	r = db.Ping()

	if r != nil {
		return nil, r
	}

	// drop tables for debugging
	_, r = db.Exec(`
		BEGIN TRANSACTION;

			DROP TABLE IF EXISTS WEEK_STATISTICS;
			DROP TABLE IF EXISTS DAY_STATISTICS;
			DROP TABLE IF EXISTS STATISTICS;
			DROP TABLE IF EXISTS TASKS;
			DROP TABLE IF EXISTS HISTORY_DAY;
			DROP TABLE IF EXISTS ACTIVITY;
			DROP TABLE IF EXISTS TOPIC;
			DROP TABLE IF EXISTS FILE;
		
		COMMIT;
	`)

	if r != nil {
		return nil, r
	}

	// this is the History data
	_, r = db.Exec(`
		BEGIN TRANSACTION;

			CREATE TABLE IF NOT EXISTS HISTORY_DAY (
				ID INTEGER PRIMARY KEY AUTOINCREMENT,
				DAY TEXT
			);

			CREATE TABLE IF NOT EXISTS ACTIVITY (
				DAY INTEGER,
				TIME TEXT,
				TITLE TEXT,
				LINK TEXT,
				DURATION FLOAT,
				TYPE TEXT,
				FOREIGN KEY (DAY) REFERENCES HISTORY_DAY( ID)
			);
		
		COMMIT;
	`)

	if r != nil {
		return nil, r
	}

	// this is the statistics data
	_, r = db.Exec(`
		BEGIN TRANSACTION;

			CREATE TABLE IF NOT EXISTS WEEK_STATISTICS (
				ID INTEGER PRIMARY KEY AUTOINCREMENT,
				CONS FLOAT,
				PROD FLOAT
			);
			
			CREATE TABLE IF NOT EXISTS DAY_STATISTICS (
				WEEK INTEGER,
				DAY TEXT,
				CONS FLOAT,
				PROD FLOAT,
				FOREIGN KEY (WEEK) REFERENCES WEEK_STATISTICS(ID)
			);

			CREATE TABLE IF NOT EXISTS STATISTICS (
				WEEK_ID INTEGER,
				TODO INTEGER,
				INPROGRESS INTEGER,
				DONE INTEGER,
				HOLD INTEGER,
				FOREIGN KEY (WEEK_ID) REFERENCES WEEK_STATISTICS(ID)
			);
		
		COMMIT;
	`)

	if r != nil {
		return nil, r
	}

	// this is the tasks data
	_, r = db.Exec(`
		BEGIN TRANSACTION;

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

	// directories and files
	_, r = db.Exec(`
		BEGIN TRANSACTION;

			CREATE TABLE IF NOT EXISTS TOPIC (
				ID INTEGER PRIMARY KEY AUTOINCREMENT,
				TITLE TEXT
			);

			CREATE TABLE IF NOT EXISTS FILE (
				ID INTEGER PRIMARY KEY AUTOINCREMENT,
				TOPIC INTEGER,
				TITLE TEXT,
				TYPE TEXT,
				LAST_UPDATE TEXT,
				FOREIGN KEY (TOPIC) REFERENCES TOPIC( ID)
			);
		
		COMMIT;
	`)

	if r != nil {
		return nil, r
	}

	// this is for the triggers to update statistics based on tasks changes
	_, r = db.Exec(`
		BEGIN TRANSACTION;

			CREATE TRIGGER IF NOT EXISTS TASKS_UPDATE AFTER UPDATE ON TASKS
			BEGIN

				UPDATE STATISTICS
				SET 
					TODO = CASE
						WHEN OLD.LIST = 'todo' THEN TODO - 1
						WHEN NEW.LIST = 'todo' THEN TODO + 1
						ELSE TODO
						END,
					INPROGRESS = CASE
						WHEN OLD.LIST = 'inprogress' THEN INPROGRESS - 1
						WHEN NEW.LIST = 'inprogress' THEN INPROGRESS + 1
						ELSE INPROGRESS
						END,
					DONE = CASE
						WHEN OLD.LIST = 'done' THEN DONE - 1
						WHEN NEW.LIST = 'done' THEN DONE + 1
						ELSE DONE
						END,
					HOLD = CASE
						WHEN OLD.LIST = 'hold' THEN HOLD - 1
						WHEN NEW.LIST = 'hold' THEN HOLD + 1
						ELSE HOLD
						END;

			END;

			CREATE TRIGGER IF NOT EXISTS TASKS_INSERT AFTER INSERT ON TASKS
			BEGIN
				UPDATE STATISTICS
				SET 
					TODO = CASE
						WHEN NEW.LIST = 'todo' THEN TODO + 1
						ELSE TODO
						END,
					INPROGRESS = CASE
						WHEN NEW.LIST = 'inprogress' THEN INPROGRESS + 1
						ELSE INPROGRESS
						END,
					DONE = CASE
						WHEN NEW.LIST = 'done' THEN DONE + 1
						ELSE DONE
						END,
					HOLD = CASE
						WHEN NEW.LIST = 'hold' THEN HOLD + 1
						ELSE HOLD
						END;
			END;

			CREATE TRIGGER IF NOT EXISTS TASK_DELETE AFTER DELETE ON TASKS
			BEGIN
				UPDATE STATISTICS
				SET 
					TODO = CASE
						WHEN OLD.LIST = 'todo' THEN TODO - 1
						ELSE TODO
						END,
					INPROGRESS = CASE
						WHEN OLD.LIST = 'inprogress' THEN INPROGRESS - 1
						ELSE INPROGRESS
						END,
					DONE = CASE
						WHEN OLD.LIST = 'done' THEN DONE - 1
						ELSE DONE
						END,
					HOLD = CASE
						WHEN OLD.LIST = 'hold' THEN HOLD - 1
						ELSE HOLD
						END;
			END;
		
		COMMIT;
	`)

	if r != nil {
		return nil, r
	}

	// dummy data for debugging
	_, r = db.Exec(`
		PRAGMA journal_mode=WAL;
		BEGIN TRANSACTION;

			INSERT INTO TOPIC ( TITLE) VALUES ( 'TOPIC1');
			INSERT INTO TOPIC ( TITLE) VALUES ( 'TOPIC2');
			INSERT INTO TOPIC ( TITLE) VALUES ( 'TOPIC3');

			INSERT INTO FILE ( TOPIC, TITLE, TYPE, LAST_UPDATE) VALUES ( 1, 'FILE1', 'pdf', DATETIME('2024-12-25 19:00:00'));
			INSERT INTO FILE ( TOPIC, TITLE, TYPE, LAST_UPDATE) VALUES ( 2, 'FILE1', 'pdf', DATETIME('2024-12-25 19:00:00'));
			INSERT INTO FILE ( TOPIC, TITLE, TYPE, LAST_UPDATE) VALUES ( 3, 'FILE1', 'pdf', DATETIME('2024-12-25 19:00:00'));

			INSERT INTO HISTORY_DAY ( DAY) VALUES ( '2024-12-25');

			INSERT INTO ACTIVITY ( DAY, TIME, TITLE, LINK, DURATION, TYPE) VALUES ( 1, '19:00:00', 'RESSOURCE 1', '/HHAH', 1.2, 'reading');
			INSERT INTO ACTIVITY ( DAY, TIME, TITLE, LINK, DURATION, TYPE) VALUES ( 1, '19:00:00', 'RESSOURCE 1', '/HHAH', 1.2, 'writing');
			INSERT INTO ACTIVITY ( DAY, TIME, TITLE, LINK, DURATION, TYPE) VALUES ( 1, '19:00:00', 'RESSOURCE 1', '/HHAH', 1.2, 'watching');

			INSERT INTO WEEK_STATISTICS ( CONS, PROD) VALUES ( 1.5, 1.5);
			INSERT INTO DAY_STATISTICS ( WEEK, DAY,CONS, PROD) VALUES ( 1, "Lundi", 1.5, 1.5);
			INSERT INTO STATISTICS ( WEEK_ID, TODO, INPROGRESS, DONE, HOLD) VALUES( 1, 0, 0, 0, 0);

			INSERT INTO TASKS ( LIST, TITLE, CREATED, FOR, BODY) VALUES( "todo",'OUSSAMA', DATETIME('2024-12-25 19:00:00'), DATETIME('2024-12-25 19:00:00'), 'OUSSAMA');
			INSERT INTO TASKS ( LIST, TITLE, CREATED, FOR, BODY) VALUES( "todo",'RAYANE', DATETIME('2024-12-25 19:00:00'), DATETIME('2024-12-25 19:00:00'), 'OUSSAMA');
			INSERT INTO TASKS ( LIST, TITLE, CREATED, FOR, BODY) VALUES( "todo",'SIMO', DATETIME('2024-12-25 19:00:00'), DATETIME('2024-12-25 19:00:00'), 'OUSSAMA');
		COMMIT;
	`)

	if r != nil {
		return nil, r
	}

	return &Db{
		Db: db,
	}, nil
}
