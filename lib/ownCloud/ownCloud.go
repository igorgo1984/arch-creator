package ownCloud

import (
	"bytes"
	"encoding/xml"
	"errors"
	"fmt"
	"io"
	"io/ioutil"
	"net/http"
	"os"
	"path/filepath"
	"sort"
	"strconv"
)

type ConfigInterface interface {
	GetOwnCloudPassword() *string
	GetOwnCloudLogin() *string
	GetOwnCloudUri() *string
}

type (
	OwnCloud struct {
		user, pass, uri *string
	}
	OwnFileInfo struct {
		XMLName xml.Name `xml:"DAV: propstat"`
	}
	OwnFile struct {
		XMLName     xml.Name `xml:"DAV: response"`
		Link        string   `xml:"DAV: href"`
		Status      string   `xml:"DAV: propstat>status"`
		Size        string   `xml:"DAV: propstat>prop>getcontentlength,omitempty"`
		ContentType string   `xml:"DAV: propstat>prop>getcontenttype,omitempty"`
		ETag        string   `xml:"DAV: propstat>prop>getetag,omitempty"`
		Modified    string   `xml:"DAV: propstat>prop>getlastmodified,omitempty"`
	}
	OwnFiles struct {
		XMLName xml.Name  `xml:"DAV: multistatus"`
		List    []OwnFile `xml:"DAV: response"`
	}
	Error struct {
		// Exception contains the type of the exception returned by
		// the server.
		Exception string `xml:"exception"`
		// Message contains the error message string from the server.
		Message string `xml:"message"`
	}
)

func (i *OwnFiles) Len() int      { return len(i.List) }
func (i *OwnFiles) Swap(k, j int) { i.List[k], i.List[j] = i.List[j], i.List[k] }
func (i *OwnFiles) Less(k, j int) bool {
	if i.List[k].FileName() > i.List[j].FileName() {
		return true
	}

	if i.List[k].FileName() < i.List[j].FileName() {
		return false
	}

	return i.List[k].FileName() > i.List[j].FileName()
}

func (i *OwnFiles) Sort() {
	sort.Sort(i)
}

func (i *OwnFile) IsHasBase(base *string) bool {
	fileName := i.FileName()
	lenBase := len(*base)

	if lenBase > len(fileName) {
		return false
	}

	return *base != fileName[:lenBase]
}

func (i *OwnFile) IsGzip() bool {
	return i.ContentType == "application/x-gzip"
}

func (i *OwnFile) FileName() string {
	return filepath.Base(i.Link)
}

func (i *OwnCloud) Init(conf ConfigInterface) error {
	i.user = conf.GetOwnCloudLogin()
	i.pass = conf.GetOwnCloudPassword()
	i.uri = conf.GetOwnCloudUri()

	if len(*i.user) == 0 {
		return fmt.Errorf("not set user")
	}

	if len(*i.uri) == 0 {
		return fmt.Errorf("not set uri")
	}

	return nil
}

func (i *OwnCloud) GetFileByLink(link *string) (arrByte []byte, err error) {
	req, _ := http.NewRequest("GET", *i.uri + *link, nil)
	req.SetBasicAuth(*i.user, *i.pass)

	client    := &http.Client{}
	resp, err := client.Do(req)

	if err != nil {
		return arrByte, err
	}

	defer func () { _ = resp.Body.Close() }()

	if resp.StatusCode != http.StatusOK {
		return arrByte, newError("[GetFileByLink] Bad status code " + strconv.Itoa(resp.StatusCode))
	}

	body := &bytes.Buffer{}

	_, _ = io.Copy(body, resp.Body)


	return body.Bytes(), nil
}

func (i *OwnCloud) RemoveFileByLink(link *string) error {
	req, _ := http.NewRequest("DELETE", *i.uri + *link, nil)
	req.SetBasicAuth(*i.user, *i.pass)

	client := &http.Client{}
	resp, err := client.Do(req)

	if err != nil {
		return err
	}

	defer func () { _ = resp.Body.Close() }()

	if resp.StatusCode != http.StatusNoContent {
		respMess := getMessageFromBadRequest(resp)
		return newError("[RemoveFileByLink] Bad status code " + strconv.Itoa(resp.StatusCode) + " Cloud message is :" + respMess)
	}

	return nil
}

func (i *OwnCloud) MkDir (dirPath *string) (err error) {
	//TODO: clear
	//https://owncloud.hitech18.online/remote.php/webdav/test123 Status 201 is Normal

	req, err := http.NewRequest("MKCOL", *i.uri+"/remote.php/webdav" + *dirPath, nil)

	if err != nil {
		return err
	}

	req.SetBasicAuth(*i.user, *i.pass)

	client := &http.Client{}
	resp, err := client.Do(req)

	if err != nil {
		return err
	}

	defer func() { _ = resp.Body.Close() }()

	if resp.StatusCode != http.StatusCreated {
		respMess := getMessageFromBadRequest(resp)
		return newError("[MkDir] Bad status code " + strconv.Itoa(resp.StatusCode) + " Cloud message is :" + respMess)
	}

	return nil
}

func (i *OwnCloud) FileList() (files OwnFiles, err error) {
	req, err := http.NewRequest("PROPFIND", *i.uri+"/remote.php/webdav", nil)

	if err != nil {
		return files, err
	}

	req.SetBasicAuth(*i.user, *i.pass)
	client := &http.Client{}

	resp, err := client.Do(req)

	if err != nil {
		return files, err
	}

	body, err := ioutil.ReadAll(resp.Body)

	if err != nil {
		return files, newError("[DumpsFileList] Bad body in response")
	}

	defer func() { _ = resp.Body.Close() }()

	if resp.StatusCode != 207 {
		respMess := getMessageFromBadRequest(resp)
		return files, newError("[DumpsFileList] Bad status code " + strconv.Itoa(resp.StatusCode) + " Cloud message is :" + respMess)
	}

	if err = xml.Unmarshal(body, &files); err != nil {
		return files, newError("[DumpsFileList] Bad xml in response")
	}

	return files, nil
}

func (i *OwnCloud) File2Cloud(pathFile *string, pathWeb string) error {
	file, err := os.Open(*pathFile)
	defer func() { _ = file.Close() }()

	if err != nil {
		return err
	}

	body := &bytes.Buffer{}
	_, _ = io.Copy(body, file)

	req, err := http.NewRequest("PUT", *i.uri+"/remote.php/webdav" + pathWeb, body)

	if err != nil {
		return err
	}

	req.SetBasicAuth(*i.user, *i.pass)

	client := &http.Client{}

	resp, err := client.Do(req)

	if err != nil {
		return err
	}

	if _, err = body.ReadFrom(resp.Body); err != nil {
		return err
	}

	defer func() { _ = resp.Body.Close() }()

	if resp.StatusCode != 201 {
		respMess := getMessageFromBadRequest(resp)
		return newError("[File2Cloud] Bad status code " + strconv.Itoa(resp.StatusCode) + " Cloud message is :" + respMess)
	}

	return nil
}

func getMessageFromBadRequest(resp *http.Response) string {
	message := ""

	contentLength := resp.Header.Get("Content-Length")
	contentType := resp.Header.Get("Content-Type")

	if len(contentLength) != 0 {
		switch contentType {
		case "application/xml; charset=utf-8":
			body, err := ioutil.ReadAll(resp.Body)

			if err != nil {
				message = "Error read response body is " + fmt.Sprint(err)
			} else {
				error := Error{}

				if err := xml.Unmarshal(body, &error); err != nil {
					message = "Error during XML Unmarshal for response " + string(body) + ". The error is " + fmt.Sprint(err)
				}

				if error.Exception != "" {
					message = error.GetMessage()
				}
			}

		}
	}

	return message
}

func (e *Error) GetMessage() string {
	return "Exception : " + e.Exception + " ErrorMessage : " + e.Message
}

func newError(mess string) error {
	return errors.New("[OwnCloud ERROR] " + mess)
}

var Client = OwnCloud{}
