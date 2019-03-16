# Release Notes
A lightweight release notes UI to help users keep track of the ever-changing codebase for Kubernetes.

## Development

Local requirements:
* ng-cli (@angular/cli)
* golang > 1.11 (to run the release-notes JSON tool)
* `go get k8s.io/release/cmd/release-notes`

  (to generate any additional notes for development)

Run `npm start` from the root dir to start up the angular development server (on port `4200`).

```
$ jeefy@malaz:~/Code/go/src/github.com/jeefy/relnotes(master)$ npm start

> relnotes@0.0.0 start /home/jeefy/Code/go/src/github.com/jeefy/relnotes
> ng serve

** Angular Live Development Server is listening on localhost:4200, open your browser on http://localhost:4200/ **
```

Any changes made to the front-end code (under `src/`) will automatically be reflected.

## Build

To build and run the container container:

```
$ npm run docker:build:run
```

It will kick off a multi-stage `docker` build to handle building the angular code and dumping it in an nginx container.

Once complete, you can view it by going to `localhost` in your browser:

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