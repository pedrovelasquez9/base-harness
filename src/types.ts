// The harness data structures: only the SHAPE of the data, no logic.

export type JsonObject = { [key: string]: unknown };

export type ChatMessage = { role: "user" | "assistant"; content: unknown };

export type ContentBlock =
  | { type: "text"; text: string }
  | { type: "tool_use"; id: string; name: string; input: JsonObject };

export type ToolResult = { type: "tool_result"; tool_use_id: string; content: string };

export type ToolSchema = { name: string; description: string; inputSchema: JsonObject };

export type CompletionRequest = {
  messages: ChatMessage[];
  system?: string;
  tools?: ToolSchema[];
  maxTokens?: number;
};

export type AssistantMessage = { content: ContentBlock[]; stopReason: string };

// The abstraction the whole harness depends on (Dependency Inversion).
export interface LlmProvider {
  complete(request: CompletionRequest): Promise<AssistantMessage>;
  countTokens(messages: ChatMessage[]): Promise<number>;
}
