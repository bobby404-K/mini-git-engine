export type GitObjectType = 'blob' | 'tree' | 'commit' | 'tag';

export interface GitObject {
  type: GitObjectType;
  sha: string;
  data: Buffer;
}

export interface TreeEntry {
  mode: string;
  name: string;
  sha: string;
}

export interface CommitMeta {
  tree: string;
  parent?: string;
  author: string;
  message: string;
  timestamp: number;
}
