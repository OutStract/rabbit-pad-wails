package services

import (
	"testing"
	"os"
	"fmt"
)



func TestCheck(t *testing.T) {
	configDir, err := os.UserConfigDir()

	if err != nil {
		LogError("There was a problem in getting config directory:", err)
	}

	fmt.Println(configDir)
}