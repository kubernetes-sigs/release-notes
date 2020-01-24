import { Kep } from './notes.model';

export const notesMock: Kep[] = [
  {
    id: 'id',
    title: 'title',
    authors: [],
    owningSig: 'sig-cloud-provider',
    participatingSigs: ['sig-node'],
    reviewers: [],
    approvers: [],
    editor: '',
    creationDate: new Date(),
    lastUpdated: new Date(),
    status: '',
    seeAlso: [],
    replaces: [],
    supersededBy: [],
    markdown: '',
  },
];
