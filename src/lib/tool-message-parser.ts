/**
 * Tool completion message parser
 * Centralizes parsing logic for tool execution results
 */

interface ParsedToolResult {
  type: "create" | "edit" | "close" | null;
  issueNumber?: string;
  title?: string;
  success: boolean;
}

/**
 * Patterns for detecting tool completion messages
 */
const TOOL_PATTERNS = {
  create: {
    pattern: /✅ Issue successfully created!/,
    titleRegex: /Title: ([^\n]+)/
  },
  edit: {
    pattern: /✅ Issue #(\d+) successfully updated!/,
    issueRegex: /Issue #(\d+)/,
    titleRegex: /Title: ([^\n]+)/
  },
  close: {
    pattern: /✅ Issue #(\d+) successfully closed!/,
    issueRegex: /Issue #(\d+)/,
    titleRegex: /Title: ([^\n]+)/
  }
} as const;

/**
 * Parse a tool completion message and extract relevant information
 * @param text - The tool result text
 * @returns Parsed result with type, issue number, and title
 */
export const parseToolCompletionMessage = (text: string): ParsedToolResult => {
  // Check for issue creation
  if (TOOL_PATTERNS.create.pattern.test(text)) {
    const titleMatch = text.match(TOOL_PATTERNS.create.titleRegex);
    return {
      type: "create",
      title: titleMatch ? titleMatch[1] : undefined,
      success: true
    };
  }

  // Check for issue edit (must check before close to avoid false positives)
  if (text.includes("✅ Issue #") && text.includes("successfully updated!")) {
    const issueMatch = text.match(TOOL_PATTERNS.edit.issueRegex);
    const titleMatch = text.match(TOOL_PATTERNS.edit.titleRegex);
    return {
      type: "edit",
      issueNumber: issueMatch ? issueMatch[1] : undefined,
      title: titleMatch ? titleMatch[1] : undefined,
      success: true
    };
  }

  // Check for issue close
  if (text.includes("✅ Issue #") && text.includes("successfully closed!")) {
    const issueMatch = text.match(TOOL_PATTERNS.close.issueRegex);
    const titleMatch = text.match(TOOL_PATTERNS.close.titleRegex);
    return {
      type: "close",
      issueNumber: issueMatch ? issueMatch[1] : undefined,
      title: titleMatch ? titleMatch[1] : undefined,
      success: true
    };
  }

  return {
    type: null,
    success: false
  };
};

/**
 * Get confirmation modal props based on parsed tool result
 */
export const getConfirmationModalProps = (
  result: ParsedToolResult
): {
  title: string;
  message: string;
  type: "success" | "info" | "warning" | "error";
} | null => {
  if (!result.success) return null;

  const titleText = result.title || "Unknown";

  switch (result.type) {
    case "create":
      return {
        title: "Issue Created",
        message: `Successfully created issue: ${titleText}`,
        type: "success"
      };
    case "edit":
      return {
        title: "Issue Updated",
        message: `Successfully updated issue #${result.issueNumber}: ${titleText}`,
        type: "success"
      };
    case "close":
      return {
        title: "Issue Closed",
        message: `Successfully closed issue #${result.issueNumber}: ${titleText}`,
        type: "success"
      };
    default:
      return null;
  }
};
