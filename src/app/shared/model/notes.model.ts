export interface Note {
  commit: string;
  text: string;
  markdown: string;
  author: string;
  author_url: string;
  pr_url: string;
  pr_number: number;
  areas: string[];
  kinds: string[];
  sigs: string[];
  feature: boolean;
  duplicate: boolean;
  action_required: boolean;
  release_version: string;
  documentation: Documentation[];
  renderedHtml?: string;
}

export interface Documentation {
  description: string | null;
  url: string;
  type: DocType;
}

export enum DocType {
  external = 1,
  kep,
  official,
}
