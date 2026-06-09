package services

import(
	"context"
	"path/filepath"
	"os"
	"fmt"
	"github.com/google/uuid"
	"github.com/wailsapp/wails/v2/pkg/runtime"

)


type FileServices struct {
	Ctx context.Context
}

func (f *FileServices) CreateFile (ProjectPath string) {
	
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
	}

	data := []byte(fmt.Sprintf("<--!%s-->\n", id.String()))

	err = os.WriteFile(filePath, data, 0644)

	message := filePath
	if f.Ctx != nil {
		runtime.EventsEmit(f.Ctx, "file-created", message)
		LogInfo("[FileService]","Create File Process ended", filePath)
    }

}

func (f *FileServices) ReadFile (FilePath string) (string, error) {

	content, err := os.ReadFile(FilePath)


	if err != nil {
		LogError("[FileServices]", "There was problem in opening the file", err)
		return "", err
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

func (f *FileServices) MoveFile (destination, source, name string) {

	dest := destination
	src := source
	
	destinationPath := filepath.Join(dest, name)

	_, err := os.Stat(destinationPath) 

	if err == nil {
		LogError("[FileServices]", "File already exist in the destination path", err)
		return
	}

	err = os.Rename(src, destinationPath)
	if err != nil {
		LogError("[FileServices]", "There was problem in moving the file", err)
		return
	}

	message := dest
	if f.Ctx != nil {
		runtime.EventsEmit(f.Ctx, "file-moved", message)
		LogInfo("[FileService]","File moved successfully", message)
    }

}