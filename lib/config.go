package lib

import (
	"encoding/json"
	"fmt"
	u "github.com/eagle7410/go_util/libs"
	"io/ioutil"
	"net/http"
	"os"
	"reflect"
	"strings"
)

type (
	config struct {
		OwnCloudUri        string    `json:"ownCloudUri"`
		OwnCloudPassword   string    `json:"ownCloudPassword"`
		OwnCloudLogin      string    `json:"ownCloudLogin"`
		DefaultSaveArchDir string    `json:"defaultSaveArchDir"`
		Profiles           []Profile `json:"profiles"`
	}
)

var Config = config{}

func toCompareName (s *string) string {
	return strings.ToLower(strings.Trim(*s, " "))
}

func (i *config) AddProfile(p *Profile) (err error) {

	compareName := toCompareName(&p.Name)

	for inx, _ := range i.Profiles {
		if toCompareName(&i.Profiles[inx].Name) == compareName {
			return fmt.Errorf("%v already exist", compareName)
		}
	}

	i.Profiles = append(i.Profiles, *p);

	return nil
}

func (i *config) Save() (err error) {
	arrByte, err := json.MarshalIndent(i, "", "\t")

	if err != nil {
		return err
	}

	err = ioutil.WriteFile(Env.PathAppConfig, arrByte, os.ModePerm)

	return err
}

func (i *config) Load() (err error) {
	if u.FileExists(Env.PathAppConfig) {
		arrByte, err := ioutil.ReadFile(Env.PathAppConfig)

		if err != nil {
			return err
		}

		if err = json.Unmarshal(arrByte, i); err != nil {
			return err
		}
	}

	return nil
}

func appConfigSet(data interface{}) (response interface{}) {
	defer func() {
		if d := recover(); d != nil {

			switch reflect.TypeOf(d).String() {
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

	Config.OwnCloudUri = payload["OwnCloudUri"].(string)
	Config.OwnCloudPassword = payload["OwnCloudPassword"].(string)
	Config.OwnCloudLogin = payload["OwnCloudLogin"].(string)
	Config.DefaultSaveArchDir = payload["defaultSaveArchDir"].(string)

	err := Config.Save()
	pd.CheckAndPanicTechProblem(err != nil, "Error write config file %v", err)

	back := SendBack{
		Code: http.StatusOK,
		Type: SendBackTypeMessage,
		Data: "ok",
	}

	return back
}

func appInit(_ interface{}) (response interface{}) {

	back := SendBack{
		Code: http.StatusOK,
		Type: SendBackTypeData,
		Data: Config,
	}

	return back
}
