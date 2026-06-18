package services

import (
	"context"
	"github.com/wailsapp/wails/v2/pkg/runtime"
	"path/filepath"
	"os"
)

type ProjectServices struct {
	Ctx context.Context
}

func (p *ProjectServices) MakeProject (libPath, projectName string) {
	projectPath := filepath.Join(libPath, projectName)
	// Check for existing file
	systemFolder := filepath.Join(projectPath, "system")
	userFolder := filepath.Join(projectPath, "user")
	trashFolder := filepath.Join(projectPath, ".trash")

	err := os.MkdirAll(systemFolder, 0755)
			if err != nil {
			LogError("[ProjectServices]","There was a problem in creating the system folder:", err)
			return
		}
	LogSuccess("[ProjectServices]", "The system folder has been made successfully")

	err = os.MkdirAll(userFolder, 0755)
			if err != nil {
			LogError("[ProjectServices]","There was a problem in creating the user folder:", err)
			return
		}
	LogSuccess("[ProjectServices]", "The user folder has been made successfully")

	err = os.MkdirAll(trashFolder, 0755)
			if err != nil {
			LogError("[ProjectServices]","There was a problem in creating the trash folder:", err)
			return
		}
	LogSuccess("[ProjectServices]", "The trash folder has been made successfully")

	message := projectPath
	if p.Ctx != nil {
		runtime.EventsEmit(p.Ctx, "project-created", message)
		LogInfo("[ProjectServices]", "Project Created successfully")
    }
}

type ProjectNode struct {
		Name string `json:"name"`
		Path string `json:"path"`
		IsFolder bool `json:"isFolder"`
		Children []ProjectNode `json:"children"`

}

func (p *ProjectServices) ProjectTree (projectRoot string) []ProjectNode  {
	projectTree := []ProjectNode{}

	projectNodes, err := os.ReadDir(projectRoot)
	if err != nil {
		LogError("[ProjectServices]","There was a problem in reading the project folder:", err)
		return nil
	}

	for _,entry := range projectNodes {
		fullPath := filepath.Join(projectRoot, entry.Name())

		if entry.Name()[0] == '.' {
        LogAlerts("[ProjectServices]","This is a hidden file, skipping...", entry.Name())
        continue
    	}

		if entry.IsDir() {
			node := ProjectNode {
				Name: entry.Name(),
				Path: fullPath,
				IsFolder: entry.IsDir(),
				Children: p.ProjectTree(fullPath),
			}
			projectTree = append(projectTree, node)
		} else {
			node := ProjectNode {
				Name: entry.Name(),
				Path: fullPath,
				IsFolder: entry.IsDir(),
				Children: nil,
			}
			projectTree = append(projectTree, node)
		}
	}
	LogSuccess("[ProjectServices]", "The project tree has been read successfully")
	message := projectTree
	if p.Ctx != nil {
		runtime.EventsEmit(p.Ctx, "project-tree", message)
		LogInfo("[ProjectServices]", "EVENT EMIT Project Read successfully", message)
    }
	return projectTree
}

func RenameProject () {

}

func DeleteProject () {
	
}

