FROM golang:alpine

WORKDIR /usr/src/app

COPY go.mod go.sum ./
RUN go mod download && go mod verify

COPY . .
RUN go build -ldflags "-s -w" -v -o /usr/local/bin/app ./app

FROM alpine

ARG USER_ID
ARG GROUP_ID
RUN addgroup --gid ${GROUP_ID} app \
 && adduser --disabled-password --uid ${USER_ID} --ingroup app --gecos '' app

COPY --from=0 /usr/local/bin /usr/local/bin

USER app
ENTRYPOINT [ "app" ]
