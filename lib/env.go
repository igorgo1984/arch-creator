package lib

import (
	"errors"
	u "github.com/eagle7410/go_util/libs"
	"github.com/joho/godotenv"
	"os"
	"path"
	"reflect"
	"strings"
)

type (
	env struct {
		WorkDir,
		BinaryName,
		TimeZone,
		Uri,
		Place string

		PathRuntime,
		PathAppConfig,
		PathIndex,
		PathFavPng,
		PathPublic,
		PathFavIcns string

		IsLocal,
		IsDev bool
	}
)

func (i *env) initDotEnv() (err error) {
	envPath := path.Join(i.WorkDir, ".env")

	if _, err := os.Stat(envPath); err == nil {
		if err := godotenv.Load(envPath); err != nil {
			return err
		}
	}

	props := map[string]bool{
		"BinaryName":  false,
		"Place":       false,
		"Uri":         false,
		"PathPublic":  false,
		"PathRuntime": false,
	}

	for prop, isRequired := range props {

		v := os.Getenv(prop)

		if isRequired == true && v == "" {
			return errors.New("Bad " + prop)
		}

		reflect.ValueOf(i).Elem().FieldByName(prop).SetString(v)
	}

	i.BinaryName = "ArchCreator"

	return nil
}

func (i *env) initPaths() (err error) {

	if len(i.PathRuntime) == 0 {
		i.PathRuntime = path.Join(i.WorkDir, "runtime")
	}

	if err = u.MustDir(i.PathRuntime, os.ModePerm); err != nil {
		return err
	}

	if len(i.PathPublic) == 0 {
		i.PathPublic = path.Join(i.WorkDir, "pub")
	}

	i.PathFavPng = path.Join(i.PathPublic, "fav.png")
	i.PathFavIcns = path.Join(i.PathPublic, "fav.icns")
	i.PathIndex = path.Join(i.PathPublic, "index.html")
	i.PathAppConfig = path.Join(i.PathRuntime, "app.json")

	if err = u.MustDir(i.PathRuntime, os.ModePerm); err != nil {
		return err
	}

	return nil
}

func (i *env) Init() (err error) {
	if i.WorkDir, err = os.Getwd(); err != nil {
		return err
	}

	if err = i.initDotEnv(); err != nil {
		return err
	}

	if err = i.initPaths(); err != nil {
		return err
	}

	if strings.ToLower(os.Getenv("IsLocal")) == "true" {
		i.IsLocal = true
	}

	if strings.ToLower(os.Getenv("IsDev")) == "true" {
		i.IsDev = true
	}

	return nil
}

var Env env
