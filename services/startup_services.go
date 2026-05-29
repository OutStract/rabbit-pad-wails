package services

import (
	"os"
	"path/filepath"
	"fmt"
)


type StartUpServices struct {}

func DefaultState() AppState {
	return AppState{
		Libraries:     []Library{},
		ActiveLibrary: "",
	}
}

func (s *StartUpServices) StartUpManager(LibName,LibPath string) string {
	// Starup Orcastrations
	Name := LibName
	Path := LibPath
	return fmt.Sprintf("Startup Completed for: %s at %s", Name, Path )
}

func (s *StartUpServices) ConfigCheck() bool {
	configDir, err := os.UserConfigDir()

	if err != nil {
		LogError("There was a problem in getting config directory:", err)
	}
	configPath := filepath.Join(configDir, "rabbitpad", "config.json")

	_, err = os.Stat(configPath)

	if err != nil {
		LogError("There was a problem reading config file", err)
		return false

	}
	LogInfo("User config Directory is", configPath)
	return true

}

func LoadConfig() {
	// load the config path and check if it has libraries
	//if true get the last library and app state and run the app
	//if false run the startup func
}

func UpdateConfig() {
	//get app state data, and atomic overwright config
}