package main

import (
	"embed"
	"context"
	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/options"
	"github.com/wailsapp/wails/v2/pkg/options/assetserver"
	"rabbit-pad/services"
)

//go:embed all:frontend/dist
var assets embed.FS

func main() {
	// Create an instance of the app structure
	app := NewApp()
	//startupService := services.NewStartUpServices() Might remove it later

	//Initialize services
	startupServices := &services.StartUpServices{}
	dialogServices := &services.DialogServices{}
	libraryServices := &services.LibraryServices{}
	projectServices := &services.ProjectServices{}

	// Create application with options
	err := wails.Run(&options.App{
		Title:  "rabbit-pad",
		Width:  1024,
		Height: 768,
		AssetServer: &assetserver.Options{
			Assets: assets,
		},
		BackgroundColour: &options.RGBA{R: 27, G: 38, B: 54, A: 1},

		// 2. Wire up the startup pipeline using a custom function closure
		OnStartup: func(ctx context.Context) {
			app.startup(ctx)                  // Let the main app setup its window
			dialogServices.Ctx = ctx          // Pass the live UI context to your dialogs!
			startupServices.Ctx = ctx       // (If your startup service needs it later)
			libraryServices.Ctx = ctx
			projectServices.Ctx = ctx
		},

		Bind: []interface{}{
			app,
			startupServices,
			libraryServices,
			dialogServices,
			projectServices,
		},
	})

	if err != nil {
		println("Error:", err.Error())
	}
}
