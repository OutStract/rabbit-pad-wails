// utils/types.go
package services

type AppState struct {
    Libraries     []Library `json:"libraries"`
    ActiveLibrary string `json:"activeLibrary"`
}

type Library struct {
    Name       string `json:"name"`
    Path       string `json:"path"`
}

type LibraryState struct {
    LastOpenedProject string `json:"lastOpenedProject"`
}

type Payload struct {
    Id string `json:"id"`
    Success bool `json:"success"`
    Action string `json:"action"`
    Error error `json:"error"`
    Message string `json:"message"`
    Data any `json:"data"`
}

type Settings struct {
    Developer bool
    Debug bool
}

