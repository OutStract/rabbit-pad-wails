package services


func failure(id, action, message string, error error) Payload {
	payload := Payload{
		Id: id,
		Success: false,
		Action: action,
		Error: error,
		Message: message,
		Data: nil,
	}
	return payload
}

func success(id, action, message string, data any) Payload {
	payload := Payload{
		Id: id,
		Success: true,
		Action: action,
		Error: nil,
		Message: message,
		Data: data,
	}
	return payload
}