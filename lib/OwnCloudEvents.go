package lib

import (
	"arch-creator/lib/ownCloud"
	u "github.com/eagle7410/go_util/libs"
	"net/http"
)

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

func ownCloudRootFileList(_ interface{}) (response interface{}) {
	defer func() {
		if d := recover(); d != nil {
			response = handlerPanic(d)
		}
	}()

	pd := u.PanicData{}

	files, err := ownCloud.Client.FileList()

	pd.CheckAndPanicBadReq(err != nil, "error get file list: %v", err)

	back := SendBack{
		Code: http.StatusOK,
		Type: SendBackTypeData,
		Data: &files,
	}

	return back
}