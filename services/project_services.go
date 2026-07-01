package services

import (
	"context"
	"errors"
	"os"
	"path/filepath"

	"github.com/wailsapp/wails/v2/pkg/runtime"
)

type ProjectServices struct {
	Ctx context.Context
}

func (p *ProjectServices) MakeProject (libPath, projectName string) Payload {
	projectPath := filepath.Join(libPath, projectName)

	_,err := os.Stat(projectPath)
	if err == nil {
		LogError("[ProjectServices]","Project with the same name already exist:", err)
		err = errors.New("Project with the same name already exist")
		return failure("Project Services: Make Project", "MAKE_PROJECT", "File with the same name already exist", err)
	}
	// Check for existing file
	systemFolder := filepath.Join(projectPath, "system")
	userFolder := filepath.Join(projectPath, "user")
	trashFolder := filepath.Join(projectPath, ".trash")
	contentFolder := filepath.Join(systemFolder, "Content")
	entityFolder := filepath.Join(systemFolder, "Entity")
	locationsFolder := filepath.Join(systemFolder, "Locations")




	err = os.MkdirAll(systemFolder, 0755)
		if err != nil {
		LogError("[ProjectServices]","There was a problem in creating the system folder:", err)
		return failure("Project Services: Make Project", "MAKE_PROJECT", "There was a problem in making the system folder", err)
	}

	err = os.MkdirAll(contentFolder, 0755)
		if err != nil {
		LogError("[ProjectServices]","There was a problem in creating the system folder:", err)
		return failure("Project Services: Make Project", "MAKE_PROJECT", "There was a problem in making the system folder", err)
	}

	err = os.MkdirAll(entityFolder, 0755)
		if err != nil {
		LogError("[ProjectServices]","There was a problem in creating the system folder:", err)
		return failure("Project Services: Make Project", "MAKE_PROJECT", "There was a problem in making the system folder", err)
	}

	err = os.MkdirAll(locationsFolder, 0755)
		if err != nil {
		LogError("[ProjectServices]","There was a problem in creating the system folder:", err)
		return failure("Project Services: Make Project", "MAKE_PROJECT", "There was a problem in making the system folder", err)
	}

	err = os.MkdirAll(userFolder, 0755)
		if err != nil {
		LogError("[ProjectServices]","There was a problem in creating the user folder:", err)
		return failure("Project Services: Make Project", "MAKE_PROJECT", "There was a problem in making the user folder", err)
	}

	err = os.MkdirAll(trashFolder, 0755)
		if err != nil {
		LogError("[ProjectServices]","There was a problem in creating the trash folder:", err)
		return failure("Project Services: Make Project", "MAKE_PROJECT", "There was a problem in making the trash folder", err)
	}

	return success("Project Services: Make Project", "MAKE_PROJECT", "Project created successfully", projectPath)

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
		LogInfo("[ProjectServices]", "EVENT EMIT Project Read successfully")
    }
	return projectTree
}

func RenameProject () {

}

func DeleteProject () {
	
}

