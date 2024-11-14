BEGIN TRANSACTION;


-- general overview of the day
CREATE TABLE IF NOT EXISTS STATISTICS (
    DAY TEXT NOT NULL PRIMARY KEY,
    -- reading + watching time
    CONS FLOAT,
    -- production time
    PROD FLOAT
);


CREATE TABLE IF NOT EXISTS TASKS (
    -- an id 
    ID INTEGER PRIMARY KEY AUTOINCREMENT,
    -- in which list they are
    LIST TEXT,
    -- the name of the task the user gave
    TITLE TEXT,
    -- when created
    CREATED TEXT,
    -- due to
    FOR TEXT,
    -- any description added by the user
    BODY TEXT
);

-- INSERT INTO STATISTICS ( DAY, CONS, PROD) VALUES( DATETIME('2024-12-25 19:00:00'), 1.5, 1.9);

INSERT INTO TASKS ( LIST, TITLE, CREATED, FOR, BODY) VALUES( "todo",'OUSSAMA', DATETIME('2024-12-25 19:00:00'), DATETIME('2024-12-25 19:00:00'), 'OUSSAMA');


COMMIT;