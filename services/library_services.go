package services

import (
	"context"
	"github.com/wailsapp/wails/v2/pkg/runtime"
	"path/filepath"
	"os"
	"time"

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

func (l *LibraryServices) LoadLib(libRoot string) []LibraryTree {

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

	LogSuccess("[LibraryServices]","Library Loaded")

	message := LibTree
	if l.Ctx != nil {
		LogInfo("[LibraryServices]","Library tree Event Send")
        runtime.EventsEmit(l.Ctx, "library-loaded", message)
    }
	
	return LibTree
}