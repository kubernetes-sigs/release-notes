export interface Note {
  commit: string;
  text: string;
  markdown: string;
  author: string;
  authorUrl: string;
  prUrl: string;
  prNumber: number;
  areas: string[];
  kinds: string[];
  sigs: string[];
  feature: boolean;
  duplicate: boolean;
  action_required: boolean;
  release_version: string;
}

export type NoteList = Map<number, Note>;
