# Release Notes

[![Build](https://img.shields.io/badge/master-view%20online-brightgreen.svg)](https://relnotes.k8s.io)
[![Version](https://img.shields.io/badge/package-1.0.0-blue.svg)]()

A lightweight release notes UI to help users keep track of the ever-changing
codebase for Kubernetes.

Built with Angular, TypeScript, and Bootstrap.

## Development

### Prerequisites

**Required:**

- Node.js and npm (see `package.json` engines field for version requirements)

**Optional (only needed to generate new release notes):**

- Go
- [release-notes CLI tool](https://github.com/kubernetes-sigs/release-notes) to generate JSON files

### Getting Started

Run `npm install && npm start` from the root directory to start the Angular development server on port 4200:

```bash
npm install
npm start
```

The application will be available at http://localhost:4200/

Any changes made to the source code (under `src/`) will automatically trigger a rebuild.

## Build

### Docker Build

To build the containerized application:

```bash
npm run docker:build
```

This runs a Docker build that sets up the development environment for the Angular application.

## FAQ

### Why?

Release notes can and should be better. Empowering end-users to view what they need, while also being able to highlight **important** info, is our goal.

It does involve some engineering effort, but this is a case where technology can help us and we should not incur much technical debt.

Also it's cool.

### Can this be used for other projects?

With some changes, this could become a generic tool. There are no immediate plans to do that though.

## Roadmap

Some of these may be blocked by external dependencies (such as GitHub labels not existing):

- Advanced filtering with AND/OR logic
- Generate **Security Content** from PRs with `area/security`
- Generate **Known Issues** from issues with release milestones
- Generate **New Features** from PRs with `area/feature` label
- Create structure for **Urgent Upgrade Notes**
- Generate **External Dependencies** from `area/dependency` label
- Highlight selected filter labels
- Improved relationship between "options" and "notes"

## Community, discussion, contribution, and support

Learn how to engage with the Kubernetes community on the [community page](http://kubernetes.io/community/).

You can reach the maintainers of this project at:

- [Slack channel](https://kubernetes.slack.com/messages/sig-release)
- [Mailing list](https://groups.google.com/forum/#!forum/kubernetes-sig-release)

### Code of conduct

Participation in the Kubernetes community is governed by the [Kubernetes Code of Conduct](code-of-conduct.md).
