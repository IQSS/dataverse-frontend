package main

import (
	"crypto/tls"
	"fmt"
	"io"
	"net/http"
	"os"
	"time"

	"github.com/libis/rdm-dataverse-go-api/api"
)

const timeout = 5 * time.Minute

var dataverseServer = os.Getenv("DATAVERSE_SERVER")
var apiKey = os.Getenv("API_KEY")
var unblockKey = os.Getenv("UNBLOCK_KEY")
var userHeader = os.Getenv("USER_HEADER")

func main() {
	srvMux := http.NewServeMux()
	srvMux.Handle("/", http.HandlerFunc(handle))
	tlsConfig := &tls.Config{InsecureSkipVerify: true}
	srv := &http.Server{
		Addr:              ":8080",
		ReadTimeout:       timeout,
		WriteTimeout:      timeout,
		IdleTimeout:       timeout,
		ReadHeaderTimeout: timeout,
		TLSConfig:         tlsConfig,
		Handler:           http.TimeoutHandler(srvMux, timeout, fmt.Sprintf("processing the request took longer than %v: cancelled", timeout)),
	}
	srv.ListenAndServe()
}

func handle(w http.ResponseWriter, r *http.Request) {
	client := api.NewClient(dataverseServer)
	client.User = r.Header.Get(userHeader)
	client.AdminApiKey = apiKey
	client.UnblockKey = unblockKey
	req := client.NewRequest(r.URL.Path, r.Method, r.Body, r.Header)
	res, err := api.DoStream(r.Context(), req)
	if err != nil {
		return
	}
	defer res.Close()
	io.Copy(w, res)
}
