export interface GitHubIssue {
  id: number;
  number: number;
  title: string;
  body?: string;
  state: string;
  labels: Array<{ name: string; color: string }>;
  created_at: string;
  updated_at: string;
  html_url: string;
  user: {
    login: string;
    avatar_url: string;
  };
}

export interface IssueOperationResult {
  success: boolean;
  message: string;
  issue?: GitHubIssue;
  data?: GitHubIssue[];
  error?: string;
}
