package services

import (
	"context"
	//"github.com/wailsapp/wails/v2/pkg/runtime"
	"path/filepath"
	"os"
	"time"
	"encoding/json"
	// "fmt"

)



type LibraryServices struct {
	Ctx context.Context
}

func (l *LibraryServices) MakeLib(name, path string) Payload {

		libraryPath := filepath.Join(path, name)
		rabbitFolder := filepath.Join(libraryPath, ".rabbitpad")
		trashFolder := filepath.Join(libraryPath, ".trash")

		err := os.MkdirAll(rabbitFolder, 0755)
			if err != nil {
			LogError("[LibraryServices]","There was a problem in creating the .rabbitpad folder:", err)
			return failure("Library Services: Make Library", "MAKE_LIB", "There was a problem in creating the .rabbitpad folder", err)
		}

		err = os.MkdirAll(trashFolder, 0755)
			if err != nil {
			LogError("[LibraryServices]","There was a problem in creating the .trash folder:", err)
			return failure("Library Services: Make Library", "MAKE_LIB", "There was a problem in creating the .trash folder", err)
		}

	return success("Library Services: Make Library", "MAKE_LIB", "Library has been created successfully", libraryPath)	
}


type LibraryTree struct {
	Name string `json:"name"`
	Path string `json:"path"`
	LastMod string `json:"lastMod"`
}

func (l *LibraryServices) LibTree(libRoot string) Payload {

	LibTree := []LibraryTree{}

	projects, err := os.ReadDir(libRoot)
	if err != nil {
		LogError("[LibraryServices]","There was a problem loading the library", err)
		return failure("Library Services: Read Library Tree", "READ_LIB_TREE", "There is an error while reading the library directory.", err)
	}

	for _, project := range projects {
		fullPath := filepath.Join(libRoot, project.Name())
		projInfo, err := project.Info()

		if err != nil {
			LogError("[LibraryServices]","There was a problem getting the file mod time", err)
			return failure("Library Services: Read Library Tree", "READ_LIB_TREE", "There was a problem in reading project folder information.", err)
		}

		if project.Name()[0] == '.' {
			LogAlerts("[LibraryServices]","This is a hidden file, skipping...", project.Name())
			continue
    	}

		modifiedTime := projInfo.ModTime()

		project := LibraryTree {
			Name: project.Name(),
			Path: fullPath, 
			LastMod: modifiedTime.Format(time.RFC3339),
		}

		LibTree = append(LibTree ,project)
	}
	LogSuccess("[LibraryServices]","Library Loaded", LibTree)
	return success("Library Services: Read Library Tree", "READ_LIB_TREE", "Library tree has been read successfully", LibTree)

}

func (l *LibraryServices) UpdateLibConfig (libPath, activeProject string) Payload {

	// Prepare the content of the file

	ConfigLoc := filepath.Join(libPath, ".rabbitpad", "libConfig.json")
	configState := LibraryState {
		LastOpenedProject: activeProject,
	}

	// Check if it exist
	_, err := os.Stat(ConfigLoc)

		// Make if it does't
	if err != nil {
		LogAlerts("[LibraryServices]","Config doesn't exist, making new config", err)

		config, err := os.Create(ConfigLoc)
		if err != nil {
			LogError("[LibraryServices]","There was a problem in creating the config file:", err)
			return failure("Library Services: Update Library Config", "UPDATE_LIB_CONFIG", "There was a problem in creating library config file", err)
		}

		defer config.Close()
		encoder := json.NewEncoder(config)
		encoder.SetIndent("", "  ")

		err = encoder.Encode(configState)
		if err != nil {
			LogError("[LibraryServices]","There was a problem in writing to the config file:", err)
			return failure("Library Services: Update Library Config", "UPDATE_LIB_CONFIG", "There was a problem in writing the config file", err)
		}

		LogSuccess("[LibraryServices]","Config have been created successfully", ConfigLoc)
		return success("Library Services: Update Library Config", "UPDATE_LIB_CONFIG", "New library config has been created successfully", ConfigLoc)
	}
	// Read if it does
	configBytes, err := os.ReadFile(ConfigLoc)

	if err != nil {
		LogError("[LibraryServices]","There was a problem in reading the config file:", err)
		return failure("Library Services: Update Library Config", "UPDATE_LIB_CONFIG", "There was a problem in reading the config file", err)
	}

	var libraryState LibraryState
	if err := json.Unmarshal(configBytes, &configState); err != nil {
		LogError("[LibraryServices]","There was a problem in unmarshaling the config file:", err)
		return failure("Library Services: Update Library Config", "UPDATE_LIB_CONFIG", "There was a problem in unmarshaling the config data", err)
	}

	// over write for update
	libraryState.LastOpenedProject = activeProject

	// Marshal it back to json
	updatedConfig, err := json.MarshalIndent(libraryState, "", "  ")
	if err != nil {
		LogError("[LibraryServices]","There was a problem in marshalling the config file:", err)
		return failure("Library Services: Update Library Config", "UPDATE_LIB_CONFIG", "There was a problem in marshaling the updated config data", err)
	}

	// Write it back
	err = os.WriteFile(ConfigLoc,updatedConfig,0644) 
	if err != nil {
		LogError("[LibraryServices]","There was a problem in updating the config file:", err)
		return failure("Library Services: Update Library Config", "UPDATE_LIB_CONFIG", "There was a problem in writing the updated config file", err)
	}

	LogSuccess("[LibraryServices]","Config have been updated successfully", updatedConfig)
	return success("Library Services: Update Library Config", "UPDATE_LIB_CONFIG", "Library config has been updated successfully", updatedConfig)

}


func (l *LibraryServices) LoadLibConfig (libPath string) Payload {

	// Taking the library path and return last opened project path

	ConfigLoc := filepath.Join(libPath, ".rabbitpad", "libConfig.json")

	_, err := os.Stat(ConfigLoc)

	if err != nil {
		LogError("[LibraryServices]","There was a problem confirming config file", err)
		return failure("Library Service: Load Library Config", "LOAD_LIBRARY_CONFIG", "There was a problem confirming config file", err)
	}

	configBytes, err := os.ReadFile(ConfigLoc)

	if err != nil {
		LogError("[LibraryServices]","There was a problem reading config file", err)
		return failure("Library Service: Load Library Config", "LOAD_LIBRARY_CONFIG", "There was a problem in reading the config file", err)
	}

	var ActiveProj struct {
		LastOpenedProject string `json:"lastOpenedProject"`
	}
	if err := json.Unmarshal(configBytes, &ActiveProj); err != nil {
		LogError("[LibraryServices]","There was a problem in unmarshaling the config file:", err)
		return failure("Library Service: Load Library Config", "LOAD_LIBRARY_CONFIG", "There was a problem in unmarshaling the config file", err)
	}

	LogSuccess("[LibraryServices]", "Library config file loaded successfully", ActiveProj.LastOpenedProject)
	return success("Library Service: Load Library Config", "LOAD_LIBRARY_CONFIG", "Config loaded successfully", ActiveProj.LastOpenedProject)

}

// Delete Library

// Merge Library