package files

import (
	"log"
	"os"
	"path/filepath"
)

const (
	TOPICS      = "topics"
	MAIN        = "phd_support"
	DOCUMENTS   = "Documents"
	PERMISSIONS = 0755
)

// this function creates the necessary directories and files for the app if they don't exist
func SetupFileStructure() error {

	homeDir, r := os.UserHomeDir()

	if r != nil {
		log.Println("SetupFileStructure: ", r.Error())
		return r
	}

	topicsDir := filepath.Join(homeDir, DOCUMENTS, MAIN, TOPICS)

	r = os.MkdirAll(topicsDir, PERMISSIONS)

	if r != nil {
		log.Println("SetupFileStructure: ", r.Error())
		return r
	}

	return nil
}

// TODO: a function that checks whether all files exists physically
