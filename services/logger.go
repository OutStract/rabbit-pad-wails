package services


import "fmt"

func LogError(msg string, arg ...any) {
	fmt.Println("========== ERROR ==========")
	fmt.Println(msg, arg)
	fmt.Println("---------------------------")
}

func LogInfo(msg string, arg ...any) {
	fmt.Println("========== INFO ===========")
	fmt.Println(msg, arg)
	fmt.Println("---------------------------")
}