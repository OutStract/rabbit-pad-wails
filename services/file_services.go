package services

import (
	"context"
	"errors"
	"fmt"
	"os"
	"path/filepath"

	"github.com/google/uuid"
	//"github.com/wailsapp/wails/v2/pkg/runtime"
)


type FileServices struct {
	Ctx context.Context
}

func (f *FileServices) CreateFile(ProjectPath string) Payload {
	
	count := 0
	filePath := filepath.Join(ProjectPath, fmt.Sprintf("%d-untitled.md", count))


	LogInfo("[FileService]", "Checking if the file exist")

	for {
		_, err := os.Stat(filePath) 
		if err != nil {
			LogAlerts("[FileService]", "Found a available path", filePath)
			break
		}
		count++
		filePath = filepath.Join(ProjectPath, fmt.Sprintf("%d-untitled.md", count))
	}

	id, err := uuid.NewV7()
	if err != nil {
		LogError("[FileService]", "There is a problem in making the file ID")
		err = errors.New("Problem in adding id in the file")

		return failure("File Services: Create File", "CREATE_FILE", "There was an error in making file id", err)
	}

	data := []byte(fmt.Sprintf("<--!%s-->\n", id.String()))

	err = os.WriteFile(filePath, data, 0644)

	if err != nil {
		return failure("File Services: Create File", "CREATE_FILE", "There was an error in writing the file", err)
	}

	return success("File Services: Create File", "CREATE_FILE", "File created successfully", filePath)
}

func (f *FileServices) ReadFile(FilePath string) Payload {

	content, err := os.ReadFile(FilePath)


	if err != nil {
		LogError("[FileServices]", "There was problem in opening the file", err)
		return failure("File Services: Read File", "READ_FILE", "There was an error in reading the file", err)
	}

	ReadContent := string(content)

	return success("File Services: Create File", "CREATE_FILE", "File content read successfully", ReadContent)
}

func (f *FileServices) WriteFile(content, path string) Payload {
	//Make a temp path
	TempPath := fmt.Sprintf("%s.temp",path)
	OriginalPath := path
	data := []byte(content)
	// Write file in temp
	err := os.WriteFile(TempPath, data, 0644)

	if err != nil {
		LogError("[FileServices]", "There was problem in saving the temp file", err)
		return failure("File Services: Write File", "WRITE_FILE", "There was an error in making the temp file", err)
	}
	//rename temp

	err = os.Rename(TempPath, OriginalPath)
	if err != nil {
		LogError("[FileServices]", "There was problem in saving the file", err)
		return failure("File Services: Write File", "WRITE_FILE", "There was an error in renaming the temp file", err)
	}

	return success("File Services: Write File", "WRITE_FILE", "File saved successfully", OriginalPath)


}

func (f *FileServices) MoveFile(destination, source, name string) Payload {

	dest := destination
	src := source
	
	destinationPath := filepath.Join(dest, name)

	_, err := os.Stat(destinationPath) 

	if err == nil {
		LogError("[FileServices]", "File already exist in the destination path", destinationPath)
		err = errors.New("File with same name already exist in the destination folder")
		return failure("File Services: Move File", "MOVE_FILE", "File with the same name already exist", err)
	}

	err = os.Rename(src, destinationPath)
	if err != nil {
		LogError("[FileServices]", "There was problem in moving the file", err)
		return failure("File Services: Move File", "MOVE_FILE", "There was an error in moving the file", err)
	}

	return success("File Services: Move File", "MOVE_FILE", "File moved successfully", destination)


}

func (f *FileServices) DeleteFile(ProjectPath, FilePath, FileName string) Payload {
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
		count++
		destination = filepath.Join(TrashLoc, fmt.Sprintf("%d-%s", count, FileName))
	}

	err := os.Rename(FilePath, destination)
	if err != nil {
		LogError("[FileServices]", "There was problem in deleted the file", err)
		return failure("File Services: Delete File", "DELETE_FILE", "There was an error in deleteing the file", err)
	}

	return success("File Services: Delete File", "DELETE_FILE", "File deleted successfully", destination)

}

func (f *FileServices) RenameFile(OldNamePath, BasePath, NewName string) Payload {
	NewNamePath := filepath.Join(BasePath, NewName)
	_,err := os.Stat(NewNamePath)

	if err == nil {
		LogAlerts("[FileServices]","File with the name already exist", err)
		return failure("File Services: Rename File", "RENAME_FILE", "File with the same name exist", err)
	}

	err = os.Rename(OldNamePath, NewNamePath)

	if err != nil {
		return failure("File Services: Rename File", "RENAME_FILE", "Error in renaming the file", err)
	}

	return success("File Services: Rename File", "RENAME_FILE", "File renamed successfully", NewNamePath)

}

func (f *FileServices) CreateFolder(ProjectPath string) Payload {
    count := 0
	FolderPath := filepath.Join(ProjectPath, fmt.Sprintf("%d-New Folder", count))

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
		return failure("File Services: Create Folder", "CREATE_FOLDER", "Error in creating new folder", err)

	}

	return success("File Services: Create Folder", "CREATE_FOLDER", "Folder created successfully", FolderPath)
}