/*
Copyright 2019 The Kubernetes Authors.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

package main

import (
	"encoding/json"
	"io/ioutil"
	"log"
	"net/http"
	"reflect"
	"strings"

	"github.com/gorilla/mux"
	"github.com/kubernetes/release/pkg/notes"
)

func main() {
	files, err := ioutil.ReadDir("./notes/")
	if err != nil {
		log.Fatal(err)
	}

	NotesData := []notes.ReleaseNote{}

	for _, file := range files {
		var tmpNotes []notes.ReleaseNote
		content, err := ioutil.ReadFile("./notes/" + file.Name())
		if err != nil {
			log.Fatal(err)

		}

		if err := json.Unmarshal(content, &tmpNotes); err != nil {
			log.Fatalln(err)
		}

		NotesData = append(NotesData, tmpNotes...)

	}

	log.Printf("Loaded %d notes\n", len(NotesData))

	r := mux.NewRouter()
	// Loads the Angular page
	r.HandleFunc("/", HomeHandler)

	// Queries the in-memory relnotes
	r.HandleFunc("/data", func(w http.ResponseWriter, r *http.Request) {
		DataHandler(w, r, NotesData)
	})

	// Queries the in-memory relnotes
	r.HandleFunc("/options", func(w http.ResponseWriter, r *http.Request) {
		OptionsHandler(w, r, NotesData)
	})

	// Handle all that lovely static content
	r.PathPrefix("/").Handler(http.FileServer(http.Dir("./dist/")))

	http.Handle("/", r)

	log.Println("Listening on port 8080")

	log.Fatal(http.ListenAndServe("localhost:8080", r))
}

func HomeHandler(w http.ResponseWriter, r *http.Request) {
}

func OptionsHandler(w http.ResponseWriter, _ *http.Request, notesData []notes.ReleaseNote) {
	sigs := make(map[string]string)
	kinds := make(map[string]string)
	areas := make(map[string]string)
	versions := make(map[string]string)
	var options []map[string]interface{}

	log.Printf("Options generated for %d notes\n", len(notesData))

	for i := range notesData {
		note := notesData[i]

		for _, v := range note.SIGs {
			sigs[v] = ""
		}
		for _, v := range note.Kinds {
			kinds[v] = ""
		}
		for _, v := range note.Areas {
			areas[v] = ""
		}
		versions[note.ReleaseVersion] = ""
	}

	options = append(options,
		map[string]interface{}{"SIGs": sigs},
		map[string]interface{}{"Kinds": kinds},
		map[string]interface{}{"Areas": areas},
		map[string]interface{}{"ReleaseVersion": versions})

	payload, err := json.Marshal(options)
	if err != nil {
		log.Println(err)
	}

	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Content-Type", "application/json")
	if _, err := w.Write(payload); err != nil {
		log.Println(err)
	}

}

func DataHandler(w http.ResponseWriter, r *http.Request, notesData []notes.ReleaseNote) {
	var filteredNotes []notes.ReleaseNote

	if len(r.URL.Query()) > 0 {
		for i := range notesData {
			note := notesData[i]
			for key, value := range r.URL.Query() {
				switch key {
				case "Areas":
					if checkArray(value[0], note.Areas) {
						filteredNotes = append(filteredNotes, note)
						break
					}
				case "SIGs":
					if checkArray(value[0], note.SIGs) {
						filteredNotes = append(filteredNotes, note)
						break
					}
				case "Kinds":
					if checkArray(value[0], note.Kinds) {
						filteredNotes = append(filteredNotes, note)
						break
					}
				case "ReleaseVersion":
					if strings.Contains(value[0], note.ReleaseVersion) {
						filteredNotes = append(filteredNotes, note)
						break
					}
				default:
					r := reflect.ValueOf(note)
					f := reflect.Indirect(r).FieldByName(key)

					if len(value[0]) > 0 && strings.Contains(strings.ToUpper(f.String()),
						strings.ToUpper(value[0])) {
						filteredNotes = append(filteredNotes, note)
						break
					}
				}
			}
		}
	} else {
		filteredNotes = notesData
	}

	log.Printf("Sending %d notes as JSON\n", len(filteredNotes))

	payload, err := json.Marshal(filteredNotes)
	if err != nil {
		log.Println(err)
	}

	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Content-Type", "application/json")
	if _, err := w.Write(payload); err != nil {
		log.Println(err)
	}

}

func checkArray(query string, noteValue []string) bool {
	for _, v := range noteValue {
		if strings.Contains(query, v) {
			return true
		}
	}
	return false
}
