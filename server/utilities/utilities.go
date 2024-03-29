package utilities

import (
	"bytes"
	"encoding/base64"

	"github.com/ahmdrz/goinsta/v2"
	"github.com/websines/ig-server/database"
)

// ExportAsBytes exports selected *Instagram object as []byte
func ExportAsBytes(insta *goinsta.Instagram) ([]byte, error) {
	buffer := &bytes.Buffer{}
	err := goinsta.Export(insta, buffer)
	if err != nil {
		return nil, err
	}
	return buffer.Bytes(), nil
}

// ExportAsBase64String exports selected *Instagram object as base64 encoded string
func ExportAsBase64String(insta *goinsta.Instagram) (string, error) {
	bytes, err := ExportAsBytes(insta)
	if err != nil {
		return "", err
	}

	sEnc := base64.StdEncoding.EncodeToString(bytes)
	return sEnc, nil
}

func ImportFromBytes(inputBytes []byte) (*goinsta.Instagram, error) {
	return goinsta.ImportReader(bytes.NewReader(inputBytes))
}

// ImportFromBase64String imports instagram configuration from a base64 encoded string.
//
// This function does not set proxy automatically. Use SetProxy after this call.
func ImportFromBase64String(base64String string) (*goinsta.Instagram, error) {
	sDec, err := base64.StdEncoding.DecodeString(base64String)
	if err != nil {
		return nil, err
	}

	return ImportFromBytes(sDec)
}

func ProxyDistributor() string {
	var px database.Proxy

	database.DB.First(&px)

	proxy := px.Proxy

	database.DB.Delete(&px)

	return proxy
}
