import {
  getGitHubHeaders,
  getRepoFromEnv,
  parseLabelsString
} from "./github-utils";
import type { GitHubIssue, IssueOperationResult } from "./interfaces";
import { logger } from "./logger";

/**
 * Search for issues across a repo using a query string
 */
export const getIssues = async (params: {
  token: string;
  owner: string;
  repo: string;
  query: string; // e.g., "state:open label:bug"
}): Promise<IssueOperationResult> => {
  const { owner, repo, query } = params;
  // Construct a scoped search query
  const fullQuery = `repo:${owner}/${repo} ${query}`;
  logger.info("Starting: Search GitHub Issues", {
    owner,
    repo,
    query: fullQuery
  });

  try {
    const response = await fetch(
      `https://api.github.com/search/issues?q=${encodeURIComponent(fullQuery)}`,
      { headers: getGitHubHeaders(params.token) }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Search failed: ${response.status} - ${errorText}`);
    }

    const data = (await response.json()) as {
      total_count: number;
      items: GitHubIssue[];
    };
    return {
      success: true,
      message: `Found ${data.total_count} matching issues.`,
      data: data.items as GitHubIssue[]
    };
  } catch (error) {
    logger.error("Failed to search issues", {
      owner,
      repo,
      error: String(error)
    });
    return { success: false, message: "Search failed", error: String(error) };
  }
};

/**
 * Internal helper to fetch a single issue.
 * Used for verification when the API returns a 500.
 */
export const getGitHubIssue = async (params: {
  token: string;
  owner: string;
  repo: string;
  issueNumber: number;
}): Promise<GitHubIssue | null> => {
  const { token, owner, repo, issueNumber } = params;
  try {
    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/issues/${issueNumber}`,
      { headers: getGitHubHeaders(token) }
    );
    if (!response.ok) return null;
    return (await response.json()) as GitHubIssue;
  } catch {
    return null;
  }
};

export const createGitHubIssue = async (params: {
  token: string;
  owner: string;
  repo: string;
  title: string;
  body: string;
  labels?: string;
}): Promise<IssueOperationResult> => {
  const { owner, repo, title, body, labels: labelsStr } = params;
  logger.info("Starting: Create GitHub Issue", { owner, repo, title });

  try {
    const labels = parseLabelsString(labelsStr || "");
    const headers = getGitHubHeaders(params.token);

    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/issues`,
      {
        method: "POST",
        headers,
        body: JSON.stringify({
          title,
          body,
          labels: labels.length > 0 ? labels : undefined
        })
      }
    );

    // Note: Verification for 'Create' is difficult because we don't have a number yet.
    // If you get a 500 on Create, it's safer to report the error.
    if (!response.ok) {
      const errorData = await response.text();
      logger.error("GitHub API Error: Create Issue", {
        status: response.status,
        error: errorData
      });
      return {
        success: false,
        message: `Error: ${response.status}`,
        error: errorData
      };
    }

    const issue = (await response.json()) as GitHubIssue;
    logger.info("Success: GitHub Issue Created", { issueNumber: issue.number });

    return {
      success: true,
      message: `✅ Issue created: ${issue.html_url}`,
      issue
    };
  } catch (error) {
    return {
      success: false,
      message: "Exception occurred",
      error: String(error)
    };
  }
};

export const editGitHubIssue = async (params: {
  token: string;
  owner: string;
  repo: string;
  issueNumber: number;
  title?: string;
  body?: string;
  labels?: string;
}): Promise<IssueOperationResult> => {
  const {
    token,
    owner,
    repo,
    issueNumber,
    title,
    body,
    labels: labelsStr
  } = params;
  logger.info("Starting: Edit GitHub Issue", { owner, repo, issueNumber });

  try {
    const labels = labelsStr ? parseLabelsString(labelsStr) : undefined;
    const headers = getGitHubHeaders(token);

    const updatePayload: Record<string, unknown> = {};
    if (title !== undefined) updatePayload.title = title;
    if (body !== undefined) updatePayload.body = body;
    if (labels !== undefined) updatePayload.labels = labels;

    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/issues/${issueNumber}`,
      {
        method: "PATCH",
        headers,
        body: JSON.stringify(updatePayload)
      }
    );

    // Verification Logic for 500
    if (response.status === 500) {
      logger.info("Received 500 on Edit, verifying update...", { issueNumber });
      const verifiedIssue = await getGitHubIssue({
        token,
        owner,
        repo,
        issueNumber
      });

      // If we can fetch it and the title matches, the update likely succeeded
      if (verifiedIssue && (title ? verifiedIssue.title === title : true)) {
        return {
          success: true,
          message: `✅ Issue #${issueNumber} updated (Verified after 500).`,
          issue: verifiedIssue
        };
      }
    }

    if (!response.ok) {
      const errorData = await response.text();
      return { success: false, message: "Failed to update", error: errorData };
    }

    const issue = (await response.json()) as GitHubIssue;
    return {
      success: true,
      message: `✅ Issue #${issueNumber} updated!`,
      issue
    };
  } catch (error) {
    return {
      success: false,
      message: "Exception occurred",
      error: String(error)
    };
  }
};

export const closeGitHubIssue = async (params: {
  token: string;
  owner: string;
  repo: string;
  issueNumber: number;
  reason?: string;
}): Promise<IssueOperationResult> => {
  const { token, owner, repo, issueNumber } = params;
  logger.info("Starting: Close GitHub Issue", { owner, repo, issueNumber });

  try {
    const headers = getGitHubHeaders(token);
    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/issues/${issueNumber}`,
      {
        method: "PATCH",
        headers,
        body: JSON.stringify({
          state: "closed",
          state_reason: params.reason ? params.reason : "completed"
        })
      }
    );

    if (response.status === 500) {
      logger.info("Received 500 on Close, verifying status...", {
        issueNumber
      });
      const verifiedIssue = await getGitHubIssue({
        token,
        owner,
        repo,
        issueNumber
      });
      if (verifiedIssue?.state === "closed") {
        return {
          success: true,
          message: `✅ Issue #${issueNumber} closed (Verified after 500).`,
          issue: verifiedIssue
        };
      }
    }

    if (!response.ok) {
      const errorData = await response.text();
      return {
        success: false,
        message: "Error closing issue",
        error: errorData
      };
    }

    const issue = (await response.json()) as GitHubIssue;
    return {
      success: true,
      message: `✅ Issue #${issueNumber} closed!`,
      issue
    };
  } catch (error) {
    return {
      success: false,
      message: "Exception occurred",
      error: String(error)
    };
  }
};

/**
 * Fetches issue template content from the GitHub repository
 * @returns Issue template content as a string
 * @throws Error if fetching fails or template is not found
 */
export const getIssueTemplate = async (
  token: string,
  url: string
): Promise<string> => {
  const headers = getGitHubHeaders(token);

  const [owner, repo] = getRepoFromEnv(url);

  const filesFetchUrl = `https://raw.githubusercontent.com/${owner}/${repo}/main`;
  const template = await fetch(
    `${filesFetchUrl}/.github/ISSUE_TEMPLATE/general_task.md`,
    {
      headers
    }
  ).then((res) => res.text());
  return template;
};
