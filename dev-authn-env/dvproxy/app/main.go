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
		Addr:              ":5050",
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
	user := r.Header.Get(userHeader)
	client := api.NewUrlSigningClient(dataverseServer, user, apiKey, unblockKey)
	url := r.URL.Path
	if r.URL.RawQuery != "" {
		url = fmt.Sprintf("%s?%s", url, r.URL.RawQuery)
	}
	req := client.NewRequest(url, r.Method, r.Body, r.Header)
	res, err := api.DoStream(r.Context(), req)
	if err != nil {
		fmt.Println(err)
		return
	}
	defer res.Close()
	io.Copy(w, res)
}
