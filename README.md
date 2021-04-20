# Release Notes

[![Build](https://img.shields.io/badge/master-view%20online-brightgreen.svg)](https://relnotes.k8s.io)
[![Version](https://img.shields.io/badge/package-1.0.0-blue.svg)]()

A lightweight release notes UI to help users keep track of the ever-changing
codebase for Kubernetes.

## Development

Local requirements:

- node/npm
- golang > 1.11 (to run the release-notes JSON tool)
- `git clone https://github.com/kubernetes-sigs/release-notes.git`
  (to generate any additional notes for development)

Run `npm install && npm start` from the root dir to start up the angular
development server (on port `4200`).

```
$ npm install
$ npm start
** Angular Live Development Server is listening on localhost:4200, open your browser on http://localhost:4200/ **
```

Any changes made to the front-end code (under `src/`) will automatically be reflected.

## Build

To build and run the container container:

```
$ npm run docker:build:run
```

It will kick off a multi-stage `docker` build to handle building the angular code and dumping it in a nginx container.

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

- Improved filtering and have selectable or/and logic.
- Generate **Security Content** from PRs with `area/security`.
- Generate **Known Issues** from issues with release milestones attached.
- Generate **New Features** from PRs with `area/feature` label, though no idea how to differentiate what's "new" yet.
- Create structure for **Urgent Upgrade Notes** that can be manually added to a generated release JSON file.
- Create labels and write handling for a potential `area/dependency` label to help generate **External Dependencies**.
- Add support for viewing "alpha" and "beta" release notes, though disabled by default.
- Highlight labels that are selected.
- Rewrite relationship between "options" and "notes"

## Community, discussion, contribution, and support

Learn how to engage with the Kubernetes community on the [community page](http://kubernetes.io/community/).

You can reach the maintainers of this project at:

- [Slack channel](https://kubernetes.slack.com/messages/sig-release)
- [Mailing list](https://groups.google.com/forum/#!forum/kubernetes-sig-release)

### Code of conduct

Participation in the Kubernetes community is governed by the [Kubernetes Code of Conduct](code-of-conduct.md).
