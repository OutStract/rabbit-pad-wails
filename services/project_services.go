package services

import (
	"context"
	"errors"
	"fmt"
	"os"
	"time"
	"path/filepath"

	//"github.com/wailsapp/wails/v2/pkg/runtime"
)

type ProjectServices struct {
	Ctx context.Context
}

func (p *ProjectServices) MakeProject (libPath, projectName string) Payload {
	projectPath := filepath.Join(libPath, projectName)

	// Check for existing file
	_,err := os.Stat(projectPath)
	if err == nil {
		LogError("[ProjectServices]","Project with the same name already exist:", err)
		err = errors.New("Project with the same name already exist")
		return failure("Project Services: Make Project", "MAKE_PROJECT", "File with the same name already exist", err)
	}


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

	info,err := os.Stat(projectPath)
	modTime := info.ModTime()

	newProject := LibraryTree {
		Name: projectName,
		Path: projectPath,
		LastMod: modTime.Format(time.RFC3339),
	}

	return success("Project Services: Make Project", "MAKE_PROJECT", "Project created successfully", newProject)

}


func (p *ProjectServices) BuildProjectTree(projectRoot string) ([]ProjectNode, error)  {
	projectTree := []ProjectNode{}

	projectNodes, err := os.ReadDir(projectRoot)
	if err != nil {
		LogError("[ProjectServices]","There was a problem in reading the project folder:", err)
		return nil, err
	}

	for _,entry := range projectNodes {
		fullPath := filepath.Join(projectRoot, entry.Name())

		if entry.Name()[0] == '.' {
			LogAlerts("[ProjectServices]","This is a hidden file, skipping...", entry.Name())
			continue
    	}

		if entry.IsDir() {

			children, err := p.BuildProjectTree(fullPath)

			if err != nil {
				LogError("[ProjectServices]","There was a problem in reading the children folder:", err)
				return nil, err
			}

			node := ProjectNode {
				Name: entry.Name(),
				Path: fullPath,
				IsFolder: entry.IsDir(),
				Children: children ,
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

	return projectTree, nil
}

func (p *ProjectServices) ProjectTree(projectRoot string) Payload {
	result, err := p.BuildProjectTree(projectRoot)

	if err != nil {
		return failure("Project Services: Project  Tree", "PROJECT_TREE", "Error in reading project tree", err)
	}

	return success("Project Services: Project  Tree", "PROJECT_TREE", "Project tree read successfully", result)
}

func (p *ProjectServices) RenameProject(OldNamePath, BasePath, NewName string) Payload {
	NewNamePath := filepath.Join(BasePath, NewName)
	_,err := os.Stat(NewNamePath)
	if err == nil {
		LogAlerts("[FileServices]","File with the name already exist", err)
		err = errors.New("Project with the same name exist")
		return failure("Project Services: Rename Project", "RENAME_PROJECT", "Project with the same name exist", err)
	}

	err = os.Rename(OldNamePath, NewNamePath)

	if err != nil {
		return failure("Project Services: Rename Project", "RENAME_PROJECT", "Error in renaming the project", err)
	}

	info,err := os.Stat(NewNamePath)
	modTime := info.ModTime()

	data := RenameData{
		OldPath: OldNamePath,
		NewPath: NewNamePath,
		LastMod: modTime.Format(time.RFC3339),
	}

	return success("Project Services: Rename Project", "RENAME_PROJECT", "Project renamed successfully", data)
}

func (p *ProjectServices) DeleteProject(LibraryPath, ProjectPath, ProjectName string) Payload {
	// Take the project name and make the delete path
	count := 0
	TrashLoc := filepath.Join(LibraryPath, ".trash")
	destination := filepath.Join(TrashLoc, fmt.Sprintf("%d-%s", count, ProjectName))
	// Check if that file already exist in the delete folder
	// if exist then add a number on it
	for {
		_, err := os.Stat(destination) 
		if err != nil {
			LogAlerts("[ProjectServices]", "Found a available path", destination)
			break
		}
		count++
		destination = filepath.Join(TrashLoc, fmt.Sprintf("%d-%s", count, ProjectName))
	}

	err := os.Rename(ProjectPath, destination)
	if err != nil {
		LogError("[ProjectServices]", "There was problem in deleted the file", err)
		return failure("Project Services: Rename Project", "DELETE_PROJECT", "Couldn't delete the project", err)
	}

	return success("Project Services: Rename Project", "DELETE_PROJECT", "Project Deleted successfully", ProjectPath)
}
