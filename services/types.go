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
    LastOpendProject string `json:"lastOpenedProject"`
}

type Payload struct {
    Success bool `json:"success"`
    Data string `json:"data"`
}