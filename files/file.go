package files

import (
	"errors"
	"log"
	"os"
	"path/filepath"
)

func CreateFile(topic string, fileName string, ext string) error {

	homeDir, r := os.UserHomeDir()

	if r != nil {
		log.Println("CreateFile: ", r.Error())
		return r
	}

	filePath := filepath.Join(homeDir, DOCUMENTS, MAIN, TOPICS, topic, fileName)

	// check if the file exists
	if _, err := os.Stat(filePath); err == nil {
		log.Println("CreateTopic: file already exists:", filePath)
		return errors.New("file already exists")
	}

	file, r := os.Create(filePath)
	if r != nil {
		log.Println("CreateTopic: error creating file:", r)
		return r
	}

	defer file.Close()

	return nil

}
