package lib

import (
	u "github.com/eagle7410/go_util/libs"
	"go.mongodb.org/mongo-driver/bson"
	"io/ioutil"
	"net/http"
	"os"
	"reflect"
)

type (
	config struct {
		IsHasCredentials bool     `json:"isHasCredentials" bson:"isHasCredentials" `
		Files            []string `json:"files" bson:"files" `
	}
)

var Config = config{}

func (i *config) Save() (err error) {
	arrByte, err := bson.Marshal(i)

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

		if err = bson.Unmarshal(arrByte, i); err != nil {
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
	//pd := u.PanicData{}

	//payload := data.(map[string]interface{})
	//
	//pd.CheckAndPanicTechProblem(err != nil, "Error write config file %v", err)

	back := SendBack{
		Code: http.StatusOK,
		Type: SendBackTypeMessage,
		Data: "dummy",
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
