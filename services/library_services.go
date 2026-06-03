package services

import (
	"context"
	"github.com/wailsapp/wails/v2/pkg/runtime"
	"path/filepath"
	"os"
	"time"
	"encoding/json"
	"fmt"

)



type LibraryServices struct {
	Ctx context.Context
}



func (l *LibraryServices) MakeLib(name, path string) {

		librarypath := filepath.Join(path, name)
		rabbitFolder := filepath.Join(librarypath, ".rabbitpad")
		trashFolder := filepath.Join(librarypath, ".trash")
		starterFolder := filepath.Join(librarypath, "Starter Folder")

		err := os.MkdirAll(rabbitFolder, 0755)
			if err != nil {
			LogError("[LibraryServices]","There was a problem in creating the .rabbitpad folder:", err)
			return
		}

		err = os.MkdirAll(trashFolder, 0755)
			if err != nil {
			LogError("[LibraryServices]","There was a problem in creating the .trash folder:", err)
			return
		}

		err = os.MkdirAll(starterFolder, 0755)
			if err != nil {
			LogError("[LibraryServices]","There was a problem in creating the Starter Folder folder:", err)
			return
		}

	message := librarypath
	if l.Ctx != nil {
		runtime.EventsEmit(l.Ctx, "library-created", message)
		LogInfo("[LibraryServices]", "Library Created successfully")
    }
		
}

func DeleteLib(name, path string) {

}

func MergeLib(source, destination string) {

}

type LibraryTree struct {
	Name string `json:"name"`
	Path string `json:"path"`
	LastMod string `json:"lastMod"`
}

func (l *LibraryServices) LibTree(libRoot string) []LibraryTree {

	LibTree := []LibraryTree{}

	projects, err := os.ReadDir(libRoot)
	if err != nil {
		LogError("[LibraryServices]","There was a problem loading the library", err)
	}

	LogSuccess("[LibraryServices]", "Library read successfully")

	for _, project := range projects {
		fullpath := filepath.Join(libRoot, project.Name())
		projInfo, err := project.Info()

		if err != nil {
			LogError("[LibraryServices]","There was a problem getting the file mod time", err)
			return nil
		}

		if project.Name()[0] == '.' {
        LogAlerts("[LibraryServices]","This is a hidden file, skipping...", project.Name())
        continue
    	}

		modifiedTime := projInfo.ModTime()

		project := LibraryTree {
			Name: project.Name(),
			Path: fullpath, 
			LastMod: modifiedTime.Format(time.RFC3339),
		}

		LibTree = append(LibTree ,project)
	}

	LogSuccess("[LibraryServices]","Library Loaded", LibTree)

	message := LibTree
	if l.Ctx != nil {
		LogInfo("[LibraryServices]","Library tree Event Send")
        runtime.EventsEmit(l.Ctx, "library-loaded", message)
    }
	
	return LibTree
}

func (l *LibraryServices) UpdateLibConfig (libPath, activeProject string) {

	// Prepare the content of the file

	ConfigLoc := filepath.Join(libPath, ".rabbitpad", "libConfig.json")

	configState := LibraryState {
		LastOpendProject: activeProject,
	}

	// Check if it exist
	_, err := os.Stat(ConfigLoc)

		// Make if it does't
	if err != nil {
		LogAlerts("[LibraryServices]","Config doesn't exist, making new config", err)

		config, err := os.Create(ConfigLoc)
		if err != nil {
			LogError("[LibraryServices]","There was a problem in creating the config file:", err)
			return
		}

		LogSuccess("[LibraryServices]", "Config file created successfully")
		
		defer config.Close()
		encoder := json.NewEncoder(config)
		encoder.SetIndent("", "  ")

		err = encoder.Encode(configState)
		if err != nil {
			LogError("[LibraryServices]","There was a problem in writing to the config file:", err)
			return
		}

		LogSuccess("[LibraryServices]","Config have been created successfully", ConfigLoc)

		message := ConfigLoc
			if l.Ctx != nil {
			runtime.EventsEmit(l.Ctx, "lib-config-update", message)
			LogInfo("[LibraryServices]", "Config Directory creation event emitted successfully")
    	}
	
		return

	}
	// Read if it does
	configBytes, err := os.ReadFile(ConfigLoc)

	if err != nil {
		LogError("[LibraryServices]","There was a problem in reading the config file:", err)
		return
	}

	LogSuccess("[LibraryServices]", "Config file read successfully")

	var libraryState LibraryState
	if err := json.Unmarshal(configBytes, &configState); err != nil {
		LogError("[LibraryServices]","There was a problem in unmarshalling the config file:", err)
		return
	}

	LogSuccess("[LibraryServices]", "Config file unmarshalled successfully")

	// over write for update
	libraryState.LastOpendProject = activeProject

	// Marshal it back to json

	updatedConfig, err := json.MarshalIndent(libraryState, "", "  ")
	if err != nil {
		LogError("[LibraryServices]","There was a problem in marshalling the config file:", err)
		return
	}

	LogSuccess("[LibraryServices]", "Config file marshalled successfully", updatedConfig)

	// Write it back

	err = os.WriteFile(ConfigLoc,updatedConfig,0644) 

	if err != nil {
		LogError("[LibraryServices]","There was a problem in updaing the config file:", err)
		return
	}

	LogSuccess("[LibraryServices]","Config have been updated successfully", updatedConfig)

	message := fmt.Sprint(string(updatedConfig))
	if l.Ctx != nil {
        runtime.EventsEmit(l.Ctx, "lib-config-update", message)
		LogInfo("[LibraryServices]", "Config update event emitted successfully", message)
    }

}

func (l *LibraryServices) LoadLibConfig (libPath string) (string, bool) {

	ConfigLoc := filepath.Join(libPath, ".rabbitpad", "libConfig.json")

	_, err := os.Stat(ConfigLoc)

	if err != nil {
		LogError("[LibraryServices]","There was a problem confirming config file", err)
		return "", false
	}

	LogSuccess("[LibraryServices]","Config file confirmed Successfully")

	configBytes, err := os.ReadFile(ConfigLoc)

	if err != nil {
		LogError("[LibraryServices]","There was a problem reading config file", err)
		return "", false
	}

	LogSuccess("[LibraryServices]","Config file read Successfully")

	var ActiveProj struct {
		LastOpendProject string `json:"lastOpenedProject"`
	}
	if err := json.Unmarshal(configBytes, &ActiveProj); err != nil {
		LogError("[LibraryServices]","There was a problem in unmarshalling the config file:", err)
		return "", false
	}

	LogSuccess("[LibraryServices]","Config file unmarshaled Successfully")

	LogInfo("[LibraryServices]","User config Directory is", ConfigLoc)
	message := ActiveProj.LastOpendProject
	if l.Ctx != nil {
		runtime.EventsEmit(l.Ctx, "lib-config-found", message)
		LogInfo("[LibraryServices]","Config file data emitted", message)
    }
	return ActiveProj.LastOpendProject, true


}