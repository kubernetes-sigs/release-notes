# Release Notes
A lightweight release notes UI to help users keep track of the ever-changing codebase for Kubernetes.

## Development

Local requirements:
* golang > 1.11
* ng-cli (@angular/cli)
* `go get k8s.io/release/cmd/release-notes`

  (to generate any additional notes for development)

Run `npm start` from the root dir to start up both the angular development server (on port `4200`) and the `main.go` process (on port `8080).

```
$ npm start

> relnotes@0.0.0 start /home/jeefy/Code/go/src/github.com/jeefy/relnotes
> concurrently "npm run start:backend" "npm run start:frontend"

[1] 
[1] > relnotes@0.0.0 start:frontend /home/jeefy/Code/go/src/github.com/jeefy/relnotes
[1] > ng serve
[1] 
[0] 
[0] > relnotes@0.0.0 start:backend /home/jeefy/Code/go/src/github.com/jeefy/relnotes
[0] > go run main.go
[0] 
[0] 2019/03/02 18:37:56 Loaded 109 notes
[0] 2019/03/02 18:37:56 Listening on port 8080
[1] ** Angular Live Development Server is listening on localhost:4200, open your browser on http://localhost:4200/ **
```

Any changes made to the front-end code (under `src/`) will automatically be reflected. Changes to `main.go` require restarting the `npm start` process.

## Build

To build the container, run

```
$ docker build -t release_notes .
```

It will kick off a multi-stage `docker` build to handle the golang binary and the angular code.

Once complete, you can run it using:
```
$ docker run -d -p8080:8080 release_notes
```

## FAQ

### Why?
Release notes can and should be better. Empowering end-users to view what they need, while also being able to highlight **important** info, is our goal.

It does involve some engineering effort, but this is a case where technology can help us and we should not incur much technical debt.

Also it's cool.

### Can this be used for other projects?
With some changes, this could become a generic tool. There are no immediate plans to do that though.

## Roadmap 
Some of these may be blocked by external dependencies (such as GitHub labels not existing)

In no particular order:

* Improved filtering and have selectable or/and logic.
* Generate **Security Content**  from PRs with `area/security`.
* Generate **Known Issues** from issues with release milestones attached.
* Generate **New Features** from PRs with `area/feature` label, though no idea how to differentiate what's "new" yet.
* Create structure for **Urgent Upgrade Notes** that can be manually added to a generated release JSON file.
* Create labels and write handling for a potential `area/dependency` label to help generate **External Dependencies**.
* Add support for viewing "alpha" and "beta" release notes, though disabled by default.
* Highlight labels that are selected.
* Rewrite relationship between "options" and "notes"