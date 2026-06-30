package services

import (
	"os"
	"path/filepath"
	"fmt"
	"encoding/json"
	"context"
	//"github.com/wailsapp/wails/v2/pkg/runtime"
)


type StartUpServices struct {
	Ctx context.Context
}

func (s *StartUpServices) StartUpManager(LibName,LibPath string) string {
	// Starup Orcastrations
	Name := LibName
	Path := LibPath
	return fmt.Sprintf("Startup Completed for: %s at %s", Name, Path )
}



func (s *StartUpServices) ConfigCheck() Payload {

	// Check if the user config file exist and returns active library path


	configDir, err := os.UserConfigDir()

	if err != nil {
		LogError("[StartUpServices]","There was a problem in getting config directory:", err)
		
	}
	configPath := filepath.Join(configDir, "rabbitpad", "config.json")

	_, err = os.Stat(configPath)

	if err != nil {
		LogError("[StartUpServices]","There was a problem confirming config file", err)
		return failure("Startup Services: Config Check", "CONFIG_CHECK", "There was a problem confirming config file", err)
	}

	configBytes, err := os.ReadFile(configPath)

	if err != nil {
		LogError("[StartUpServices]","There was a problem reading config file", err)
		return failure("Startup Services: Config Check", "CONFIG_CHECK", "There was a problem reading config file", err)
	}

	var activeLib struct {
		ActiveLibrary string `json:"activeLibrary"`
	}
	if err := json.Unmarshal(configBytes, &activeLib); err != nil {
		LogError("[StartUpServices]","There was a problem in unmarshaling the config file:", err)
		return failure("Startup Services: Config Check", "CONFIG_CHECK", "There was a problem unmarshaling the config file", err)
	}

	LogInfo("[StartUpServices]","User config Directory is", configPath)

	return success("Startup Services: Config Check", "CONFIG_CHECK", "Checking user config", activeLib.ActiveLibrary)

}


func (s *StartUpServices) UpdateConfig(LibName, LibPath string) Payload {

	// Create the content of the file
	libraryLoc := filepath.Join(LibPath, LibName)

	libraryStruct := Library {
		Name: LibName,
		Path: libraryLoc,
	} 

	configState := AppState {
		ActiveLibrary: libraryLoc,
	}

	configState.Libraries = append(configState.Libraries, libraryStruct)

	/*==========Check If config exist============*/

	configDir, err := os.UserConfigDir()

	if err != nil {
		LogError("[StartUpServices]","There was a problem in getting config directory:", err)
		return failure("Startup Services: Update Config", "UPDATE_CONFIG", "There was a problem in getting the config file", err)
	}

	configPath := filepath.Join(configDir, "rabbitpad", "config.json")

	_, err = os.Stat(configPath)

	/*============ Make if it doesn't exist ========= */

	if err != nil {

		LogAlerts("[StartUpServices]","Config doesn't exist, making new config", err)

		// Make or check for config dir

		configDirPath := filepath.Join(configDir, "rabbitpad")

		err := os.MkdirAll(configDirPath, 0755)
			if err != nil {
			LogError("[StartUpServices]","There was a problem in creating the config directory:", err)
			return failure("Startup Services: Update Config", "UPDATE_CONFIG", "There was a problem in creating the config file", err)
		}

		// Make a config
		// var config *os.File
		config, err := os.Create(configPath)
		if err != nil {
			LogError("[StartUpServices]","There was a problem in creating the config file:", err)
			return failure("Startup Services: Update Config", "UPDATE_CONFIG", "There was a problem in updating the config file", err)
		}

		defer config.Close()
		encoder := json.NewEncoder(config)
		encoder.SetIndent("", "  ")
		// Write configState into config file
		err = encoder.Encode(configState)
		if err != nil {
			LogError("[StartUpServices]","There was a problem in writing to the config file:", err)
			return failure("Startup Services: Update Config", "UPDATE_CONFIG", "There was a problem in updating the config file", err)
		}

		return success("Startup Services: Update Config", "UPDATE_CONFIG", "Config updated successfully", configPath)
	}

	/*=========== Update if it does exist =============*/

	// Read the file
	configBytes, err := os.ReadFile(configPath)
	if err != nil {
		LogError("[StartUpServices]","There was a problem in reading the config file:", err)
		return failure("Startup Services: Update Config", "UPDATE_CONFIG", "There was a problem in reading the config file", err)
	}

	// Unmarshal it
	var appState AppState
	if err := json.Unmarshal(configBytes, &appState); err != nil {
		LogError("[StartUpServices]","There was a problem in unmarshaling the config file:", err)
		return failure("Startup Services: Update Config", "UPDATE_CONFIG", "There was a problem in unmarshaling the config file", err)
	}

	// Update it
	appState.Libraries = append(appState.Libraries, libraryStruct);
	appState.ActiveLibrary = libraryLoc

	// 4. Encode back to JSON (with pretty printing)
	updatedConfig, err := json.MarshalIndent(appState, "", "  ")
	if err != nil {
		LogError("[StartUpServices]","There was a problem in marshalling the config file:", err)
		return failure("Startup Services: Update Config", "UPDATE_CONFIG", "There was a problem in marshalling the config file", err)
	}
	// Write it back
	err = os.WriteFile(configPath,updatedConfig,0644) 
	if err != nil {
		LogError("[StartUpServices]","There was a problem in updating the config file:", err)
		return failure("Startup Services: Update Config", "UPDATE_CONFIG", "There was a problem in updating the config file", err)
	}

	LogSuccess("[StartUpServices]","Config have been updated successfully", configPath)

	return success("Startup Services: Update Config", "UPDATE_CONFIG", "Config updated successfully", configPath)
}