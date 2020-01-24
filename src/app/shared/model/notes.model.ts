export interface Kep {
  id: string;
  title: string;
  authors: string[];
  owningSig: string;
  participatingSigs: string[];
  reviewers: string[];
  approvers: string[];
  editor: string;
  creationDate: Date;
  lastUpdated: Date;
  status: string;
  seeAlso: string[];
  replaces: string[];
  supersededBy: string[];
  markdown: string;
}
