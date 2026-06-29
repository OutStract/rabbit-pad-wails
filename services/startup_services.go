package services

import (
	"os"
	"path/filepath"
	"fmt"
	"encoding/json"
	"context"
	"github.com/wailsapp/wails/v2/pkg/runtime"
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


func (s *StartUpServices) UpdateConfig(LibName, LibPath string) {

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
		return
	}

	LogSuccess("[StartUpServices]", "Config Directory loaded successfully")

	configPath := filepath.Join(configDir, "rabbitpad", "config.json")

	_, err = os.Stat(configPath)

	/*============ Make if it doesn't exist ========= */

	if err != nil {

		LogAlerts("[StartUpServices]","Config doesn't exist, making new config", err)

		// Make or check for congif dir

		configDirPath := filepath.Join(configDir, "rabbitpad")

		err := os.MkdirAll(configDirPath, 0755)
			if err != nil {
			LogError("[StartUpServices]","There was a problem in creating the config directory:", err)
		}

		LogSuccess("[StartUpServices]", "Config Directory created successfully")

		// Make a config
		// var config *os.File
		config, err := os.Create(configPath)
		if err != nil {
			LogError("[StartUpServices]","There was a problem in creating the config file:", err)
			return
		}

		LogSuccess("[StartUpServices]", "Config file created successfully")

		defer config.Close()
		encoder := json.NewEncoder(config)
		encoder.SetIndent("", "  ")
		// Write configState into config file
		err = encoder.Encode(configState)
		if err != nil {
			LogError("[StartUpServices]","There was a problem in writing to the config file:", err)
			return
		}

		LogSuccess("[StartUpServices]","Config have been created successfully", configPath)

		message := configPath
			if s.Ctx != nil {
			runtime.EventsEmit(s.Ctx, "startup-config-update", message)
			LogInfo("[StartUpServices]", "Config Directory creation event emitted successfully")
    		}
	
		return
	}

	/*=========== Update if it does exist =============*/

	// Read the file
	configBytes, err := os.ReadFile(configPath)

	if err != nil {
		LogError("[StartUpServices]","There was a problem in reading the config file:", err)
		return
	}

	LogSuccess("[StartUpServices]", "Config file read successfully")

	// Unmarshel it

	var appState AppState
	if err := json.Unmarshal(configBytes, &appState); err != nil {
		LogError("[StartUpServices]","There was a problem in unmarshalling the config file:", err)
		return
	}

	LogSuccess("[StartUpServices]", "Config file unmarshalled successfully")

	// Update it

	appState.Libraries = append(appState.Libraries, libraryStruct);
	appState.ActiveLibrary = libraryLoc

	// 4. Encode back to JSON (with pretty printing)
	updatedConfig, err := json.MarshalIndent(appState, "", "  ")
	if err != nil {
		LogError("[StartUpServices]","There was a problem in marshalling the config file:", err)
		return
	}

	LogSuccess("[StartUpServices]", "Config file marshalled successfully")

	// Write it back

	err = os.WriteFile(configPath,updatedConfig,0644) 

	if err != nil {
		LogError("[StartUpServices]","There was a problem in updaing the config file:", err)
		return 
	}

	LogSuccess("[StartUpServices]","Config have been updated successfully", configPath)

	message := configPath
	if s.Ctx != nil {
        runtime.EventsEmit(s.Ctx, "startup-config-update", message)
		LogInfo("[StartUpServices]", "Config update event emitted successfully")
    }
}