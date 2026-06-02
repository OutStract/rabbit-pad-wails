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
	filePath := filepath.Join(ProjectPath, fmt.Sprintf("%d - untitled.md", count))


	LogInfo("[FileService]", "Checking if the file exist")

	for {

		_, err := os.Stat(filePath) 

		if err != nil {
			LogAlerts("[FileService]", "Found a available path", filePath)
			break
		}
		// LogError("[FileService]", "Filepath already exists", filePath)
		count++
		filePath = filepath.Join(ProjectPath, fmt.Sprintf("%d - untitled.md", count))


	}

	id, err := uuid.NewV7()
	if err != nil {
		LogError("[FileService]", "There is a problem in making the file ID")
	}

	data := []byte(fmt.Sprintf("<--!%s-->", id.String()))

	err = os.WriteFile(filePath, data, 0644)

	message := filePath
	if f.Ctx != nil {
		runtime.EventsEmit(f.Ctx, "file-created", message)
		LogInfo("[FileService]","Create File Process ended", filePath)
    }

}