import { DocType, Documentation, Note } from './notes.model';

export const documentationMock: Documentation = {
  description: 'Relevant information',
  url: 'https://kubernetes.io/docs/concepts/workloads/pods/pod',
  type: DocType.official,
};

export const notesMock: Note[] = [
  {
    commit: 'commit',
    text: 'text',
    markdown: 'markdown',
    author: 'author',
    author_url: 'authorUrl',
    pr_url: 'prUrl',
    pr_number: 1,
    areas: ['area'],
    kinds: ['kind'],
    sigs: ['sig'],
    feature: true,
    duplicate: true,
    action_required: true,
    release_version: 'release_version',
    documentation: [documentationMock],
  },
];
