package database

import "strings"

type Video struct {
	Topic int64
	Id    int64
	Title string
	Link  string
}

// https://youtu.be/RxHJdapz2p0
// https://www.youtube.com/embed/RxHJdapz2p0
func (d *Db) AddVideo(topicId int64, videoTitle, videoLink string) (Video, error) {

	subLink := strings.Split(videoLink, "/")

	videoLink = "https://www.youtube.com/embed/" + subLink[len(subLink)-1]

	res, r := d.Db.Exec("INSERT INTO VIDEO ( TOPIC, TITLE, LINK) VALUES ( ?, ?, ?)", topicId, videoTitle, videoLink)

	if r != nil {
		return Video{}, r
	}

	id, r := res.LastInsertId()

	if r != nil {
		return Video{}, r
	}

	return Video{
		Topic: topicId,
		Id:    id,
		Title: videoTitle,
		Link:  videoLink,
	}, nil

}

func (d *Db) DeleteVideo(videoId int64) error {

	_, r := d.Db.Exec("DELETE FROM VIDEO WHERE ID = ?", videoId)

	if r != nil {
		return r
	}

	_, r = d.Db.Exec("DELETE FROM VIDEO_NOTE WHERE VIDEO = ?", videoId)

	if r != nil {
		return r
	}

	return nil
}
