package main

import (
	"encoding/json"
	"fmt"
	"log"
	"os"
	"path/filepath"
	"app/services"
)

func main() {
	
	result := readTree(".")

	formattedResult, err := json.MarshalIndent(result, "", "    " )

	if err != nil {
		log.Println(err)
	}

	fmt.Println(string(formattedResult))

	file := services.ReadService("./test.md")

	fmt.Println(file)

}

type Folder struct {
		Name string
		Path string
		IsFolder bool
		Children []any
	}

	type File struct {
		Name string
		Path string
		IsFolder bool
	}

func readTree(root string) []any {
	tree := []any{}
	
	nodes, err := os.ReadDir(root)
	if err != nil {
		log.Println(err)
	}

	for _, node := range nodes {
		fullpath := filepath.Join(root, node.Name())
		if node.IsDir() {
			node := Folder {
				Name: node.Name(),
				Path: fullpath,
				IsFolder: node.IsDir(),
				Children: readTree(fullpath) ,
			} 
			tree = append(tree, node )
		} else {
			node := File {
				Name: node.Name(),
				Path: fullpath,
				IsFolder: node.IsDir(),
			}

			tree = append(tree, node)
		}
	}
	return tree
}
