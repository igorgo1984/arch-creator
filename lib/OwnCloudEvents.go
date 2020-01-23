package lib

import (
	"arch-creator/lib/ownCloud"
	u "github.com/eagle7410/go_util/libs"
	"io/ioutil"
	"net/http"
	"os"
)

func ownCloudFileDownload(data interface{}) (response interface{}) {
	defer func() {
		if d := recover(); d != nil {
			response = handlerPanic(d)
		}
	}()

	pd := u.PanicData{}

	payload  := data.(map[string]interface{})

	link     := payload["link"].(string)
	pathSave := payload["pathSave"].(string)

	arrByte, err := ownCloud.Client.GetFileByLink(&link)
	pd.CheckAndPanicBadReq(err != nil, "error get file content: %v", err)

	err = ioutil.WriteFile(pathSave, arrByte, os.ModePerm)
	pd.CheckAndPanicBadReq(err != nil, "error save file content: %v", err)

	back := SendBack {
		Code: http.StatusOK,
		Type: SendBackTypeMessage,
		Data: "ok",
	}

	return back;
}

func ownCloudFileMove(data interface{}) (response interface{}) {
	defer func() {
		if d := recover(); d != nil {
			response = handlerPanic(d)
		}
	}()

	pd := u.PanicData{}

	payload := data.(map[string]interface{})
	link    := payload["link"].(string)

	err := ownCloud.Client.RemoveFileByLink(&link)
	pd.CheckAndPanicBadReq(err != nil, "error get file drop: %v", err)

	back := SendBack{
		Code: http.StatusOK,
		Type: SendBackTypeMessage,
		Data: "ok",
	}

	return back;
}

func ownCloudRootFileList(data interface{}) (response interface{}) {
	defer func() {
		if d := recover(); d != nil {
			response = handlerPanic(d)
		}
	}()

	pd := u.PanicData{}
	payload := data.(map[string]interface{})

	linkInteface, isHas := payload["link"]
	link := "/remote.php/webdav/"

	if (isHas) {
		link = linkInteface.(string)
	}

	files, err := ownCloud.Client.FileList(&link)

	pd.CheckAndPanicBadReq(err != nil, "error get file list: %v", err)

	back := SendBack{
		Code: http.StatusOK,
		Type: SendBackTypeData,
		Data: &files,
	}

	return back
}
