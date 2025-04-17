
export interface BlogPost {
  title: string;
  date: string;
  content: string;
  path: string;
  sha: string;
}

export interface GitHubFile {
  name: string;
  path: string;
  sha: string;
  content?: string;
}
