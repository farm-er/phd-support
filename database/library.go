package database

import (
	"log"
	"phd-support/files"
	"time"
)

type Topic struct {
	Id    int64
	Title string
}

func (d *Db) GetTopics() ([]Topic, error) {

	rows, r := d.Db.Query("SELECT * FROM TOPIC;")

	if r != nil {
		log.Println("library: ", r.Error())
		return nil, r
	}

	var topics []Topic

	for rows.Next() {

		var topic Topic

		r = rows.Scan(&topic.Id, &topic.Title)

		if r != nil {
			log.Println("library: ", r.Error())
			return nil, r
		}

		topics = append(topics, topic)
	}

	return topics, nil

}

// creates directory for the topic
// and an entry in the data base
func (d *Db) AddTopic(title string) (Topic, error) {

	r := files.CreateTopic(title)

	if r != nil {
		log.Println("AddTopic: ", r.Error())
		return Topic{}, r
	}

	res, r := d.Db.Exec("INSERT INTO TOPIC ( TITLE) VALUES ( ?)", title)

	if r != nil {
		log.Println("AddTopic: ", r.Error())
		return Topic{}, r
	}

	id, r := res.LastInsertId()

	if r != nil {
		log.Println("AddTopic: ", r.Error())
		return Topic{}, r
	}

	return Topic{
		Id:    id,
		Title: title,
	}, nil

}

func (d *Db) DeleteTopic(topicName string, topicId int64) error {

	_, r := d.Db.Exec("DELETE FROM TOPIC WHERE ID = ?;", topicId)

	if r != nil {
		return r
	}

	// delete it from the file system

	r = files.DeleteTopic(topicName)

	if r != nil {
		return r
	}

	return nil
}

type File struct {
	Id         int64
	Topic      int64
	Title      string
	Type       string
	LastUpdate string
}

func (d *Db) GetTopicFiles(topicId int64) ([]File, error) {

	rows, r := d.Db.Query("SELECT * FROM FILE WHERE TOPIC = ?;", topicId)

	if r != nil {
		log.Println("library: ", r.Error())
		return nil, r
	}

	var files []File

	for rows.Next() {

		var file File

		r = rows.Scan(&file.Id, &file.Topic, &file.Title, &file.Type, &file.LastUpdate)

		if r != nil {
			log.Println("library: ", r.Error())
			return nil, r
		}

		files = append(files, file)
	}

	return files, nil

}

// ext is the file type: pdf, txt, doc, docx
func (d *Db) AddFileToTopic(topicId int64, fileName string, ext string) (File, error) {

	row := d.Db.QueryRow("SELECT TITLE FROM TOPIC WHERE ID = ?;", topicId)

	var topic Topic

	r := row.Scan(&topic.Title)

	if r != nil {
		log.Println("AddFileToTopic: ", r.Error())
		return File{}, r
	}

	r = files.CreateFile(topic.Title, fileName, ext)

	if r != nil {
		log.Println("AddFileToTopic: ", r.Error())
		return File{}, r
	}

	file := File{
		Topic:      topicId,
		Title:      fileName,
		Type:       ext,
		LastUpdate: time.Now().Format("2006-01-02 15:04:05"),
	}

	res, r := d.Db.Exec("INSERT INTO FILE ( TOPIC, TITLE, TYPE, LAST_UPDATE) VALUES ( ?, ?, ?, ?);", file.Topic, file.Title, file.Type, file.LastUpdate)

	if r != nil {
		log.Println("AddFileToTopic: ", r.Error())
		return File{}, r
	}

	file.Id, r = res.LastInsertId()

	if r != nil {
		log.Println("AddFileToTopic: ", r.Error())
		return File{}, r
	}

	return file, nil

}

func (d *Db) DeleteFileFromTopic(topic, fileName, fileType string, fileId int64) error {

	_, r := d.Db.Exec("DELETE FROM FILE WHERE ID = ?;", fileId)

	if r != nil {
		return r
	}

	// delete it from the file system

	r = files.DeleteFile(topic, fileName, fileType)

	if r != nil {
		return r
	}

	return nil
}
