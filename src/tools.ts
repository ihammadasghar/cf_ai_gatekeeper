/**
 * Tool definitions for the AI chat agent
 * Tools can either require human confirmation or execute automatically
 */
import { tool, type ToolSet } from "ai";
import { z } from "zod/v3";

import { env } from "cloudflare:workers";
import { getRepoFromEnv } from "@/lib/github-utils";
import {
  createGitHubIssue,
  editGitHubIssue,
  closeGitHubIssue,
  getIssueTemplate
} from "@/lib/github-issues";
import { TOOL_DESCRIPTIONS, ISSUE_BODY_GUIDELINES } from "@/lib/prompts";

/**
 * GitHub issue creation tool that drafts and creates issues
 * This tool uses the GitHub API to create issues based on user input
 * It leverages an AI model to format the issue according to a template
 * and then posts the issue directly to the repository
 */

const template = await getIssueTemplate(env.GITHUB_TOKEN, env.GITHUB_REPO_URL);
const createTicketForGithubRepo = tool({
  description: TOOL_DESCRIPTIONS.createIssue.description,
  inputSchema: z.object({
    body: z.string().describe(`${ISSUE_BODY_GUIDELINES} ${template}`),
    title: z.string().describe(TOOL_DESCRIPTIONS.createIssue.titleDescription),
    labels: z.string().describe(TOOL_DESCRIPTIONS.createIssue.labelsDescription)
  })
});

const editTicketForGithubRepo = tool({
  description: TOOL_DESCRIPTIONS.editIssue.description,
  inputSchema: z.object({
    issueNumber: z
      .number()
      .describe(TOOL_DESCRIPTIONS.closeIssue.numberDescription),
    body: z
      .string()
      .describe(`${ISSUE_BODY_GUIDELINES} ${template}`)
      .optional(),
    title: z
      .string()
      .describe(TOOL_DESCRIPTIONS.editIssue.titleDescription)
      .optional(),
    labels: z
      .string()
      .describe(TOOL_DESCRIPTIONS.editIssue.labelsDescription)
      .optional()
  })
});

const closeTicketForGithubRepo = tool({
  description: TOOL_DESCRIPTIONS.closeIssue.description,
  inputSchema: z.object({
    issueNumber: z
      .number()
      .describe(TOOL_DESCRIPTIONS.closeIssue.numberDescription),
    reason: z
      .string()
      .describe(TOOL_DESCRIPTIONS.closeIssue.reasonDescription)
      .optional()
  })
});

export const tools = {
  createTicketForGithubRepo,
  editTicketForGithubRepo,
  closeTicketForGithubRepo
} satisfies ToolSet;

/**
 * Implementation of confirmation-required tools
 * Delegates to reusable GitHub issue operations
 */
export const executions = {
  createTicketForGithubRepo: async ({
    body,
    title,
    labels
  }: {
    body: string;
    title: string;
    labels: string;
  }) => {
    const [owner, repo] = getRepoFromEnv(env.GITHUB_REPO_URL);
    const result = await createGitHubIssue({
      token: env.GITHUB_TOKEN,
      owner,
      repo,
      title,
      body,
      labels
    });
    return result.message;
  },

  editTicketForGithubRepo: async ({
    issueNumber,
    body,
    title,
    labels
  }: {
    issueNumber: number;
    body?: string;
    title?: string;
    labels?: string;
  }) => {
    const [owner, repo] = getRepoFromEnv(env.GITHUB_REPO_URL);
    const result = await editGitHubIssue({
      token: env.GITHUB_TOKEN,
      owner,
      repo,
      issueNumber,
      title,
      body,
      labels
    });
    return result.message;
  },

  closeTicketForGithubRepo: async ({
    issueNumber,
    reason
  }: {
    issueNumber: number;
    reason?: string;
  }) => {
    const [owner, repo] = getRepoFromEnv(env.GITHUB_REPO_URL);
    const result = await closeGitHubIssue({
      token: env.GITHUB_TOKEN,
      owner,
      repo,
      issueNumber,
      reason
    });
    return result.message;
  }
};
