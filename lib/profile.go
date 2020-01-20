package lib

import (
	"errors"
	u "github.com/eagle7410/go_util/libs"
	"net/http"
	"reflect"
)

type Profile struct {
	Name               string   `json:"name"`
	Files              []string `json:"files"`
	DirSave            string   `json:"dirSave"`
	IsUploadToOwnCloud bool     `json:"isUploadToOwnCloud"`
	IsActive           bool     `json:"isActive"`
}

func (i *Profile) GetErrorValidation() error {
	if len(i.Name) == 0 {
		return errors.New("name required")
	}

	if len(i.DirSave) == 0 {
		return errors.New("dir for save required")
	}

	if !u.FileExists(i.DirSave) {
		return errors.New("save dir no exist")
	}

	if len(i.Files) == 0 {
		return errors.New("no files save to archive")
	}

	return nil
}

func profileNew (data interface{}) (response interface{}) {
	defer func() {
		if d := recover(); d != nil {
			switch reflect.TypeOf(d).String() {
			case "string":
				response = SendBack{
					Type: SendBackTypeMessage,
					Code: http.StatusBadRequest,
					Data: d.(string),
				}
			case "*lib.PanicData":
				data := d.(*u.PanicData)

				response = SendBack{
					Type: SendBackTypeMessage,
					Code: data.Type,
					Data: data.Mess,
				}
			default:
				e := d.(error)

				response = SendBack{
					Type: SendBackTypeMessage,
					Code: http.StatusBadRequest,
					Data: e.Error(),
				}
			}
		}
	}()

	pd := u.PanicData{}
	payload := data.(map[string]interface{})

	profile := Profile{}

	profile.Name               = payload["name"].(string)
	profile.DirSave            = payload["dirSave"].(string)
	profile.IsUploadToOwnCloud = payload["isUploadToOwnCloud"].(bool)


	for _, file := range payload["files"].([]interface{}) {
		profile.Files = append(profile.Files, file.(string))
	}

	err := profile.GetErrorValidation()

	pd.CheckAndPanicBadReq(err != nil, "%v", err)

	err = Config.AddProfile(&profile)

	pd.CheckAndPanicBadReq(err != nil, "%v", err)

	err = Config.Save()
	pd.CheckAndPanicBadReq(err != nil, "%v", err)

	back := SendBack{
		Code: http.StatusOK,
		Type: SendBackTypeMessage,
		Data: "ok",
	}

	return back
}
