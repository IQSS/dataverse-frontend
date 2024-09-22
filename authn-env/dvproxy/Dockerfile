FROM golang:alpine

WORKDIR /usr/src/app

COPY go.mod go.sum ./
RUN go mod download && go mod verify

COPY . .
RUN go build -ldflags "-s -w" -v -o /usr/local/bin/app ./app

FROM alpine

COPY --from=0 /usr/local/bin /usr/local/bin

ENTRYPOINT [ "app" ]
