package lib

import (
	"errors"
	u "github.com/eagle7410/go_util/libs"
	"net/http"
	"time"
)

type Profile struct {
	Name               string   `json:"name"`
	Files              []string `json:"files"`
	DirSave            string   `json:"dirSave"`
	IsUploadToOwnCloud bool     `json:"isUploadToOwnCloud"`
	IsActive           bool     `json:"isActive"`
}

func (i *Profile) IsNone() bool {
	return len(i.Name) == 0
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

func ProfilesApplyAll() {
	runAt := time.Now()

	data := map[string]interface{}{}

	for _, profile := range Config.Profiles {

		if !profile.IsActive {
			continue
		}

		data["profileName"] = profile.Name

		result := archiveNew(data)
		back := result.(SendBack)

		if back.Code != http.StatusOK {
			u.LogEF("Error execute profile %+v: back %+v", profile, back)
			return
		}
	}

	u.Logf("FINISH. EXECUTE TIME: %v", time.Since(runAt) )
}

func profileChangeActive(data interface{}) (response interface{}) {
	defer func() {
		if d := recover(); d != nil {
			response = handlerPanic(d)
		}
	}()

	pd := u.PanicData{}
	payload := data.(map[string]interface{})

	name := payload["name"].(string)
	isActive := payload["isActive"].(bool)

	err := Config.ChangeActiveProfile(&name, isActive).Save()

	pd.CheckAndPanicTechProblem(err != nil, "Error update config: %v", err)

	back := SendBack{
		Code: http.StatusOK,
		Type: SendBackTypeMessage,
		Data: "ok",
	}

	return back
}

func profileMove(data interface{}) (response interface{}) {
	defer func() {
		if d := recover(); d != nil {
			response = handlerPanic(d)
		}
	}()

	pd := u.PanicData{}
	payload := data.(map[string]interface{})

	name := payload["name"].(string)

	err := Config.MoveProfile(&name).Save()
	pd.CheckAndPanicTechProblem(err != nil, "Error update config: %v", err)

	back := SendBack{
		Code: http.StatusOK,
		Type: SendBackTypeMessage,
		Data: "ok",
	}

	return back
}

func profileEdit(data interface{}) (response interface{}) {
	defer func() {
		if d := recover(); d != nil {
			response = handlerPanic(d)
		}
	}()

	pd := u.PanicData{}
	payload := data.(map[string]interface{})

	profile := Profile{}
	profile.Name = payload["name"].(string)
	profile.DirSave = payload["dirSave"].(string)
	profile.IsUploadToOwnCloud = payload["isUploadToOwnCloud"].(bool)

	for _, file := range payload["files"].([]interface{}) {
		profile.Files = append(profile.Files, file.(string))
	}

	err := profile.GetErrorValidation()

	pd.CheckAndPanicBadReq(err != nil, "%v", err)

	err = Config.UpdateProfile(&profile).Save()

	pd.CheckAndPanicBadReq(err != nil, "Error save %v", err)

	back := SendBack{
		Code: http.StatusOK,
		Type: SendBackTypeMessage,
		Data: "ok",
	}

	return back
}

func profileNew(data interface{}) (response interface{}) {
	defer func() {
		if d := recover(); d != nil {
			response = handlerPanic(d)
		}
	}()

	pd := u.PanicData{}
	payload := data.(map[string]interface{})

	profile := Profile{}
	profile.Name = payload["name"].(string)
	profile.DirSave = payload["dirSave"].(string)
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
