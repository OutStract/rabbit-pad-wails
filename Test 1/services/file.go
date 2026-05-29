package services

import (
	"log"
	"os"
)

func ReadService(path string) string {
	content, err := os.ReadFile(path)

	if err != nil {
		log.Println(err)
	}

	return string(content)
}