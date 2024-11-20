





CREATE TABLE IF NOT EXISTS VIDEO (

    TOPIC INTEGER,

    ID INTEGER PRIMARY KEY AUTOINCREMENT,

    TITLE TEXT,

    LINK TEXT,

    FOREIGN KEY (TOPIC) REFERENCES TOPIC(ID)

);



CREATE TABLE IF NOT EXISTS VIDEO_NOTE (

    VIDEO INTEGER,

    BODY TEXT,

);

INSERT INTO VIDEO ( TOPIC, TITLE, LINK) VALUES ( 1, 'VIDEO 1', 'https://www.youtube.com/embed/RxHJdapz2p0')
INSERT INTO VIDEO_NOTE ( VIDEO, BODY) VALUES ( 1, 'asdjnhfbjhsdbfhjdsbnfkjnzsdmjnb')



<iframe width="729" height="410" src="https://www.youtube.com/embed/GEbSzZKDvZM?list=RDGEbSzZKDvZM" title="Drum Go Dum  -「 AMV 」Anime 4k Mix" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>


https://youtu.be/GEbSzZKDvZM?list=RDGEbSzZKDvZM




https://youtu.be/RxHJdapz2p0

<iframe width="729" height="410" src="https://www.youtube.com/embed/RxHJdapz2p0" title="How GIT works under the HOOD?" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>



