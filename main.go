package main

import (
	"arch-creator/lib"
	"arch-creator/lib/ownCloud"
	"flag"
	astiptr "github.com/asticode/go-astitools/ptr"
	u "github.com/eagle7410/go_util/libs"
	astilectron "github.com/igorgo1984/go-astilectron"
	"github.com/pkg/errors"
	"io/ioutil"
	"log"
	"os"
	"os/user"
	"path"
	"runtime"
)

var command string

func init() {
	if err := lib.Env.Init(); err != nil {
		log.Fatalf("Err init env %v", err)
	}

	if !lib.Config.IsHasFile() {
		if err := lib.Config.Save(); err != nil {
			log.Fatalf("Err init create first config %v", err)
		}

		os.Exit(0)
	}

	if err := lib.Config.Load(); err != nil {
		log.Fatalf("Err init create first config %v", err)
	}

	if len(lib.Config.OwnCloudUri) > 0 {
		if err := ownCloud.Client.Init(&lib.Config); err != nil {
			log.Fatalf("Err OwnCloud Client Init %v", err)
		}
	}

	flag.StringVar(&command, "c", "", "Extends command")
	log.Printf("Init is OK \n")
}

func main() {
	flag.Parse()

	switch command {
	// Create linux desktop link
	case "ls":
		createLinuxDesktop()
	default:
		runApp()
	}
}

func createLinuxDesktop() {
	if runtime.GOOS != "linux" {
		log.Fatalln("this is command use only with linux")
	}

	byffer, err := u.SlowRenderContent(&command, tplDesktop, lib.Env)

	if err != nil {
		log.Fatalf("Err render desktop file %v", err)
	}

	usr, err := user.Current()

	if err != nil {
		log.Fatalf("Err get current user %v", err)
	}

	err = ioutil.WriteFile(path.Join(usr.HomeDir, "/.local/share/applications/GDriveArch.desktop"), byffer.Bytes(), 0755)

	if err != nil {
		log.Fatalf("Err write desktop file %v", err)
	}
}

func runApp() {
	app, err := astilectron.New(astilectron.Options{
		AppName:            lib.Env.BinaryName,
		AppIconDefaultPath: lib.Env.PathFavPng,
		AppIconDarwinPath:  lib.Env.PathFavIcns,
		BaseDirectoryPath:  lib.Env.PathRuntime,
		SkipSetup:          false,
	})

	if err != nil {
		log.Fatal(errors.Wrap(err, "main: starting astilectron new"))
	}

	defer app.Close()

	// Start astilectron
	if err := app.Start(); err != nil {
		log.Fatal(errors.Wrap(err, "main: starting astilectron failed"))
	}

	// New window
	var win *astilectron.Window

	uri := lib.Env.PathIndex

	if len(lib.Env.Uri) > 0 {
		uri = lib.Env.Uri
	}

	if win, err = app.NewWindow(uri, &astilectron.WindowOptions{
		Center:      astiptr.Bool(true),
		Title:       astiptr.Str("Title"),
		Maximizable: astiptr.Bool(false),
	}); err != nil {
		log.Fatal(errors.Wrap(err, "main: new window failed"))
	}

	// Create windows
	if err = win.Create(); err != nil {
		log.Fatal(errors.Wrap(err, "main: creating window failed"))
	}

	// Create the menu
	var m = app.NewMenu([]*astilectron.MenuItemOptions{
		{
			Label: astilectron.PtrStr("Main"),
			SubMenu: []*astilectron.MenuItemOptions{
				{Label: astilectron.PtrStr("Edit"), Role: astilectron.MenuItemRoleEditMenu},
				{Label: astilectron.PtrStr("Minimize"), Role: astilectron.MenuItemRoleMinimize},
				{Label: astilectron.PtrStr("Close"), Role: astilectron.MenuItemRoleClose},
			},
		},
	})
	_ = m.Create()

	win.OnMessage(lib.HandlerMessages)

	_ = win.Maximize()

	if lib.Env.IsDev {
		_ = win.OpenDevTools()
	}

	// Blocking pattern
	log.Printf("App run \n")
	app.Wait()
}

const tplDesktop = `
[Desktop Entry]
Name={{.BinaryName}}
Comment=
GenericName=
Keywords=
Exec=/bin/bash -c 'cd {{.WorkDir}} && {{.WorkDir}}/{{.BinaryName}}' 
Terminal=false
Type=Application
Icon={{.WorkDir}}/pub/fav.png
Path=
Categories=app
NoDisplay=false
`
