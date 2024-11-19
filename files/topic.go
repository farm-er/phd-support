package files

import (
	"log"
	"os"
	"path/filepath"
)

func CreateTopic(topic string) error {

	homeDir, r := os.UserHomeDir()

	if r != nil {
		log.Println("CreateTopic: ", r.Error())
		return r
	}

	topicDir := filepath.Join(homeDir, DOCUMENTS, MAIN, TOPICS, topic)

	r = os.MkdirAll(topicDir, PERMISSIONS)

	if r != nil {
		log.Println("CreateTopic: ", r.Error())
		return r
	}

	return nil
}
