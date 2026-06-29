package services

import(
	"context"
	"github.com/wailsapp/wails/v2/pkg/runtime"
)

type DialogServices struct {
	Ctx context.Context
}

func (d *DialogServices) OpenDirectory() Payload {

	options := runtime.OpenDialogOptions{
		Title: "Select library directory",
	}

	dirPath, err := runtime.OpenDirectoryDialog(d.Ctx, options)

	if err != nil {
		LogError("[DialogServices]","There was a problem in getting directory path:", err)
		failure("Dialog Services: Open Directory", "OPEN_DIRECTORY", "There was a problem in opening the directory", err )
	}

	LogSuccess("[DialogServices]", "Library Path captured successfully")

	return success("Dialog Services: Open Directory", "OPEN_DIRECTORY", "File directory dialog has got the selected path", dirPath)

}