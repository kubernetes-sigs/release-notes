import { Note } from './notes.model';

export const notesMock: Note[] = [
  {
    commit: 'commit',
    text: 'text',
    markdown: 'markdown',
    author: 'author',
    authorUrl: 'authorUrl',
    prUrl: 'prUrl',
    prNumber: 1,
    areas: ['area'],
    kinds: ['kind'],
    sigs: ['sig'],
    feature: true,
    duplicate: true,
    action_required: true,
    release_version: 'release_version',
  },
];
