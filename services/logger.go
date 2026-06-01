package services


import "fmt"

const (
	Reset = "\033[0m"

	Red = "\033[31m" //Error
	Green = "\033[32m"  // Success
	Yellow = "\033[33m" //Alerts
	Blue = "\033[34m" // Information
	Purple = "\033[35m"
	Cyan = "\033[36m"
)

func LogError(service, msg string, arg ...any) {
	fmt.Println("==========", Red + service + Reset ,"==========")
	fmt.Println(Red + msg + Reset, arg)
	fmt.Println("---------------------------")
}

func LogInfo(service, msg string, arg ...any) {
	fmt.Println("==========", Blue + service + Reset ,"==========")
	fmt.Println(Blue + msg + Reset, arg)
	fmt.Println("---------------------------")
}

func LogAlerts(service, msg string, arg ...any) {
	fmt.Println("==========", Yellow + service + Reset ,"==========")
	fmt.Println(Yellow + msg + Reset, arg)
	fmt.Println("---------------------------")
}

func LogSuccess(service, msg string, arg ...any) {
	fmt.Println("==========", Green + service + Reset ,"==========")
	fmt.Println(Green + msg + Reset, arg)
	fmt.Println("---------------------------")
}