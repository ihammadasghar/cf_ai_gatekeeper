import { useEffect, useState } from 'react';
import { Card } from '@/components/card/Card';
import { Loader } from '@/components/loader/Loader';
import { ExclamationMarkIcon} from '@phosphor-icons/react';
import type { GitHubIssue, IssueOperationResult } from '@/lib/interfaces';

interface GitHubIssuesProps {
  repoUrl?: string;
  maxIssues?: number;
  onIssueSelect?: (issue: GitHubIssue) => void;
  refreshTrigger?: number;
}

export const GitHubIssues = ({
  repoUrl,
  maxIssues = 10,
  onIssueSelect,
  refreshTrigger = 0
}: GitHubIssuesProps) => {
  const [issues, setIssues] = useState<GitHubIssue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch from the API endpoint
        const response = (await fetch('/api/github-issues', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ repoUrl, maxIssues })
        }));
        
        const data = ((await response.json()) as IssueOperationResult).data as GitHubIssue[];
        setIssues(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to fetch issues'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchIssues();
  }, [repoUrl, maxIssues, refreshTrigger]);

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex items-center justify-center p-4">
        <Card className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
          <div className="flex gap-3 items-start">
            <ExclamationMarkIcon
              size={20}
              className="text-red-600 dark:text-red-400 shrink-0 mt-0.5"
            />
            <div>
              <h3 className="font-semibold text-red-900 dark:text-red-200">
                Error Loading Issues
              </h3>
              <p className="text-sm text-red-800 dark:text-red-300 mt-1">
                {error}
              </p>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="px-4 py-3 border-b border-neutral-300 dark:border-neutral-800 sticky top-0 z-10 bg-neutral-50 dark:bg-neutral-900">
        <h2 className="font-semibold text-base">Open Issues</h2>
        <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">
          {issues.length} issue{issues.length !== 1 ? 's' : ''}
        </p>
      </div>

      <div className="flex-1 overflow-y-auto">
        {issues.length === 0 ? (
          <div className="flex items-center justify-center h-full p-4">
            <Card className="text-center bg-neutral-100 dark:bg-neutral-900">
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                No open issues found
              </p>
            </Card>
          </div>
        ) : (
          <div className="space-y-2 p-4">
            {issues.map((issue) => (
              <button
                key={issue.id}
                onClick={() => onIssueSelect?.(issue)}
                className="w-full block text-left group"
              >
                <Card className="p-3 bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-600 transition-colors cursor-pointer">
                  <div className="flex gap-2 items-start">
                    <img
                      src={issue.user.avatar_url}
                      alt={issue.user.login}
                      className="w-6 h-6 rounded-full shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm text-neutral-900 dark:text-neutral-100 group-hover:text-[#F48120] dark:group-hover:text-[#F48120] transition-colors line-clamp-2">
                        #{issue.number}: {issue.title}
                      </h3>
                      <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">
                        {issue.user.login} •{' '}
                        {new Date(issue.updated_at).toLocaleDateString()}
                      </p>
                      {issue.labels.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {issue.labels.map((label) => (
                            <span
                              key={label.name}
                              className="inline-block px-2 py-0.5 text-xs rounded-full text-white"
                              style={{
                                backgroundColor: `#${label.color}`,
                                opacity: 0.8
                              }}
                            >
                              {label.name}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
