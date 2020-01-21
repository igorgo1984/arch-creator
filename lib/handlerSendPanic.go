package lib

import (
	u "github.com/eagle7410/go_util/libs"
	"net/http"
	"reflect"
)

func handlerPanic(d interface{}) SendBack {
	switch reflect.TypeOf(d).String() {
	case "string":
		return SendBack{
			Type: SendBackTypeMessage,
			Code: http.StatusBadRequest,
			Data: d.(string),
		}
	case "*lib.PanicData":
		data := d.(*u.PanicData)

		return SendBack{
			Type: SendBackTypeMessage,
			Code: data.Type,
			Data: data.Mess,
		}
	default:
		e := d.(error)

		return SendBack{
			Type: SendBackTypeMessage,
			Code: http.StatusBadRequest,
			Data: e.Error(),
		}
	}
}
