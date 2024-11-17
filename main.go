package main

import (
	"context"
	"embed"
	"log"
	"os"
	"phd-support/database"

	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/options"
	"github.com/wailsapp/wails/v2/pkg/options/assetserver"

	_ "github.com/mattn/go-sqlite3"
)

//go:embed all:frontend/dist
var assets embed.FS

func main() {

	file, err := os.OpenFile("debug.log", os.O_CREATE|os.O_WRONLY|os.O_APPEND, 0666)
	if err != nil {
		log.Fatal(err)
	}
	log.SetOutput(file)

	db, r := database.NewDb()

	if r != nil {
		log.Fatal(r)
	}

	// Create an instance of the app structure
	app := NewApp()

	// Create application with options
	r = wails.Run(&options.App{
		Title:  "phd-support",
		Width:  1024,
		Height: 768,
		AssetServer: &assetserver.Options{
			Assets: assets,
		},
		OnStartup: app.startup,
		Bind: []interface{}{
			app,
			db,
		},
		OnShutdown: func(ctx context.Context) {
			db.Db.Close()
		},
	})

	if r != nil {
		println("Error:", r.Error())
	}
}
