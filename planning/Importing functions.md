## How to expose the go functions to the frontend
 1. Make a struct inside the file of whose functinos you want to expose, the package of that file will be the same name as the folder its in.
**Example**
- package services
- type StartUpServices struct {}

2. When mainking functions add the (variable *Structname) 
**example** 
- func (**s **StartUpServices*) ConfigCheck() bool

- The variable s can be used to access the data inside the struct if you have any 
**Example**
- type StartUpServices struct {
    ConfigPath string //this is the data inside the struct
}
*Returning data from the function*
- return s.ConfigPath // returning the data inside the struct

- Adding the struct name along with the variable *StartUpName, tell go that this function belongs to that struct and * is used as a pointer to the struct
- having * with struct name help other functions belonging to that struct access the same data

3. Inside the main.go file import the package using the moduleName/folderName
   **Example**
- "rabbit-pad/services"
- The module name can be found inside the go.mod file

4. Then initialize the services using with serviceName := &packageName.StructName{}
  **Example** 
- startupServices := &services.StartUpServices{}

5. Bind them inside the bind: slice
**Example**
Bind: []interface{}{
			app,
			*startupServices*,
		},

6. Import them to the frontend files
**Example**
import { ConfigCheck } from '../wailsjs/go/services/StartUpServices.js';