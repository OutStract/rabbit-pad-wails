package services

import (
	"context"
	"errors"
	"fmt"
	"os"
	"path/filepath"

	"github.com/google/uuid"
	"github.com/wailsapp/wails/v2/pkg/runtime"
)


type FileServices struct {
	Ctx context.Context
}

func (f *FileServices) CreateFile(ProjectPath string) (string, error) {
	
	count := 0
	filePath := filepath.Join(ProjectPath, fmt.Sprintf("%d-untitled.md", count))


	LogInfo("[FileService]", "Checking if the file exist")

	for {
		_, err := os.Stat(filePath) 
		if err != nil {
			LogAlerts("[FileService]", "Found a available path", filePath)
			break
		}
		// LogError("[FileService]", "Filepath already exists", filePath)
		count++
		filePath = filepath.Join(ProjectPath, fmt.Sprintf("%d-untitled.md", count))
	}

	id, err := uuid.NewV7()
	if err != nil {
		LogError("[FileService]", "There is a problem in making the file ID")
		return "", errors.New("Problem in adding id in the file")
	}

	data := []byte(fmt.Sprintf("<--!%s-->\n", id.String()))

	err = os.WriteFile(filePath, data, 0644)

	message := Payload {
		Success: true,
		Data: filePath,
	}
	if f.Ctx != nil {
		runtime.EventsEmit(f.Ctx, "file-created", message)
		LogInfo("[FileService]","Create File Process ended", filePath)
    }

	return "File created success fully", nil
}

func (f *FileServices) ReadFile(FilePath string) (string, error) {

	content, err := os.ReadFile(FilePath)


	if err != nil {
		LogError("[FileServices]", "There was problem in opening the file", err)
		return "", errors.New("File doesn't exist")
	}

	ReadContent := string(content)

	message := FilePath
	
	if f.Ctx != nil {
		runtime.EventsEmit(f.Ctx, "file-opened", message)
		LogInfo("[FileService]","File reading Process ended", FilePath)
    }

	return ReadContent, nil
}

func (f *FileServices) WriteFile(content, path string) {
	//Make a temp path
	TempPath := fmt.Sprintf("%s.temp",path)
	OriginalPath := path
	data := []byte(content)
	// Write file in temp
	err := os.WriteFile(TempPath, data, 0644)

	if err != nil {
		LogError("[FileServices]", "There was problem in saving the temp file", err)
		return 
	}
	//rename temp

	err = os.Rename(TempPath, OriginalPath)
	if err != nil {
		LogError("[FileServices]", "There was problem in saving the file", err)
		return
	}
	
	message := OriginalPath
	if f.Ctx != nil {
		runtime.EventsEmit(f.Ctx, "file-saved", message)
		LogInfo("[FileService]","File saved successfully", message)
    }

}

func (f *FileServices) MoveFile(destination, source, name string) (string, error) {

	dest := destination
	src := source
	
	destinationPath := filepath.Join(dest, name)

	_, err := os.Stat(destinationPath) 

	if err == nil {
		LogError("[FileServices]", "File already exist in the destination path", destinationPath)
		return "", errors.New("File with same name already exist in the destination folder")
	}

	err = os.Rename(src, destinationPath)
	if err != nil {
		LogError("[FileServices]", "There was problem in moving the file", err)
		return "", err
	}

	message := Payload {
		Success: true,
		Data: destinationPath,
	}

	if f.Ctx != nil {
		runtime.EventsEmit(f.Ctx, "file-moved", message)
		LogInfo("[FileService]","File moved successfully", message)
    }

	return destinationPath, nil

}

func (f *FileServices) DeleteFile (ProjectPath, FilePath, FileName string) (string, error) {
	// Take the file name and make the delete path
	count := 0
	TrashLoc := filepath.Join(ProjectPath, ".trash")
	destination := filepath.Join(TrashLoc, fmt.Sprintf("%d-%s", count, FileName))
	// Check if that file already exist in the delete folder
	// if exist then add a number on it
	for {
		_, err := os.Stat(destination) 
		if err != nil {
			LogAlerts("[FileService]", "Found a available path", destination)
			break
		}
		// LogError("[FileService]", "Filepath already exists", filePath)
		count++
		destination = filepath.Join(TrashLoc, fmt.Sprintf("%d-%s", count, FileName))
	}

	err := os.Rename(FilePath, destination)
	if err != nil {
		LogError("[FileServices]", "There was problem in deleted the file", err)
		return "",err
	}

	message := destination
	if f.Ctx != nil {
		runtime.EventsEmit(f.Ctx, "file-deleted", message)
		LogInfo("[FileService]","File deleted successfully", message)
    }

	return message,nil
}

func (f *FileServices) RenameFile (OldNamePath, BasePath, NewName string) {
	NewNamePath := filepath.Join(BasePath, NewName)
	_,err := os.Stat(NewNamePath)
	LogAlerts("[FileService]","File renaming")

	if err == nil {
		LogAlerts("[FileServices]","File with the name already exist", err)
		return
	}

	err = os.Rename(OldNamePath, NewNamePath)

	message := NewNamePath
	if f.Ctx != nil {
		runtime.EventsEmit(f.Ctx, "file-renamed", message)
		LogInfo("[FileService]","File renamed successfully", message)
    }
}

func (f *FileServices) CreateFolder(ProjectPath string) {
    count := 0
	FolderPath := filepath.Join(ProjectPath, fmt.Sprintf("%d-New Folder", count))


	LogInfo("[FileService]", "Checking if the folder exist")

	for {
		_, err := os.Stat(FolderPath) 
		if err != nil {
			LogAlerts("[FileService]", "Found a available path", FolderPath)
			break
		}
		count++
		FolderPath = filepath.Join(ProjectPath, fmt.Sprintf("%d-New Folder", count))
	}

	err := os.MkdirAll(FolderPath, 0755)

	if err != nil {
		LogError("[FileServices]", "There was a error in creating the folder", err)
	}

	message := Payload {
		Success: true,
		Data: FolderPath,
	}
	if f.Ctx != nil {
		runtime.EventsEmit(f.Ctx, "folder-created", message)
		LogInfo("[FileService]","Create File Process ended", FolderPath)
    }

}