



CREATE TABLE IF NOT EXISTS HISTORY_DAY (

    ID INTEGER PRIMARY KEY AUTOINCREMENT,

    DAY TEXT,

);

-- ALL THE ACTION TAKEN FROM THE START
CREATE TABLE IF NOT EXISTS ACTIVITY (

    -- DAY ID
    DAY INTEGER,

    TIME TEXT,

    -- NAME OF THE RESSOURCE
    TITLE TEXT,

    -- LINK TO THE RESSOURCE : CAN BE A RELATIVE PATH TO THE FILE OR YOUTUBE LINK
    LINK TEXT,

    -- IN HOURS
    DURATION FLOAT,

    -- READING - WRITING - WATCHING
    TYPE TEXT,

    FOREIGN KEY (DAY) REFERENCES HISTORY_DAY( ID)

);

INSERT INTO HISTORY_DAY ( DAY) VALUES ( '2024-12-25');

INSERT INTO ACTIVITY ( TIME, TITLE, LINK, DURATION, TYPE) VALUES ( 1, '19:00:00', 'RESSOURCE 1', '/HHAH', 1.2, 'reading');
INSERT INTO ACTIVITY ( TIME, TITLE, LINK, DURATION, TYPE) VALUES ( 1, '19:00:00', 'RESSOURCE 1', '/HHAH', 1.2, 'writing');
INSERT INTO ACTIVITY ( TIME, TITLE, LINK, DURATION, TYPE) VALUES ( 1, '19:00:00', 'RESSOURCE 1', '/HHAH', 1.2, 'watching');
