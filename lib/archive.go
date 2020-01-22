package lib

import (
	"arch-creator/lib/ownCloud"
	"archive/zip"
	"bytes"
	"fmt"
	u "github.com/eagle7410/go_util/libs"
	"io"
	"io/ioutil"
	"net/http"
	"os"
	"path"
	"path/filepath"
	"time"
)

func archiveNew(data interface{}) (response interface{}) {
	defer func() {
		if d := recover(); d != nil {
			response = handlerPanic(d)
		}
	}()

	pd := u.PanicData{}
	payload := data.(map[string]interface{})
	name := payload["profileName"].(string)

	profile := Config.ProfileByName(&name)
	pd.CheckAndPanicBadReq(profile.IsNone(), "Profile not found or not active")

	report := make(map[string]string)
	report["RunCreateArchive"] = "ok"

	u.Logf("Create archive for %v", name)

	name, addReport, err := ArchPackFiles(&profile.Files, &name, &profile.DirSave)

	pd.CheckAndPanicBadReq(err != nil, "Error adding to zip file %v", err)

	for name, value := range addReport {
		report["--"+name] = value
	}

	if profile.IsUploadToOwnCloud {
		if len(Config.OwnCloudUri) > 0 {
			pathZip := path.Join(profile.DirSave, name)

			err := ownCloud.Client.File2Cloud(&pathZip, "/"+name)
			pd.CheckAndPanicBadReq(err != nil, "Error send to cloud %v", err)
			report["SendToOwnCloud"] = "ok"
		}
	}

	back := SendBack{
		Code: http.StatusOK,
		Type: SendBackTypeData,
		Data: &report,
	}

	return back
}

const tsLayout = "2006-01-02-15-04-05"

func GeneArchName(base *string) (name, ts string) {
	ts = time.Now().Format(tsLayout)
	return fmt.Sprintf("%v_%v.zip", ts, *base), ts
}

func ArchUnPackFiles(pathZip *string) (err error) {

	var zipReader *zip.ReadCloser

	isInitReader := false

	defer func() {
		if isInitReader {
			_ = zipReader.Close()
		}

		if d := recover(); d != nil {
			data := d.(*u.PanicData)
			err = data.NewError()
		}
	}()
	pd := u.PanicData{}

	zipReader, err = zip.OpenReader(*pathZip)

	pd.CheckAndPanic(err != nil, "Error read zip file %v: %v", *pathZip, err)
	isInitReader = true

	var fileDescr *os.File

	for _, file := range zipReader.File {
		zipFileReader, err := file.Open()

		pd.CheckAndPanic(err != nil, "Error read zip file %v: %v", file.Name, err)

		buf := new(bytes.Buffer)

		if _, err = io.Copy(buf, zipFileReader); err != nil {
			pd.Panic("Error read file %v: %v", file.Name, err)
		}

		_ = zipFileReader.Close()

		arrByte := buf.Bytes()

		if u.FileExists(file.Name) {
			fileDescr, err = os.OpenFile(file.Name, os.O_RDWR, file.Mode())
			pd.CheckAndPanic(err != nil, "Error open file %v: %v", file.Name, err)
		} else {
			baseDir := filepath.Dir(file.Name)

			if !u.FileExists(baseDir) {
				err = os.MkdirAll(baseDir, os.ModePerm)
				pd.CheckAndPanic(err != nil, "Error create path %v: %v", file.Name, err)
			}

			fileDescr, err = os.Create(file.Name)
			pd.CheckAndPanic(err != nil, "Error create file %v: %v", file.Name, err)
		}

		_, err = fileDescr.Write(arrByte)
		pd.CheckAndPanic(err != nil, "Error write file %v: %v", file.Name, err)

		_ = fileDescr.Close()
	}

	return nil
}

func ArchPackFiles(paths *[]string, zipFileBase, zipPath *string) (name string, report map[string]string, err error) {
	var zipWriter *zip.Writer
	var zipFile *os.File

	report = make(map[string]string)
	isInitFile := false

	defer func() {
		if isInitFile {
			_ = zipWriter.Close()
			_ = zipFile.Close()
		}
		if d := recover(); d != nil {
			data := d.(*u.PanicData)
			err = data.NewError()
		}
	}()
	pd := u.PanicData{}

	name, _ = GeneArchName(zipFileBase)

	zipFile, err = os.Create(path.Join(*zipPath, name))

	pd.CheckAndPanic(err != nil, "error create zip file: %v", err)

	u.Logf("Create zip file %v", name)

	zipWriter = zip.NewWriter(zipFile)
	isInitFile = true

	inxStr := ""

	for _, p := range *paths {
		inxStr = path.Base(p)

		if !u.FileExists(p) {
			report["AddPath"+inxStr] = fmt.Sprintf("file not exist %v", p)
			u.Logf("!!! WARN path not exists %v", p)
			continue
		}

		addPathToArch(zipWriter, p, &pd)

		report["AddPathNum"+inxStr] = "Add Ok"
	}

	return name, report, zipWriter.Flush()
}

func addPathToArch(zipWriter *zip.Writer, pathBase string, pd *u.PanicData) {
	fileInfo, err := os.Stat(pathBase)

	pd.CheckAndPanic(err != nil, "error get info about path %v: %v", pathBase, err)

	if fileInfo.IsDir() {
		paths, err := ioutil.ReadDir(pathBase)

		pd.CheckAndPanic(err != nil, "error read dir %v: %v", pathBase, err)

		var currentPath string

		for _, p := range paths {
			currentPath = path.Join(pathBase, p.Name())

			if p.IsDir() {
				addPathToArch(zipWriter, currentPath, pd)
			} else {
				addFileToArch(zipWriter, currentPath, pd)
			}

			u.Logf("-- Add path %v", p.Name())
		}
	} else {
		addFileToArch(zipWriter, pathBase, pd)
		u.Logf("-- Add path %v", pathBase)
	}
}

func addFileToArch(zipWriter *zip.Writer, pathBase string, pd *u.PanicData) {
	header := zip.FileHeader{
		Name:     pathBase,
		Method:   zip.Deflate,
		Modified: time.Now(),
	}

	fileInFile, err := zipWriter.CreateHeader(&header)

	pd.CheckAndPanic(err != nil, "error create file %v in arch %v", pathBase, err)

	arrByte, err := ioutil.ReadFile(pathBase)

	pd.CheckAndPanic(err != nil, "error read file %v: %v", pathBase, err)

	_, err = fileInFile.Write(arrByte)

	pd.CheckAndPanic(err != nil, "error write file %v to arch: %v", pathBase, err)
}
