package services

import(
	"context"
	"github.com/wailsapp/wails/v2/pkg/runtime"
)

type DialogServices struct {
	Ctx context.Context
}

func (d *DialogServices) OpenDirectory() (string, error) {

	options := runtime.OpenDialogOptions{
		Title: "Select library directory",
	}

	dirPath, err := runtime.OpenDirectoryDialog(d.Ctx, options)

	if err != nil {
		LogError("There was a problem in getting directory path:", err)
	}

	return dirPath, nil

}