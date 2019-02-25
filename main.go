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

	var NotesData []notes.ReleaseNote

	for _, file := range files {
		var tmpNotes []notes.ReleaseNote
		content, err := ioutil.ReadFile("./notes/" + file.Name())
		if err != nil {
			log.Fatal(err)

		}

		json.Unmarshal(content, &tmpNotes)

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
	r.PathPrefix("/static/").Handler(http.StripPrefix("/static/", http.FileServer(http.Dir("./static/"))))

	http.Handle("/", r)

	log.Println("Listening on port 8080")

	log.Fatal(http.ListenAndServe("localhost:8080", r))
}

func HomeHandler(w http.ResponseWriter, r *http.Request) {
	return
}

func OptionsHandler(w http.ResponseWriter, r *http.Request, notesData []notes.ReleaseNote) {
	sigs := make(map[string]string)
	kinds := make(map[string]string)
	areas := make(map[string]string)
	versions := make(map[string]string)
	var options []map[string]interface{}

	log.Printf("Options generated for %d notes\n", len(notesData))

	for _, note := range notesData {
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

	options = append(options, map[string]interface{}{
		"SIGs": sigs,
	})

	options = append(options, map[string]interface{}{
		"Kinds": kinds,
	})
	options = append(options, map[string]interface{}{
		"Areas": areas,
	})
	options = append(options, map[string]interface{}{
		"ReleaseVersion": versions,
	})

	payload, err := json.Marshal(options)
	if err != nil {
		log.Println(err)
	}

	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Content-Type", "application/json")
	w.Write(payload)

}

func DataHandler(w http.ResponseWriter, r *http.Request, notesData []notes.ReleaseNote) {
	var filteredNotes []notes.ReleaseNote

	if len(r.URL.Query()) > 0 {

		for _, note := range notesData {
			for key, value := range r.URL.Query() {
				if key == "Areas" {
					if checkArray(value[0], note.Areas) {
						filteredNotes = append(filteredNotes, note)
						break
					}
				} else if key == "SIGs" {
					if checkArray(value[0], note.SIGs) {
						filteredNotes = append(filteredNotes, note)
						break
					}
				} else if key == "Kinds" {
					if checkArray(value[0], note.Kinds) {
						filteredNotes = append(filteredNotes, note)
						break
					}
				} else if key == "ReleaseVersion" {
					if strings.Contains(value[0], note.ReleaseVersion) {
						filteredNotes = append(filteredNotes, note)
						break
					}
				} else {
					r := reflect.ValueOf(note)
					f := reflect.Indirect(r).FieldByName(key)

					if strings.Contains(string(f.String()), value[0]) {
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
	w.Write(payload)

}

func checkArray(query string, noteValue []string) bool {
	for _, v := range noteValue {
		if strings.Contains(query, v) {
			return true
		}
	}
	return false
}
