package lib

import (
	astilectron "github.com/igorgo1984/go-astilectron"
	"log"
)

const (
	SendBackTypeMessage = iota + 1
	SendBackTypeData
)

type (
	SendBack struct {
		Code int         `json:"code"`
		Type int         `json:"type"`
		Data interface{} `json:"data"`
	}
	Send struct {
		Uri    string      `json:"url"`
		Method string      `json:"method"`
		Data   interface{} `json:"data"`
	}
)

func HandlerMessages(m *astilectron.EventMessage) interface{} {

	// Unmarshal
	send := Send{}
	_ = m.Unmarshal(&send)

	if Env.IsDev {
		log.Printf("New send %+v \n", send)
	}

	switch send.Uri {
	case "/app/config/set":
		return appConfigSet(send.Data)
	case "/app/init":
		return appInit(send.Data)
	case "ping":
		p := send.Data.(map[string]interface{})

		if p["msg"] == "ping" {
			p["msg"] = "pong"
		}

		send.Data = &p

		return send
	}

	return send
}
