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
		LogError("[DialogServices]","There was a problem in getting directory path:", err)
	}

	LogSuccess("[DialogServices]", "Library Path captured succesfully")

	return dirPath, nil

}