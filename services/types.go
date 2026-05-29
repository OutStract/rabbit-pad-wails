// utils/types.go
package services

type AppState struct {
    Libraries     []Library
    ActiveLibrary string
	FirstRun bool
}

type Library struct {
    Name       string
    Path       string
    LastOpened string
}